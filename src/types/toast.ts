
import { ReactNode } from 'react';

export interface ToastOptions {
  title?: ReactNode;
  description: ReactNode;
  duration?: number;
  variant?: 'default' | 'destructive' | 'success';
  action?: ReactNode;
}
