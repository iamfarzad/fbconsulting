
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/toast";

// Re-export the hook
export const useToast = useShadcnToast;

// Also export the toast function for direct usage
export const toast = sonnerToast;
