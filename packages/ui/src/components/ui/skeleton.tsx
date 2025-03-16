"use client";

import { cn } from "../../lib/utils";

/**
 * Skeleton component for displaying loading states
 * Use this component to show a placeholder while content is loading
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      {...props}
    />
  );
}

export { Skeleton };
