"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "destructive" | "warning";
  title?: string;
  description?: string;
  onClose?: () => void;
}

/**
 * Toast component for displaying notifications
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", title, description, onClose, ...props }, ref) => {
    const variantStyles = {
      default: "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900",
      success: "bg-green-600 text-white dark:bg-green-800 dark:text-white",
      destructive: "bg-red-600 text-white dark:bg-red-800 dark:text-white",
      warning: "bg-yellow-500 text-white dark:bg-yellow-700 dark:text-white",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-lg shadow-lg",
          "pointer-events-auto flex items-start gap-4 p-4",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="flex-1 space-y-1">
          {title && <div className="font-medium">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex shrink-0 rounded-md p-1 text-white/50 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-900/50 dark:focus:ring-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export interface ToastProviderProps {
  children: React.ReactNode;
}

export interface ToastContextType {
  toasts: Array<ToastProps & { id: string }>;
  addToast: (toast: Omit<ToastProps, "id">) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

/**
 * ToastProvider component for managing toasts
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([]);

  const addToast = React.useCallback(
    (toast: Omit<ToastProps, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...toast, id }]);

      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast context
 */
export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

/**
 * Container component for displaying toasts
 */
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
          className="animate-slideUpAndFade"
        />
      ))}
    </div>
  );
}
