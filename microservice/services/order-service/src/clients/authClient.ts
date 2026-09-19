import type { Request } from "express";
import { config } from "../config";

/**
 * order-service doesn't own user data, so to put the buyer's email/name on the
 * OrderPlaced event it asks auth-service — forwarding the caller's own
 * credentials, so this is the user acting, not an ambient service identity. The
 * gateway already validated the token; we just pass it along.
 */
export interface AuthedUser { id: string; name: string; email: string; }

export async function getUser(req: Request): Promise<AuthedUser> {
  const res = await fetch(`${config.authServiceUrl}/api/v1/auth/me`, {
    headers: {
      authorization: req.header("authorization") ?? "",
      cookie: req.header("cookie") ?? "",
    },
  });
  if (!res.ok) throw new Error(`auth lookup failed: ${res.status}`);
  const body = (await res.json()) as { user: AuthedUser };
  return body.user;
}
