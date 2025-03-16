/**
 * A simple utility to combine class names
 * This is a basic version that doesn't require external dependencies
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format a date string to a localized date string
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}
