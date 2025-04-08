
import { toast as sonnerToast } from "sonner";

// Define toast options type
type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  action?: React.ReactNode;
};

export const useToast = () => {
  const toast = (options: ToastProps) => {
    sonnerToast(options.title || "", {
      description: options.description,
      duration: options.duration,
      icon: options.variant === "success" ? "✓" : 
            options.variant === "destructive" ? "✕" : undefined,
      action: options.action
    });
  };
  
  toast.success = (description: string, title?: string) => {
    sonnerToast(title || "Success", {
      description,
      icon: "✓"
    });
  };
  
  toast.error = (description: string, title?: string) => {
    sonnerToast(title || "Error", {
      description,
      icon: "✕"
    });
  };
  
  toast.info = (description: string, title?: string) => {
    sonnerToast(title || "Info", {
      description
    });
  };
  
  return { toast };
};

export default useToast;
