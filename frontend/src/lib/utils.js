// src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ✅ cn() merges Tailwind classes dynamically
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
