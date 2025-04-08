
import { ReactNode } from 'react';

export interface ToastOptions {
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
  action?: ReactNode;
}
