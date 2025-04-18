import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges class names with Tailwind CSS using clsx and tailwind-merge
 * This is useful when conditionally applying classes and avoiding class conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 