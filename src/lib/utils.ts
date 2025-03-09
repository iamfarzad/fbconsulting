
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this animation to your tailwind config
/**
 * Add the following to your tailwind.config.ts under extend.animation:
 * 
 * animation: {
 *   "skew-scroll": "skew-scroll 20s linear infinite",
 * },
 * keyframes: {
 *   "skew-scroll": {
 *     "0%": { transform: "translateY(100%)" },
 *     "100%": { transform: "translateY(-100%)" },
 *   },
 * },
 */
