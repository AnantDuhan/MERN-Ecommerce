import type { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import {
  EventBus,
  DomainEvent,
  asyncHandler,
  AppError,
  userFromHeaders,
} from "@order-planning/shared";
import { config } from "../config";
import { User } from "../models/user";
import { generateId } from "../utils/generateId";
import { issueSession, createTwoFactorPendingToken, clearSession } from "../auth/session";

/**
 * The event bus is injected at bootstrap so publishing an event is testable and
 * the controller doesn't own its own Redis connection.
 */
export function makeAuthController(bus: EventBus) {
  /**
   * Ported from registerUser. Two deliberate boundary changes from the monolith:
   *  - Avatar upload to S3 belonged to the request path in the monolith; in the
   *    split it becomes a media concern. Left as a typed TODO rather than
   *    reproduced here, so nothing about S3 is faked.
   *  - The monolith sent the verification email inline. Email is now owned by
   *    notification-service, so instead we emit UserRegistered carrying the
   *    verification token; notification-service renders and sends verify-email.
   *    (Add a UserRegistered consumer there — the welcome email should move to
   *    fire on email-verified, not on register.)
   */
  const register: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { name, whatsappNumber, email, password } = req.body ?? {};
    if (!name || !email || !password) {
      throw new AppError("name, email and password are required", 400);
    }

    // TODO(media-service): upload req.file to S3 and use the returned URL.
    const avatar = req.body.avatar ?? `${config.frontendUrl}/default-avatar.png`;

    const user = await User.create({
      _id: generateId(),
      name,
      whatsappNumber,
      email,
      password,
      avatar,
      isEmailVerified: false,
    });

    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    await bus.publish(DomainEvent.UserRegistered, {
      userId: user._id,
      email: user.email,
      name: user.name,
      // consumed by notification-service to build the verify-email URL
      verificationToken,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email and verify your account before logging in.",
      email: user.email,
    });
  });

  /** Ported from loginUser: password → email-verified → 2FA branch → session. */
  const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) throw new AppError("Please Enter Email and Password", 400);

    const user = await User.findOne({ email }).select("+password +twoFactorAuth.enabled");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid Email or Password", 401);
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        emailVerificationRequired: true,
        message: "Please verify your email address before logging in.",
      });
    }

    const enrollmentRequired = user.role === "admin" && !user.twoFactorAuth.enabled;
    if (user.twoFactorAuth.enabled || enrollmentRequired) {
      const twoFactorToken = createTwoFactorPendingToken(user, enrollmentRequired);
      return res
        .status(200)
        .json({ success: true, twoFactorRequired: true, enrollmentRequired, twoFactorToken });
    }

    return issueSession(user, res, 201, false);
  });

  /** Ported from verifyLoginOtp: validate the pending token + TOTP, then issue. */
  const verifyLoginOtp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { twoFactorToken, code } = req.body ?? {};
    if (!twoFactorToken || !code) throw new AppError("Authentication code is required", 400);

    let decoded: { id: string; twoFactorPending?: boolean };
    try {
      decoded = jwt.verify(twoFactorToken, config.jwtSecret) as typeof decoded;
    } catch {
      throw new AppError("Login session expired. Please sign in again.", 401);
    }
    if (!decoded.twoFactorPending) throw new AppError("Invalid login session", 400);

    const user = await User.findById(decoded.id).select("+twoFactorAuth.secret");
    if (!user?.twoFactorAuth?.secret) throw new AppError("Invalid login session", 400);

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret,
      encoding: "base32",
      token: String(code),
      window: 1,
    });
    if (!verified) throw new AppError("Invalid authentication code", 400);

    return issueSession(user, res, 200, true);
  });

  /** Ported from logout — clears the cookie. */
  const logout: RequestHandler = (_req, res) => {
    clearSession(res);
    res.status(200).json({ success: true, message: "User logged out" });
  };

  /**
   * Ported from getUserDetails. Identity comes from the gateway-injected header,
   * not a token re-parse — the service trusts x-user-id.
   */
  const getMe: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, user });
  });

  /**
   * Remaining handlers from controllers/user.js, each a faithful port to fill in
   * next — kept as explicit 501s referencing their source rather than sketched,
   * so the surface is honest about what's wired and what isn't yet.
   */
  const notPorted =
    (source: string): RequestHandler =>
    (_req, res) =>
      res.status(501).json({ message: `Not yet ported from ${source}` });

  return {
    register,
    login,
    verifyLoginOtp,
    logout,
    getMe,
    verifyEmail: notPorted("controllers/user.js:verifyEmail"),
    resendVerificationEmail: notPorted("controllers/user.js:resendVerificationEmail"),
    forgotPassword: notPorted("controllers/user.js:forgotPassword"),
    resetPassword: notPorted("controllers/user.js:resetPassword"),
    updateProfile: notPorted("controllers/user.js:updateProfile"),
    updatePassword: notPorted("controllers/user.js:updatePassword"),
    registerPushToken: notPorted("controllers/user.js:registerPushToken"),
    googleLogin: notPorted("controllers/user.js:googleLogin"),
    getAddresses: notPorted("controllers/user.js:getAddresses"),
    addAddress: notPorted("controllers/user.js:addAddress"),
    deleteAddress: notPorted("controllers/user.js:deleteAddress"),
    setupTwoFactorAuth: notPorted("controllers/user.js:setupTwoFactorAuth"),
    verifyTwoFactorAuth: notPorted("controllers/user.js:verifyTwoFactorAuth"),
    disableTwoFactorAuth: notPorted("controllers/user.js:disableTwoFactorAuth"),
    setupAdminTwoFactorEnrollment: notPorted("controllers/user.js:setupAdminTwoFactorEnrollment"),
    verifyAdminTwoFactorEnrollment: notPorted("controllers/user.js:verifyAdminTwoFactorEnrollment"),
    getAllUsers: notPorted("controllers/user.js:getAllUsers"),
    getSingleUser: notPorted("controllers/user.js:getSingleUser"),
    updateUserRole: notPorted("controllers/user.js:updateUserRole"),
  };
}
