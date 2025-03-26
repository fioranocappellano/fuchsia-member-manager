
import { toast as baseToast, ToastProps } from "@/hooks/use-toast";

/**
 * Wrapper for the toast function that automatically adds an ID if not provided
 */
export const toast = (props: Omit<ToastProps, "id"> & { id?: string }) => {
  const toastWithId = {
    id: crypto.randomUUID(),
    ...props,
  };
  baseToast(toastWithId);
};

/**
 * Helper for creating destructive toasts with automatic ID
 */
export const errorToast = (title: string, description: string | any) => {
  toast({
    id: crypto.randomUUID(),
    title,
    description: typeof description === 'object' ? (description.message || JSON.stringify(description)) : description,
    variant: "destructive",
  });
};

/**
 * Helper for creating success toasts with automatic ID
 */
export const successToast = (title: string, description: string) => {
  toast({
    id: crypto.randomUUID(),
    title,
    description,
  });
};
