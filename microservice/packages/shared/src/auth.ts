import jwt from "jsonwebtoken";
import type { Request, RequestHandler } from "express";

export interface UserContext {
  id: string;
  role: string;
  /**
   * True only after a TOTP challenge in this session. The monolith kept role in
   * the DB and looked it up on every request; here role and mfaVerified travel
   * in the JWT so the gateway can authorize without reaching into auth-service's
   * database. Trade-off: a role change takes effect on the user's next token, so
   * pair this with a short-ish expiry or a revocation list if you need instant
   * demotion. Documented deliberately — it's the kind of thing worth defending
   * in an interview.
   */
  mfaVerified: boolean;
}

/**
 * The gateway is the ONE place that verifies the JWT. It then forwards the
 * caller's identity to services as trusted headers over the internal network.
 * Services never re-parse the token — they read the headers via
 * userFromHeaders(). The gateway strips any client-supplied copies first, so
 * these headers can only have come from the gateway.
 */
export const USER_ID_HEADER = "x-user-id";
export const USER_ROLE_HEADER = "x-user-role";
export const USER_MFA_HEADER = "x-user-mfa";

export function signToken(
  user: UserContext,
  secret: string,
  expiresIn: jwt.SignOptions["expiresIn"] = "90d",
): string {
  return jwt.sign(
    { id: user.id, role: user.role, mfaVerified: user.mfaVerified },
    secret,
    { expiresIn },
  );
}

export function verifyToken(token: string, secret: string): UserContext {
  const d = jwt.verify(token, secret) as {
    id: string;
    role?: string;
    mfaVerified?: boolean;
  };
  return { id: d.id, role: d.role ?? "user", mfaVerified: Boolean(d.mfaVerified) };
}

/** Read the identity the gateway injected. Used inside downstream services. */
export function userFromHeaders(req: Request): UserContext | null {
  const id = req.header(USER_ID_HEADER);
  if (!id) return null;
  return {
    id,
    role: req.header(USER_ROLE_HEADER) ?? "user",
    mfaVerified: req.header(USER_MFA_HEADER) === "true",
  };
}

/** Downstream guard: 401 if the gateway didn't attach a user. */
export const requireUser: RequestHandler = (req, res, next) => {
  const user = userFromHeaders(req);
  if (!user) return res.status(401).json({ message: "Authentication required" });
  (req as Request & { user: UserContext }).user = user;
  next();
};

/**
 * Role guard for services, ported from the monolith's authRoles. Admin access
 * additionally requires a TOTP-verified session — the same rule the monolith
 * enforced, moved here so it protects every service's admin routes uniformly.
 */
export const requireRole =
  (...roles: string[]): RequestHandler =>
  (req, res, next) => {
    const user = userFromHeaders(req);
    if (!user) return res.status(401).json({ message: "Authentication required" });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: `Role ${user.role} is not allowed` });
    }
    if (user.role === "admin" && !user.mfaVerified) {
      return res.status(403).json({ message: "Two-factor authentication is required for admin access" });
    }
    (req as Request & { user: UserContext }).user = user;
    next();
  };
