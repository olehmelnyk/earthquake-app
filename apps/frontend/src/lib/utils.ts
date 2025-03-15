/**
 * A simple utility to combine class names
 * This is a basic version that doesn't require external dependencies
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
