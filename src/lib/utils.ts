import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with conflict resolution.
 * Combines clsx (conditional class logic) and tailwind-merge (deduplication).
 *
 * @example
 * cn("px-2 py-1", "px-4") // → "py-1 px-4"
 * cn("bg-red-500", condition && "bg-blue-500") // → conditional merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
