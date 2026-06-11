import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Generate a short, URL-friendly guest token (8 chars: lowercase + digits)
 * e.g. "xk9mp2qr" — short enough for clean links, long enough to avoid collisions
 */
export function generateGuestToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(8);
  let token = '';
  for (let i = 0; i < 8; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}
