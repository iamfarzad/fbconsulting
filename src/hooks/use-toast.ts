import { toast as sonnerToast } from 'sonner';

type ToastVariant = 'default' | 'success' | 'error' | 'destructive' | 'warning';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const toast = ({ title, description, variant = 'default', duration = 5000 }: ToastOptions) => {
    const options = {
      description,
      duration,
      className: `toast-${variant}`,
    };

    if (variant === 'destructive' || variant === 'error') {
      sonnerToast.error(title, options);
    } else if (variant === 'success') {
      sonnerToast.success(title, options);
    } else if (variant === 'warning') {
      sonnerToast.warning(title, options);
    } else {
      sonnerToast(title, options);
    }
  };

  return { toast };
}
