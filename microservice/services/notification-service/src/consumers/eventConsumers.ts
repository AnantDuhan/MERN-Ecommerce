import {
  EventBus,
  DomainEvent,
  createLogger,
  type OrderPlacedPayload,
  type UserRegisteredPayload,
} from "@order-planning/shared";
import { config } from "../config";
import { sendEmail } from "../email/sendEmail";
import { renderTemplate } from "../email/render";

const log = createLogger("notification-service");

/**
 * The request-time half of notifications: other services announce that
 * something happened, and this service turns those announcements into email.
 * The publishers (order-service, auth-service) never know email exists — they
 * just emit an event. That decoupling is the whole point of extracting this.
 */
export async function startEventConsumers(bus: EventBus): Promise<void> {
  await bus.subscribe(DomainEvent.OrderPlaced, async (order: OrderPlacedPayload) => {
    const html = await renderTemplate("order-confirmation", {
      order,
      frontendUrl: config.frontendUrl,
    });
    await sendEmail({
      email: order.email,
      subject: "Your Maison order is confirmed",
      html,
    });
    log.info({ orderId: order.orderId }, "order confirmation sent");
  });

  await bus.subscribe(DomainEvent.UserRegistered, async (user: UserRegisteredPayload) => {
    const html = await renderTemplate("newsletter-welcome", {
      name: user.name,
      frontendUrl: config.frontendUrl,
    });
    await sendEmail({ email: user.email, subject: "Welcome to Maison", html });
    log.info({ userId: user.userId }, "welcome email sent");
  });

  log.info("event consumers subscribed");
}
