
import { useToast as useShadcnToast, type ToastActionElement } from "@/components/ui/toast";
import { ToastOptions } from "@/types/toast";

export const useToast = () => {
  // Get the base toast function from shadcn/ui
  const { toast: shadcnToast } = useShadcnToast();
  
  // Create our enhanced toast function with variants
  const toast = (options: ToastOptions) => {
    shadcnToast({
      ...options,
      // Ensure description exists
      description: options.description || "",
    });
  };
  
  // Add convenience methods
  toast.success = (description: string) => {
    toast({
      description,
      variant: "success",
    });
  };
  
  toast.error = (description: string) => {
    toast({
      description,
      variant: "destructive",
    });
  };
  
  toast.info = (description: string) => {
    toast({
      description,
      variant: "default",
    });
  };
  
  return { toast };
};

export default useToast;
