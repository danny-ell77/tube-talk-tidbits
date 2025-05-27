import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates or retrieves a UUID for anonymous user tracking
 * @returns string UUID v4
 */
export function getAnonymousId(): string | null {
  // Check if UUID already exists in localStorage
  const storedId = localStorage.getItem("anonymousId");
  if (storedId) return storedId;
}

/**
 * Check if the current user is an anonymous user
 * @returns boolean
 */
export function isAnonymousUser(): boolean {
  return localStorage.getItem("anonymousId") !== null;
}
