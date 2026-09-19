import { customAlphabet } from "nanoid";
const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);
export const generateId = (): string => nano();
