import type { Request, RequestHandler, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { OAuth2Client } from "google-auth-library";
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
 * All handlers ported from controllers/user.js. Two cross-cutting boundary
 * changes carried through everywhere:
 *  - Outbound email is owned by notification-service, so the flows that used to
 *    send inline (verify, resend, forgot) emit an event instead.
 *  - S3 avatar upload is a media concern; where the monolith uploaded a file,
 *    we accept an avatar URL and leave the upload as a documented TODO.
 */
export function makeAuthController(bus: EventBus) {
  const googleClient = new OAuth2Client(config.googleClientId);

  const register: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { name, whatsappNumber, email, password } = req.body ?? {};
    if (!name || !email || !password) throw new AppError("name, email and password are required", 400);

    // TODO(media-service): upload req.file to S3 and use the returned URL.
    const avatar = req.body.avatar ?? `${config.frontendUrl}/default-avatar.png`;
    const user = await User.create({
      _id: generateId(), name, whatsappNumber, email, password, avatar, isEmailVerified: false,
    });
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    await bus.publish(DomainEvent.UserRegistered, {
      userId: user._id, email: user.email, name: user.name, verificationToken,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email before logging in.",
      email: user.email,
      // Dev convenience: lets you complete verification without a mail provider.
      ...(config.isProd ? {} : { verificationToken }),
    });
  });

  const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) throw new AppError("Please Enter Email and Password", 400);

    const user = await User.findOne({ email }).select("+password +twoFactorAuth.enabled");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid Email or Password", 401);
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false, emailVerificationRequired: true,
        message: "Please verify your email address before logging in.",
      });
    }

    const enrollmentRequired = user.role === "admin" && !user.twoFactorAuth.enabled;
    if (user.twoFactorAuth.enabled || enrollmentRequired) {
      const twoFactorToken = createTwoFactorPendingToken(user, enrollmentRequired);
      return res.status(200).json({ success: true, twoFactorRequired: true, enrollmentRequired, twoFactorToken });
    }
    return issueSession(user, res, 201, false);
  });

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

    const ok = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret, encoding: "base32", token: String(code), window: 1,
    });
    if (!ok) throw new AppError("Invalid authentication code", 400);
    return issueSession(user, res, 200, true);
  });

  const logout: RequestHandler = (_req, res) => {
    clearSession(res);
    res.status(200).json({ success: true, message: "User logged out" });
  };

  const getMe: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, user });
  });

  // ---- Email verification ------------------------------------------------
  const verifyEmail: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const hashed = crypto.createHash("sha256").update(String(req.params.token)).digest("hex");
    const user = await User.findOne({ emailVerificationToken: hashed })
      .select("+emailVerificationToken +emailVerificationExpire");
    if (!user) throw new AppError("Email verification link is invalid or has expired.", 400);

    if (!user.emailVerificationExpire || user.emailVerificationExpire <= new Date()) {
      const verificationToken = user.getEmailVerificationToken();
      await user.save({ validateBeforeSave: false });
      await bus.publish(DomainEvent.EmailVerificationRequested, {
        email: user.email, name: user.name, verificationToken,
      });
      return res.status(410).json({
        success: false, verificationEmailResent: true,
        message: "This verification link expired. We sent a new link to your email address.",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });
    await bus.publish(DomainEvent.EmailVerified, { userId: user._id, email: user.email, name: user.name });
    res.status(200).json({ success: true, message: "Email verified successfully. You can now login." });
  });

  const resendVerificationEmail: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body ?? {};
    if (!email) throw new AppError("Email address is required.", 400);
    const user = await User.findOne({ email }).select("+emailVerificationToken +emailVerificationExpire");
    if (!user) throw new AppError("No account found with this email address.", 404);
    if (user.isEmailVerified) throw new AppError("Email address is already verified.", 400);

    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    await bus.publish(DomainEvent.EmailVerificationRequested, {
      email: user.email, name: user.name, verificationToken,
    });
    res.status(200).json({ success: true, message: "A new verification email has been sent." });
  });

  // ---- Password reset ----------------------------------------------------
  const forgotPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const email = String(req.body.email ?? "").trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found", 404);

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    await bus.publish(DomainEvent.PasswordResetRequested, {
      email: user.email, name: user.name, resetToken,
    });
    res.status(200).json({ success: true, message: `Email sent to ${user.email} successfully.` });
  });

  const resetPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const hashed = crypto.createHash("sha256").update(String(req.params.token)).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed, resetPasswordExpire: { $gt: new Date() },
    });
    if (!user) throw new AppError("Reset Password Token is invalid or has expired!", 400);
    if (req.body.password !== req.body.confirmPassword) throw new AppError("Passwords do not match!", 400);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return issueSession(user, res, 200, false);
  });

  // ---- Profile / password / push token -----------------------------------
  const updateProfile: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id);
    if (!user) throw new AppError("User not found", 404);
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    // TODO(media-service): if a file is uploaded, push to S3 and set user.avatar.
    if (req.body.avatar) user.avatar = req.body.avatar;
    await user.save();
    res.status(200).json({ success: true, user });
  });

  const updatePassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id).select("+password");
    if (!user) throw new AppError("User not found", 404);
    if (!(await user.comparePassword(req.body.oldPassword))) throw new AppError("Old Password is incorrect", 400);
    if (req.body.newPassword !== req.body.confirmPassword) throw new AppError("Password does not match", 400);
    user.password = req.body.newPassword;
    await user.save();
    return issueSession(user, res, 200, false);
  });

  const registerPushToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    await User.findByIdAndUpdate(ctx.id, { pushToken: req.body.pushToken ?? null });
    res.status(200).json({ success: true });
  });

  // ---- Google login ------------------------------------------------------
  const googleLogin: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body ?? {};
    if (!idToken) throw new AppError("Google ID token is required", 400);

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({ idToken, audience: config.googleClientId });
      payload = ticket.getPayload();
    } catch {
      throw new AppError("Invalid or expired Google Token", 401);
    }
    if (!payload?.email) throw new AppError("Invalid or expired Google Token", 401);

    let user = await User.findOne({ email: payload.email }).select("+twoFactorAuth.enabled");
    if (!user) {
      user = await User.create({
        _id: generateId(), name: payload.name ?? payload.email, email: payload.email,
        avatar: payload.picture ?? `${config.frontendUrl}/default-avatar.png`,
        authProvider: "google", isEmailVerified: true,
      });
    }

    const enrollmentRequired = user.role === "admin" && !user.twoFactorAuth.enabled;
    if (user.twoFactorAuth.enabled || enrollmentRequired) {
      return res.status(200).json({
        success: true, twoFactorRequired: true, enrollmentRequired,
        twoFactorToken: createTwoFactorPendingToken(user, enrollmentRequired),
      });
    }
    return issueSession(user, res, 200, false);
  });

  // ---- Address book ------------------------------------------------------
  const getAddresses: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id);
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, addresses: user.addresses ?? [] });
  });

  const addAddress: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const { label, address, city, state, country, pinCode, phoneNumber } = req.body ?? {};
    if (!address || !city || !state || !country || !pinCode || !phoneNumber) {
      throw new AppError("address, city, state, country, pinCode and phoneNumber are required", 400);
    }
    const user = await User.findById(ctx.id);
    if (!user) throw new AppError("User not found", 404);

    const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();
    const duplicate = (user.addresses ?? []).some(
      (s) => norm(s.address) === norm(address) && norm(s.city) === norm(city) &&
        norm(s.state) === norm(state) && norm(s.country) === norm(country) &&
        norm(s.pinCode) === norm(pinCode) && norm(s.phoneNumber) === norm(phoneNumber),
    );
    if (duplicate) throw new AppError("This address is already saved", 409);

    user.addresses.push({ _id: generateId(), label: label ?? "", address, city, state, country, pinCode, phoneNumber });
    await user.save({ validateBeforeSave: false });
    res.status(201).json({ success: true, addresses: user.addresses });
  });

  const deleteAddress: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id);
    if (!user) throw new AppError("User not found", 404);
    const before = user.addresses.length;
    user.addresses = user.addresses.filter((a) => String(a._id) !== String(req.params.addressId));
    if (user.addresses.length === before) throw new AppError("Address not found", 404);
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, addresses: user.addresses });
  });

  // ---- Two-factor auth ---------------------------------------------------
  const setupTwoFactorAuth: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id);
    if (!user) throw new AppError("User not found", 404);
    const secret = speakeasy.generateSecret({ name: `Maison (${user.email})` });
    user.twoFactorAuth.tempSecret = secret.base32;
    await user.save({ validateBeforeSave: false });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url ?? "");
    res.status(200).json({ success: true, qrCode, secret: secret.base32 });
  });

  const verifyTwoFactorAuth: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id).select("+twoFactorAuth.tempSecret");
    if (!user?.twoFactorAuth?.tempSecret) throw new AppError("Start 2FA setup first", 400);
    const ok = speakeasy.totp.verify({
      secret: user.twoFactorAuth.tempSecret, encoding: "base32", token: String(req.body.code ?? ""), window: 1,
    });
    if (!ok) throw new AppError("Invalid authentication code", 400);
    user.twoFactorAuth.secret = user.twoFactorAuth.tempSecret;
    user.twoFactorAuth.tempSecret = undefined;
    user.twoFactorAuth.enabled = true;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: "Two-factor authentication enabled" });
  });

  const disableTwoFactorAuth: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const ctx = userFromHeaders(req);
    if (!ctx) throw new AppError("Authentication required", 401);
    const user = await User.findById(ctx.id).select("+twoFactorAuth.secret +twoFactorAuth.enabled");
    if (!user) throw new AppError("User not found", 404);
    if (user.role === "admin") throw new AppError("Administrators must keep two-factor authentication enabled", 403);
    if (!user.twoFactorAuth?.enabled) throw new AppError("2FA is not enabled", 400);
    const ok = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret ?? "", encoding: "base32", token: String(req.body.code ?? ""), window: 1,
    });
    if (!ok) throw new AppError("Invalid authentication code", 400);
    user.twoFactorAuth.secret = undefined;
    user.twoFactorAuth.tempSecret = undefined;
    user.twoFactorAuth.enabled = false;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: "Two-factor authentication disabled" });
  });

  const setupAdminTwoFactorEnrollment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    let decoded: { id: string; twoFactorPending?: boolean; enrollmentRequired?: boolean };
    try {
      decoded = jwt.verify(req.body.twoFactorToken, config.jwtSecret) as typeof decoded;
    } catch {
      throw new AppError("Admin enrollment session expired. Please sign in again.", 401);
    }
    if (!decoded.twoFactorPending || !decoded.enrollmentRequired) throw new AppError("Invalid admin enrollment session", 400);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin" || user.twoFactorAuth.enabled) throw new AppError("Admin 2FA enrollment is not required", 400);
    const secret = speakeasy.generateSecret({ name: `Maison Admin (${user.email})` });
    user.twoFactorAuth.tempSecret = secret.base32;
    await user.save({ validateBeforeSave: false });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url ?? "");
    res.status(200).json({ success: true, qrCode, secret: secret.base32 });
  });

  const verifyAdminTwoFactorEnrollment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    let decoded: { id: string; twoFactorPending?: boolean; enrollmentRequired?: boolean };
    try {
      decoded = jwt.verify(req.body.twoFactorToken, config.jwtSecret) as typeof decoded;
    } catch {
      throw new AppError("Admin enrollment session expired. Please sign in again.", 401);
    }
    if (!decoded.twoFactorPending || !decoded.enrollmentRequired) throw new AppError("Invalid admin enrollment session", 400);
    const user = await User.findById(decoded.id).select("+twoFactorAuth.tempSecret");
    if (!user || user.role !== "admin" || !user.twoFactorAuth.tempSecret) throw new AppError("Start admin 2FA enrollment first", 400);
    const ok = speakeasy.totp.verify({
      secret: user.twoFactorAuth.tempSecret, encoding: "base32", token: String(req.body.code ?? ""), window: 1,
    });
    if (!ok) throw new AppError("Invalid authentication code", 400);
    user.twoFactorAuth.secret = user.twoFactorAuth.tempSecret;
    user.twoFactorAuth.tempSecret = undefined;
    user.twoFactorAuth.enabled = true;
    await user.save({ validateBeforeSave: false });
    return issueSession(user, res, 200, true);
  });

  // ---- Admin user management --------------------------------------------
  const getAllUsers: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  });

  const getSingleUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError(`User does not exist with Id: ${req.params.id}`, 400);
    res.status(200).json({ success: true, user });
  });

  const updateUserRole: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email, role: req.body.role },
      { new: true, runValidators: true },
    );
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json({ success: true, user });
  });

  return {
    register, login, verifyLoginOtp, logout, getMe,
    verifyEmail, resendVerificationEmail, forgotPassword, resetPassword,
    updateProfile, updatePassword, registerPushToken, googleLogin,
    getAddresses, addAddress, deleteAddress,
    setupTwoFactorAuth, verifyTwoFactorAuth, disableTwoFactorAuth,
    setupAdminTwoFactorEnrollment, verifyAdminTwoFactorEnrollment,
    getAllUsers, getSingleUser, updateUserRole,
  };
}
