import { ChatMessage, LeadInfo } from '@/types';

/**
 * Service for sending email summaries of chat conversations
 */
export class EmailService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = import.meta.env.VITE_EMAIL_SERVICE_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Email service API key not configured. Email functionality will be disabled.');
    }
  }
  
  /**
   * Sends an email summary of a chat conversation
   * @param leadInfo The lead information to include in the email
   * @param messages The chat messages to summarize
   * @returns A promise that resolves to true if the email was sent successfully
   */
  public async sendConversationSummary(leadInfo: LeadInfo, messages: ChatMessage[]): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('Email service API key not configured. Email not sent.');
      return false;
    }
    
    try {
      // Format the conversation as HTML
      const conversationHtml = this.formatConversationAsHtml(messages);
      
      // Create email payload
      const emailPayload = {
        to: leadInfo.email,
        subject: 'Your Conversation with FB Consulting AI Assistant',
        html: `
          <h1>Thank you for chatting with FB Consulting AI Assistant</h1>
          <p>Hello ${leadInfo.name || 'there'},</p>
          <p>Thank you for your interest in FB Consulting. Here's a summary of our conversation:</p>
          ${conversationHtml}
          <p>If you have any further questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>FB Consulting Team</p>
        `,
        // Add BCC to the company email for tracking
        bcc: 'contact@fbconsulting.com',
      };
      
      // In a real implementation, you would use an email service API here
      // For now, we'll just log the payload and return success
      console.log('Would send email:', emailPayload);
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  
  /**
   * Formats a conversation as HTML for email
   * @param messages The chat messages to format
   * @returns The formatted HTML
   */
  private formatConversationAsHtml(messages: ChatMessage[]): string {
    // Filter out system messages
    const visibleMessages = messages.filter(msg => msg.role !== 'system');
    
    if (visibleMessages.length === 0) {
      return '<p>No conversation history available.</p>';
    }
    
    // Format each message as HTML
    const messageHtml = visibleMessages.map(msg => {
      const role = msg.role === 'user' ? 'You' : 'AI Assistant';
      const backgroundColor = msg.role === 'user' ? '#f0f0f0' : '#e6f7ff';
      
      return `
        <div style="margin-bottom: 10px; padding: 10px; background-color: ${backgroundColor}; border-radius: 5px;">
          <strong>${role}:</strong>
          <p>${msg.content.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }).join('');
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Conversation Summary</h2>
        ${messageHtml}
      </div>
    `;
  }
}

// Singleton instance
export const emailService = new EmailService();
