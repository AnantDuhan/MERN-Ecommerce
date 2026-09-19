import { customAlphabet } from "nanoid";

/** Ported from utils/generateId.js — 8-char lowercase-alphanumeric ids. */
const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);
export const generateId = (): string => nano();
