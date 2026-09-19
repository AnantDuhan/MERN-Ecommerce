/**
 * The route table: which URL prefix belongs to which service, and whether the
 * gateway must have a verified user before proxying. Adding a service later is
 * a one-line change here — the proxying logic in index.ts is generic.
 *
 * Targets come from env so the same image runs against docker-compose DNS
 * names locally and real hosts in production.
 */
export interface RouteRule {
  prefix: string;
  target: string;
  requireAuth: boolean;
}

export const routes: RouteRule[] = [
  {
    prefix: "/api/v1/auth",
    target: process.env.AUTH_SERVICE_URL ?? "http://auth-service:4001",
    requireAuth: false,
  },
  {
    prefix: "/api/v1/products",
    target: process.env.CATALOG_SERVICE_URL ?? "http://catalog-service:4002",
    requireAuth: false,
  },
  {
    prefix: "/api/v1/search",
    target: process.env.SEARCH_SERVICE_URL ?? "http://search-service:4003",
    requireAuth: false,
  },
  {
    prefix: "/api/v1/orders",
    target: process.env.ORDER_SERVICE_URL ?? "http://order-service:4004",
    requireAuth: true,
  },
  {
    prefix: "/api/v1/payment",
    target: process.env.PAYMENT_SERVICE_URL ?? "http://payment-service:4005",
    requireAuth: true,
  },
  {
    prefix: "/api/v1/notifications",
    target: process.env.NOTIFICATION_SERVICE_URL ?? "http://notification-service:4006",
    requireAuth: false,
  },
];
