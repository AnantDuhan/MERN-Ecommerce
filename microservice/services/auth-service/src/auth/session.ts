import type { Response } from "express";
import jwt from "jsonwebtoken";
import { signToken } from "@order-planning/shared";
import { config } from "../config";
import type { UserHydrated } from "../models/user";

const cookieOptions = () =>
  ({
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? ("none" as const) : ("lax" as const),
  });

/**
 * Ported from the monolith's issueSession + jwtToken.sendToken. Signs the
 * platform-standard token (id/role/mfaVerified) via the shared helper, sets the
 * httpOnly cookie exactly as before, and returns the user. `mfaVerified` is true
 * only when the caller cleared a TOTP challenge in this request.
 */
export function issueSession(
  user: UserHydrated,
  res: Response,
  statusCode: number,
  mfaVerified: boolean,
): void {
  const token = signToken(
    { id: user._id, role: user.role, mfaVerified },
    config.jwtSecret,
    config.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  );
  const safeUser = user.toObject();
  delete safeUser.password;
  res
    .status(statusCode)
    .cookie("token", token, cookieOptions())
    .json({ success: true, user: safeUser, token });
}

/**
 * A short-lived token that says "password was correct, TOTP still pending".
 * Verified by verifyLoginOtp before a real session is issued. Separate claim
 * shape (twoFactorPending) so it can never be mistaken for a session token.
 */
export function createTwoFactorPendingToken(
  user: UserHydrated,
  enrollmentRequired: boolean,
): string {
  return jwt.sign(
    { id: user._id, twoFactorPending: true, enrollmentRequired },
    config.jwtSecret,
    { expiresIn: "5m" },
  );
}

export function clearSession(res: Response): void {
  res.cookie("token", "", { ...cookieOptions(), expires: new Date(0) });
}
