import React from 'react';
import { cn } from "../../lib/utils";

// Alert styles defined directly without cva
const alertStyles = {
  base: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  variants: {
    default: "bg-background text-foreground",
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    success: "border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-500",
  }
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof alertStyles.variants;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        alertStyles.base,
        alertStyles.variants[variant],
        className
      )}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
