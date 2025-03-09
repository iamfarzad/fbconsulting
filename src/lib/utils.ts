
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
 *   "fade-in-up": "fade-in-up 0.8s ease-out",
 * },
 * keyframes: {
 *   "skew-scroll": {
 *     "0%": { transform: "translateY(100%)" },
 *     "100%": { transform: "translateY(-100%)" },
 *   },
 *   "fade-in-up": {
 *     "0%": { opacity: "0", transform: "translateY(20px)" },
 *     "100%": { opacity: "1", transform: "translateY(0)" }
 *   }
 * },
 */
