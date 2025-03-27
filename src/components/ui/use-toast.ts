import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast({ title, description, variant = "default" }: ToastProps) {
  const options = {
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : "",
  };

  if (title && description) {
    sonnerToast[variant === "destructive" ? "error" : "success"](title, {
      description,
      ...options,
    });
  } else if (title) {
    sonnerToast[variant === "destructive" ? "error" : "success"](title, options);
  }
}
