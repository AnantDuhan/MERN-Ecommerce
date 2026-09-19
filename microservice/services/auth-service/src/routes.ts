import { Router } from "express";
import { requireUser, requireRole, type EventBus } from "@order-planning/shared";
import { makeAuthController } from "./controllers/authController";

/**
 * Mirrors the monolith's routes/user.js, minus the endpoints that belong to
 * other services now: /contact-us and /subscribe move to notification-service.
 * Guards come from @order-planning/shared and read the gateway-injected headers
 * — requireRole("admin") also enforces the TOTP rule the monolith kept in
 * authRoles. Mounted at /api/v1/auth (see index.ts), so /login is
 * /api/v1/auth/login: one namespaced base per service. The frontend's auth base
 * URL gets an /auth segment — a single-line change, flagged in the README.
 */
export function buildRouter(bus: EventBus): Router {
  const c = makeAuthController(bus);
  const r = Router();

  r.post("/register", c.register);
  r.post("/login", c.login);
  r.post("/login/2fa", c.verifyLoginOtp);
  r.post("/google", c.googleLogin);
  r.get("/logout", c.logout);

  r.get("/verify-email/:token", c.verifyEmail);
  r.post("/resend-verification", c.resendVerificationEmail);
  r.post("/password/forgot", c.forgotPassword);
  r.put("/password/reset/:token", c.resetPassword);

  r.get("/me", requireUser, c.getMe);
  r.put("/me/update", requireUser, c.updateProfile);
  r.put("/me/push-token", requireUser, c.registerPushToken);
  r.put("/password/update", requireUser, c.updatePassword);

  r.get("/addresses", requireUser, c.getAddresses);
  r.post("/address/new", requireUser, c.addAddress);
  r.delete("/address/:addressId", requireUser, c.deleteAddress);

  r.get("/2fa/setup", requireUser, c.setupTwoFactorAuth);
  r.post("/2fa/verify", requireUser, c.verifyTwoFactorAuth);
  r.post("/2fa/disable", requireUser, c.disableTwoFactorAuth);
  r.post("/login/2fa/setup", c.setupAdminTwoFactorEnrollment);
  r.post("/login/2fa/enroll", c.verifyAdminTwoFactorEnrollment);

  r.get("/admin/users", requireRole("admin"), c.getAllUsers);
  r.get("/admin/user/:id", requireRole("admin"), c.getSingleUser);
  r.put("/admin/user/:id", requireRole("admin"), c.updateUserRole);

  return r;
}
