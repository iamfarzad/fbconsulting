
export interface ToastOptions {
  title?: React.ReactNode;
  description: React.ReactNode;
  duration?: number;
  variant?: 'default' | 'destructive' | 'success';
  action?: React.ReactNode;
}
