import { LeadInfo } from '@/types';

/**
 * Service for capturing and processing lead information from chat interactions
 */
export class LeadCaptureService {
  private apiEndpoint: string;
  
  constructor() {
    this.apiEndpoint = '';
    
    if (!this.apiEndpoint) {
      console.warn('Lead capture endpoint not configured. Lead capture functionality will be disabled.');
    }
  }
  
  /**
   * Captures lead information and sends it to the configured endpoint
   * @param leadInfo The lead information to capture
   * @returns A promise that resolves to true if the lead was captured successfully
   */
  public async captureLead(leadInfo: LeadInfo): Promise<boolean> {
    if (!this.apiEndpoint) {
      console.warn('Lead capture endpoint not configured. Lead information not captured.');
      return false;
    }
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadInfo),
      });
      
      if (!response.ok) {
        console.error('Failed to capture lead:', await response.text());
        return false;
      }
      
      console.log('Lead captured successfully:', leadInfo.email);
      return true;
    } catch (error) {
      console.error('Error capturing lead:', error);
      return false;
    }
  }
  
  /**
   * Extracts potential lead information from a chat message
   * @param message The chat message to extract lead information from
   * @returns The extracted lead information, or null if none was found
   */
  public extractLeadInfo(message: string): LeadInfo | null {
    // Simple email regex pattern
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = message.match(emailRegex);
    
    if (!emailMatch) {
      return null;
    }
    
    // Simple phone regex pattern
    const phoneRegex = /\b(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/;
    const phoneMatch = message.match(phoneRegex);
    
    // Simple name extraction (looking for common name patterns)
    const nameRegex = /\b(?:my name is|I am|I'm) ([A-Z][a-z]+(?: [A-Z][a-z]+)?)\b/i;
    const nameMatch = message.match(nameRegex);
    
    return {
      email: emailMatch[0],
      phone: phoneMatch ? phoneMatch[0] : undefined,
      name: nameMatch ? nameMatch[1] : undefined,
      message: message,
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instance
export const leadCaptureService = new LeadCaptureService();

// Note: Use environment variables for sensitive information
