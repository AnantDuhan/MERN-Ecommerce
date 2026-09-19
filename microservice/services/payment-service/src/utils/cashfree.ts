import crypto from "crypto";
import { config } from "../config";

/**
 * Ported from utils/cashfree.js — the ONLY place in the platform that speaks to
 * Cashfree. Same env-driven base URL, headers, fail-fast timeout, and
 * timing-safe webhook signature check.
 */
const baseUrl = () =>
  config.cashfree.environment === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const headers = () => ({
  "Content-Type": "application/json",
  "x-api-version": config.cashfree.apiVersion,
  "x-client-id": config.cashfree.appId,
  "x-client-secret": config.cashfree.secretKey,
});

export async function cashfreeRequest<T = Record<string, unknown>>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!config.cashfree.appId || !config.cashfree.secretKey) {
    throw new Error("Cashfree credentials are not configured");
  }
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...options,
      headers: { ...headers(), ...(options.headers ?? {}) },
      signal: AbortSignal.timeout(config.cashfree.timeoutMs),
    });
  } catch (err) {
    const e = err as Error;
    throw new Error(
      e.name === "TimeoutError"
        ? "Payment provider timed out. Please try again."
        : "Could not reach the payment provider. Please try again.",
    );
  }
  const data = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) throw new Error(data.message ?? "Cashfree request failed");
  return data;
}

export interface CashfreeOrder {
  order_id: string;
  order_status: string;
  cf_order_id?: string;
  payment_session_id?: string;
}

export const getCashfreeOrder = (orderId: string) =>
  cashfreeRequest<CashfreeOrder>(`/orders/${encodeURIComponent(orderId)}`);

export function verifyWebhookSignature(timestamp: string, rawBody: string, signature: string): boolean {
  if (!timestamp || !rawBody || !signature || !config.cashfree.secretKey) return false;
  const expected = crypto
    .createHmac("sha256", config.cashfree.secretKey)
    .update(timestamp + rawBody)
    .digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
