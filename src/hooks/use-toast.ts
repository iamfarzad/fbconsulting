
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  action?: React.ReactNode;
};

export const useToast = () => {
  const toast = ({ title, description, variant, action }: ToastProps) => {
    const options: any = {
      description,
      action
    };

    if (variant === "destructive") {
      return sonnerToast.error(title, options);
    }

    if (variant === "success") {
      return sonnerToast.success(title, options);
    }

    return sonnerToast(title, options);
  };

  return { toast };
};

export { useToast as useToastHook };
