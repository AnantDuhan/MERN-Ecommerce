import { Schema, model, type Model, type HydratedDocument } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Ported from the monolith's models/user.js. Structure is preserved — string
 * `_id`, `select: false` on secrets, embedded wishlist/addresses, the 2FA
 * subdocument and email-verification fields. What changed: JWT minting no longer
 * lives on the model; the session helper signs tokens through
 * @order-planning/shared so the token shape is identical across every service.
 * comparePassword and the token-generator methods stay here because they act on
 * this document's own fields.
 */
export interface Address {
  _id: string;
  label?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
  phoneNumber: number;
}

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  password?: string;
  whatsappNumber?: number;
  authProvider: "local" | "google";
  avatar: string;
  wishlist: unknown[];
  twoFactorAuth: { secret?: string; tempSecret?: string; enabled: boolean };
  role: string;
  addresses: Address[];
  createdAt: Date;
  pushToken: string | null;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;
  isEmailVerified: boolean;
}

export interface UserMethods {
  comparePassword(entered: string): Promise<boolean>;
  getResetPasswordToken(): string;
  getEmailVerificationToken(): string;
}

type UserModel = Model<UserDoc, Record<string, never>, UserMethods>;
export type UserHydrated = HydratedDocument<UserDoc, UserMethods>;

const addressSchema = new Schema<Address>(
  {
    _id: String,
    label: { type: String, trim: true, default: "" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<UserDoc, UserModel, UserMethods>({
  _id: String,
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name must be atleast of 2 characters long"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: { type: String, minLength: [6, "Password must be atleast of 6 characters long"], select: false },
  whatsappNumber: { type: Number, unique: true, sparse: true },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  avatar: { type: String, required: true },
  wishlist: { type: [Schema.Types.Mixed], default: [] },
  twoFactorAuth: {
    secret: { type: String, select: false },
    tempSecret: { type: String, select: false },
    enabled: { type: Boolean, default: false },
  },
  role: { type: String, default: "user" },
  addresses: { type: [addressSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  pushToken: { type: String, default: null },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpire: { type: Date, select: false },
  isEmailVerified: { type: Boolean, default: false },
});

userSchema.pre("save", async function (this: UserHydrated) {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (this: UserHydrated, entered: string) {
  if (!this.password) return false;
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.getResetPasswordToken = function (this: UserHydrated) {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
  return resetToken;
};

userSchema.methods.getEmailVerificationToken = function (this: UserHydrated) {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  this.emailVerificationExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return verificationToken;
};

export const User = model<UserDoc, UserModel>("User", userSchema);
