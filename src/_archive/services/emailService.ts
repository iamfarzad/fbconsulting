
import { useToast } from '@/hooks/use-toast';

/**
 * Sends an email with the chat summary
 */
export const sendEmailSummary = async (
  email: string,
  subject: string,
  content: string
): Promise<boolean> => {
  // This is a mock implementation
  console.log('Sending email to:', email);
  console.log('Subject:', subject);
  console.log('Content:', content);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};

/**
 * Validates an email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
