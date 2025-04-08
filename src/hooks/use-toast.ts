
import { useToast as useShadcnToast } from "@/components/ui/use-toast";
import { ToastOptions } from "@/types/toast";

export const useToast = () => {
  const { toast: shadcnToast } = useShadcnToast();
  
  const toast = (options: ToastOptions) => {
    shadcnToast(options);
  };
  
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
