# Order Planning — Microservices Platform

TypeScript migration + monolith → microservices split of the MAISON / Order
Planning e-commerce backend, using a strangler-fig approach: the original
monolith keeps serving traffic while services are peeled off one at a time
behind the gateway.

## Layout

    packages/shared          Event contracts, Redis event bus, gateway auth
                             header contract, logger, errors, http helpers
    services/api-gateway     Single entry point: verifies JWT once, injects
                             trusted x-user-* headers, rate-limits, proxies
    services/notification-service   First extracted service (email/newsletter)

## Services (target)

| Service               | Owns                                   | Emits / consumes                     |
|-----------------------|----------------------------------------|--------------------------------------|
| api-gateway           | routing, auth, rate limiting           | —                                    |
| auth-service          | user, membership, JWT/OAuth/2FA        | emits UserRegistered                 |
| catalog-service       | product, banner, review                | emits Product{Created,Updated,…}     |
| search-service        | Elasticsearch index + query            | consumes Product*                    |
| order-service         | order, return, refund, reorder, coupon | emits OrderPlaced                    |
| payment-service       | payment (Cashfree), webhooks           | emits Payment{Succeeded,Failed}      |
| notification-service  | email, push, newsletter, subscribe     | consumes OrderPlaced, UserRegistered |
| analytics-service     | rollups (event-sourced read model)     | consumes OrderPlaced, UserRegistered |

## Key decisions

- **Async comms over Redis Streams** with one consumer group per service —
  at-least-once delivery, so a message published while a consumer is down is not
  lost, and a handler that throws is reclaimed and retried. Handlers are
  idempotent (every envelope carries a stable id). Started life as pub/sub; the
  transport swap happened entirely inside `packages/shared/src/eventBus.ts` with
  no change to any handler, which was the point of hiding it behind the bus.
- **Auth in one place.** Only the gateway verifies tokens; services trust the
  `x-user-id` / `x-user-role` headers it injects (and it strips any the client
  sent, so they can't be spoofed).
- **Database per service.** One Mongo instance in dev, one DB name per service.
- **CommonJS TS output + tsx** to stay close to the monolith's require-based code
  and keep the migration low-risk.

## Run locally

    docker compose up --build
    # gateway on :4000, notification-service on :4006

## Roadmap

1. ✅ Foundation: monorepo, shared package, gateway, compose
2. ✅ notification-service (safest seam — no request-path deps)
3. ✅ auth-service — all handlers ported: register/login/2FA, email
   verification, password reset, profile/password/push-token, addresses, Google
   login, 2FA setup/enroll/disable, and admin user management. Email flows emit
   events (`UserRegistered`, `EmailVerificationRequested`, `EmailVerified`,
   `PasswordResetRequested`) that notification-service turns into mail.
4. ✅ catalog-service + search-service — catalog owns products/banners/reviews
   and emits `Product{Created,Updated,Deleted}`; search-service keeps its
   Elasticsearch index eventually consistent purely by consuming those events
   (no shared DB, nothing on catalog's write path). Backfill via
   `POST /api/v1/search/admin/reindex`, which pulls from catalog over HTTP.
5. ✅ order-service + payment-service — the transactional core. Checkout emits
   `OrderPlaced`; payment-service is the sole Cashfree integration and emits
   `PaymentSucceeded`/`PaymentFailed`, which order-service consumes to reconcile.
   Event bus upgraded to Redis Streams here for at-least-once delivery.
6. ✅ analytics-service — event-sourced read model (rollups from `OrderPlaced`
   / `UserRegistered`, exactly-once on top of the at-least-once bus). Monolith
   retirement is documented in `MIGRATION.md`.

All eight services (gateway + 7) are scaffolded and type-check/build clean.
Remaining work is porting the handlers still marked as explicit `501`s (see
`MIGRATION.md`), not new architecture.

## Migration notes (order + payment)

- **Cashfree lives only in payment-service.** order-service never talks to the
  provider — at checkout it calls payment-service to confirm settlement
  (`clients/paymentClient.ts`), forwarding the caller's own credentials so it's
  the user acting, not an ambient service identity.
- **payment-service owns a Payment store.** The monolith tracked payment inside
  `order.paymentInfo`; giving payments their own records makes this service the
  source of truth for settlement.
- **Idempotent checkout.** The partial-unique index on `paymentInfo.id` plus an
  explicit dedupe check make double-submits safe — which matters more now that
  event delivery is at-least-once, so consumers are written to be idempotent too.
- **Confirmation email/push moved out.** `newOrder` no longer sends them inline;
  it emits `OrderPlaced` and notification-service delivers. order-service pulls
  the buyer's email from auth-service for the event (`clients/authClient.ts`).
- **Not reproduced yet:** the return/refund request+admin flow and the Gemini
  pieces are explicit `501`s naming their source; order-item image enrichment
  from catalog is a documented TODO (checkout trusts the client-sent items).

## Migration notes (catalog + search)

- **Read-model split.** catalog-service is the single writer of product data;
  search-service is a read model rebuilt from events. A product write returns
  immediately and the index catches up asynchronously — the eventual-consistency
  trade-off is deliberate and the reason search never reads catalog's database.
- **Events carry the indexable projection** (`ProductIndexDoc`, mirroring the
  monolith's `searchService.toDoc`), so the ES mapping and the event payload
  can't drift. Reviews recompute `ratings`/`numOfReviews` and re-emit
  `ProductUpdated`, so search reflects rating changes too.
- **Wishlist did not move to catalog.** It mutates the User document, so it
  belongs to the user/account domain (auth-service), not catalog — flagged in
  `catalog-service/src/routes.ts`.
- **Not reproduced, by design:** the Gemini review-summariser (`501`, its own AI
  concern) and vector/embedding search (the `embedding` field is carried on the
  model but keyword/fuzzy search is what's wired).

## Migration notes (auth-service)

- **Frontend auth base URL gains an `/auth` segment.** Each service owns one
  namespaced prefix, so `POST /api/v1/login` becomes `POST /api/v1/auth/login`,
  `/me` → `/auth/me`, etc. One base-URL constant change in the frontend.
- **Role + `mfaVerified` now travel in the JWT** (they were DB-looked-up per
  request in the monolith) so the gateway can authorize without touching
  auth-service's database. Trade-off documented in `packages/shared/src/auth.ts`:
  a role change applies on the user's next token.
- **Email is event-driven.** register/resend/forgot no longer send inline; they
  emit events and notification-service renders and sends the mail (verify-email,
  welcome-on-verify, password-reset). In dev, register also returns the
  `verificationToken` in its response so you can verify without a mail provider.
- **Not reproduced, by design:** S3 avatar upload (a media concern) — the
  handlers accept an avatar URL and leave the upload as a `TODO`.
