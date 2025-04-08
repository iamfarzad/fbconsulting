
import { toast as sonnerToast } from "sonner";
import { ToastOptions } from "@/types/toast";

export const useToast = () => {
  // Create our enhanced toast function with variants
  const toast = (options: ToastOptions) => {
    sonnerToast({
      ...options,
    });
  };
  
  // Add convenience methods
  toast.success = (description: string) => {
    sonnerToast({
      variant: "success",
      description,
    });
  };
  
  toast.error = (description: string) => {
    sonnerToast({
      variant: "destructive",
      description,
    });
  };
  
  toast.info = (description: string) => {
    sonnerToast({
      variant: "default",
      description,
    });
  };
  
  return { toast };
};

export default useToast;
