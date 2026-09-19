import { config } from "../config";
import { AppError } from "@order-planning/shared";

/**
 * Transactional email via Resend's HTTPS API — ported verbatim in behaviour
 * from the monolith's utils/sendEmail.js (SMTP is blocked on the host, HTTPS
 * is not). Now it's the private outbound channel of a single service.
 */
export interface EmailOptions {
  email: string;
  subject: string;
  html: string;
}

const RESEND_EMAILS_URL = "https://api.resend.com/emails";

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!options.email) throw new AppError("Email recipient is required", 400);
  if (!options.subject) throw new AppError("Email subject is required", 400);
  if (!options.html) throw new AppError("Email HTML content is required", 400);
  if (!config.resendApiKey) throw new AppError("RESEND_API_KEY is not configured", 500);

  const response = await fetch(RESEND_EMAILS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.resendFrom,
      to: options.email,
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new AppError(`Resend rejected the message: ${JSON.stringify(body)}`, 502);
  }
}
