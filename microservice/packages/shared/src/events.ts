/**
 * The event contract shared by every service. Publishers and consumers import
 * these names and payload types so a producer can never emit a shape a consumer
 * isn't expecting — the compiler enforces the contract across the whole
 * platform, which is most of the safety a schema registry buys you, for free.
 */
export enum DomainEvent {
  UserRegistered = "user.registered",
  EmailVerificationRequested = "user.email_verification_requested",
  EmailVerified = "user.email_verified",
  PasswordResetRequested = "user.password_reset_requested",
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

export interface EmailVerificationRequestedPayload {
  email: string;
  name: string;
  verificationToken: string;
}

export interface EmailVerifiedPayload {
  userId: string;
  email: string;
  name: string;
}

export interface PasswordResetRequestedPayload {
  email: string;
  name: string;
  resetToken: string;
}

/**
 * The projection of a product that search-service indexes. Catalog emits this
 * inside product events so search never reads catalog's database — it indexes
 * straight from the event. Mirrors searchService.toDoc() from the monolith.
 */
export interface ProductIndexDoc {
  name: string;
  description: string;
  category: string;
  price: number;
  ratings: number;
  numOfReviews: number;
  Stock: number;
  images: unknown[];
  createdAt: string | Date;
}

export interface ProductUpsertedPayload {
  productId: string;
  product: ProductIndexDoc;
}

export interface ProductDeletedPayload {
  productId: string;
}

export interface OrderPlacedPayload {
  orderId: string;
  userId: string;
  email: string;
  total: number;
  items: Array<{ productId: string; name: string; qty: number; price: number }>;
}

/** Maps each event to its payload type so publish/subscribe are fully typed. */
export interface EventPayloads {
  [DomainEvent.UserRegistered]: UserRegisteredPayload;
  [DomainEvent.EmailVerificationRequested]: EmailVerificationRequestedPayload;
  [DomainEvent.EmailVerified]: EmailVerifiedPayload;
  [DomainEvent.PasswordResetRequested]: PasswordResetRequestedPayload;
  [DomainEvent.OrderPlaced]: OrderPlacedPayload;
  [DomainEvent.OrderPaid]: OrderPlacedPayload;
  [DomainEvent.ProductCreated]: ProductUpsertedPayload;
  [DomainEvent.ProductUpdated]: ProductUpsertedPayload;
  [DomainEvent.ProductDeleted]: ProductDeletedPayload;
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
