# Cutover: retiring the monolith

The services were extracted strangler-fig style, so the monolith kept serving
traffic the whole time. This is the checklist to finish the job and turn it off.

## 1. Data: one database → database-per-service

The monolith used a single Mongo database. Each service now owns its own
(`order-planning-auth`, `-catalog`, `-orders`, `-payments`, `-notifications`,
`-analytics`). Migrate collections to their owning service's database:

| From (monolith DB)                  | To (service DB)              |
|-------------------------------------|------------------------------|
| users                               | order-planning-auth          |
| products, banners                   | order-planning-catalog       |
| orders, carts, coupons              | order-planning-orders        |
| (new) payments                      | order-planning-payments      |
| subscribes                          | order-planning-notifications |

Because every `_id` is a string (nanoid), a collection copy needs no id
remapping — `mongodump`/`mongorestore` per collection into the target DB is
enough. Do this while the monolith is still read-authoritative, then run a short
delta sync for anything written during the copy.

- **Search** needs no migration — it's a read model. After catalog's data lands,
  call `POST /api/v1/search/admin/reindex` once to backfill Elasticsearch; events
  keep it current thereafter.
- **Analytics** is event-sourced. Either accept that history starts at cutover,
  or write a one-off replayer that reads historical orders and publishes
  `OrderPlaced` for each (the exactly-once guard keeps a re-run safe).

## 2. Frontend: point at the gateway

Change the API base URL to the gateway (`http://localhost:4000` in dev) and add
the per-service prefixes that didn't exist in the monolith's flat routing:

- auth endpoints gain `/auth`: `POST /api/v1/login` → `POST /api/v1/auth/login`,
  `/me` → `/auth/me`, etc.
- product admin/detail/review paths move under `/api/v1/products/...` as defined
  in `catalog-service/src/routes.ts`.
- orders/cart/coupons under `/api/v1/orders/...`; payment under
  `/api/v1/payment/...`; search under `/api/v1/search`.

Everything else the gateway proxies unchanged.

## 3. Traffic cutover

1. Deploy all services + the gateway alongside the monolith.
2. Move the frontend's base URL to the gateway for read-only routes first
   (products, search, banners) and watch error rates.
3. Cut over the write routes (auth, orders, payment) once reads are stable.
4. Keep the monolith running but idle for one rollback window.

## 4. Decommission

- Confirm no traffic hits the monolith (access logs quiet for the rollback
  window).
- Snapshot its database, then retire the instance.
- Remove its deploy config (`render.yaml`, its Dockerfile, its `lb.js`).

## Still to port before full parity

These are live as explicit `501`s naming their source, so nothing is silently
missing:

- catalog: Gemini review summariser; wishlist (moves to the user/account domain,
  not catalog).
- order: return/refund request + admin flow.
- vector/embedding search (keyword + fuzzy is live).
