
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Format a date using Intl.DateTimeFormat
 */
export function formatDate(date: Date | number | string): string {
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Sleep for a specified duration
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
