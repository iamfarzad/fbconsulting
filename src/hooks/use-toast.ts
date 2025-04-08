
import { toast as sonnerToast } from "sonner";
import { ToastOptions } from "@/types/toast";

export const useToast = () => {
  // Create our enhanced toast function with variants
  const toast = (options: ToastOptions) => {
    sonnerToast({
      ...options,
      // Ensure description exists
      description: options.description || "",
    });
  };
  
  // Add convenience methods
  toast.success = (description: string) => {
    sonnerToast({
      description,
      variant: "success",
    });
  };
  
  toast.error = (description: string) => {
    sonnerToast({
      description,
      variant: "destructive",
    });
  };
  
  toast.info = (description: string) => {
    sonnerToast({
      description,
      variant: "default",
    });
  };
  
  return { toast };
};

export default useToast;
