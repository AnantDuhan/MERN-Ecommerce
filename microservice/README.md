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
| analytics-service     | aggregates                             | consumes everything (later)          |

## Key decisions

- **Async comms over Redis pub/sub** (already in your stack). Swap the transport
  in `packages/shared/src/eventBus.ts` for Redis Streams when order/payment need
  at-least-once delivery — service code is untouched.
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
3. ✅ auth-service — core flows ported (register→UserRegistered, login+2FA,
   verifyLoginOtp, logout, /me). Remaining user.js handlers are explicit 501s
   naming their source, to port next.
4. ⬜ catalog-service + search-service
5. ⬜ order-service + payment-service (transactional core — last)
6. ⬜ cart/analytics, retire the monolith

## Migration notes (auth-service)

- **Frontend auth base URL gains an `/auth` segment.** Each service owns one
  namespaced prefix, so `POST /api/v1/login` becomes `POST /api/v1/auth/login`,
  `/me` → `/auth/me`, etc. One base-URL constant change in the frontend.
- **Role + `mfaVerified` now travel in the JWT** (they were DB-looked-up per
  request in the monolith) so the gateway can authorize without touching
  auth-service's database. Trade-off documented in `packages/shared/src/auth.ts`:
  a role change applies on the user's next token.
- **Not reproduced, by design:** S3 avatar upload (a media concern) and the
  inline verify-email send (now emitted as `UserRegistered` for
  notification-service to deliver). Both are marked as TODOs in
  `authController.ts` rather than faked.
