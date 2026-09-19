/**
 * The event contract shared by every service. Publishers and consumers import
 * these names and payload types so a producer can never emit a shape a
 * consumer isn't expecting — the compiler enforces the contract across the
 * whole platform, which is most of the safety a message schema registry buys
 * you, for free.
 */
export enum DomainEvent {
  UserRegistered = "user.registered",
  ProductCreated = "product.created",
  ProductUpdated = "product.updated",
  ProductDeleted = "product.deleted",
  OrderPlaced = "order.placed",
  OrderPaid = "order.paid",
  PaymentSucceeded = "payment.succeeded",
  PaymentFailed = "payment.failed",
  RefundIssued = "refund.issued",
}

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name: string;
  /** Present on register-time events; notification-service uses it to build the verify-email link. */
  verificationToken?: string;
}

export interface OrderPlacedPayload {
  orderId: string;
  userId: string;
  email: string;
  total: number;
  items: Array<{ productId: string; name: string; qty: number; price: number }>;
}

export interface ProductChangedPayload {
  productId: string;
}

/** Maps each event to its payload type so publish/subscribe are fully typed. */
export interface EventPayloads {
  [DomainEvent.UserRegistered]: UserRegisteredPayload;
  [DomainEvent.OrderPlaced]: OrderPlacedPayload;
  [DomainEvent.OrderPaid]: OrderPlacedPayload;
  [DomainEvent.ProductCreated]: ProductChangedPayload;
  [DomainEvent.ProductUpdated]: ProductChangedPayload;
  [DomainEvent.ProductDeleted]: ProductChangedPayload;
  [DomainEvent.PaymentSucceeded]: { orderId: string; paymentId: string };
  [DomainEvent.PaymentFailed]: { orderId: string; reason: string };
  [DomainEvent.RefundIssued]: { orderId: string; refundId: string; amount: number };
}

export interface EventEnvelope<E extends keyof EventPayloads = keyof EventPayloads> {
  event: E;
  payload: EventPayloads[E];
  /** Set by the publisher; lets consumers dedupe and trace across services. */
  id: string;
  emittedAt: string;
}
