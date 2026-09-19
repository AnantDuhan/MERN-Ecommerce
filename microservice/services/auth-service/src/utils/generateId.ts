import { customAlphabet } from "nanoid";

/**
 * Ported from the monolith's utils/generateId.js — 8-char lowercase-alphanumeric
 * ids. Every model declares `_id: String`, so these slot in unchanged.
 */
export const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
export const LENGTH = 8;
const nano = customAlphabet(ALPHABET, LENGTH);
export const generateId = (): string => nano();
