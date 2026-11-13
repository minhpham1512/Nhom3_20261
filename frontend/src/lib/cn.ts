import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Ghép className có điều kiện; class Tailwind trùng nhau thì class sau thắng. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
