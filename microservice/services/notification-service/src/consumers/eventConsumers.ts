import {
  EventBus,
  DomainEvent,
  createLogger,
  type OrderPlacedPayload,
  type UserRegisteredPayload,
  type EmailVerificationRequestedPayload,
  type EmailVerifiedPayload,
  type PasswordResetRequestedPayload,
} from "@order-planning/shared";
import { config } from "../config";
import { sendEmail } from "../email/sendEmail";
import { renderTemplate } from "../email/render";

const log = createLogger("notification-service");

const verifyUrl = (token: string) => `${config.frontendUrl}/verify-email/${token}`;
const resetUrl = (token: string) => `${config.frontendUrl}/password/reset/${token}`;

/**
 * notification-service turns domain events from across the platform into email.
 * The publishers (auth, order) never import a mail library or know a template
 * exists — they announce that something happened, and this is the only place
 * that decides an email should go out.
 */
export async function startEventConsumers(bus: EventBus): Promise<void> {
  // Order placed → confirmation
  await bus.subscribe(DomainEvent.OrderPlaced, async (order: OrderPlacedPayload) => {
    if (!order.email) return; // no contact address on the event; nothing to send
    const html = await renderTemplate("order-confirmation", { order, frontendUrl: config.frontendUrl });
    await sendEmail({ email: order.email, subject: "Your Maison order is confirmed", html });
    log.info({ orderId: order.orderId }, "order confirmation sent");
  });

  // Registered → verify-email (welcome is sent later, once verified)
  await bus.subscribe(DomainEvent.UserRegistered, async (user: UserRegisteredPayload) => {
    if (!user.verificationToken) return;
    const html = await renderTemplate("verify-email", {
      name: user.name, verificationURL: verifyUrl(user.verificationToken),
    });
    await sendEmail({ email: user.email, subject: "Verify your email · Maison", html });
    log.info({ userId: user.userId }, "verify email sent");
  });

  // Explicit resend of the verification link
  await bus.subscribe(
    DomainEvent.EmailVerificationRequested,
    async (req: EmailVerificationRequestedPayload) => {
      const html = await renderTemplate("verify-email", {
        name: req.name, verificationURL: verifyUrl(req.verificationToken),
      });
      await sendEmail({ email: req.email, subject: "Verify your email · Maison", html });
      log.info({ email: req.email }, "verify email re-sent");
    },
  );

  // Verified → welcome
  await bus.subscribe(DomainEvent.EmailVerified, async (user: EmailVerifiedPayload) => {
    const html = await renderTemplate("newsletter-welcome", {
      name: user.name, frontendUrl: config.frontendUrl,
    });
    await sendEmail({ email: user.email, subject: "Welcome to Maison", html });
    log.info({ userId: user.userId }, "welcome email sent");
  });

  // Password reset requested → reset link
  await bus.subscribe(
    DomainEvent.PasswordResetRequested,
    async (req: PasswordResetRequestedPayload) => {
      const html = await renderTemplate("forgot-password", {
        name: req.name, activationCode: resetUrl(req.resetToken),
      });
      await sendEmail({ email: req.email, subject: "Reset your Maison password", html });
      log.info({ email: req.email }, "password reset email sent");
    },
  );

  log.info("event consumers subscribed");
}
