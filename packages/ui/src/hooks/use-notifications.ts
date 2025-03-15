import { useToast } from "../components/ui/toast";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
}

/**
 * Hook for managing notifications throughout the application
 * Provides methods for showing different types of notifications
 */
export function useNotifications() {
  const { addToast } = useToast();

  const showNotification = (
    type: NotificationType,
    { title, description, duration = 5000 }: NotificationOptions
  ) => {
    const variant = type === "info" ? "default" : type === "error" ? "destructive" : type;
    
    addToast({
      variant,
      title,
      description,
      duration,
    });
  };

  const success = (options: NotificationOptions) => {
    showNotification("success", options);
  };

  const error = (options: NotificationOptions) => {
    showNotification("error", options);
  };

  const warning = (options: NotificationOptions) => {
    showNotification("warning", options);
  };

  const info = (options: NotificationOptions) => {
    showNotification("info", options);
  };

  return {
    success,
    error,
    warning,
    info,
  };
}
