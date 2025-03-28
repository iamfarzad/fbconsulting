
import { LeadInfo } from '@/services/lead/leadExtractor';

export type Persona = 'strategist' | 'technical' | 'consultant' | 'general';

export function determinePersona(leadInfo: LeadInfo, currentPage?: string): Persona {
  if (!leadInfo) return 'general';
  
  // Combine all interests into a text corpus
  const text = leadInfo.interests.join(' ').toLowerCase();
  
  // Check for technical indicators
  if (text.includes('code') || 
      text.includes('programming') || 
      text.includes('development') ||
      text.includes('api') ||
      text.includes('technical')) {
    return 'technical';
  }
  
  // Check for strategic indicators
  if (text.includes('strategy') || 
      text.includes('business case') || 
      text.includes('roi') ||
      text.includes('return on investment') ||
      text.includes('business value')) {
    return 'strategist';
  }
  
  // Check for consultant indicators
  if (text.includes('advice') || 
      text.includes('recommend') || 
      text.includes('suggestion') ||
      text.includes('should i')) {
    return 'consultant';
  }
  
  // Page-based defaults
  if (currentPage) {
    const page = currentPage.toLowerCase();
    if (page.includes('technical') || page.includes('docs')) return 'technical';
    if (page.includes('about') || page.includes('services')) return 'consultant';
    if (page.includes('case') || page.includes('study')) return 'strategist';
  }
  
  return 'general';
}

export function generateResponse(message: string, leadInfo: LeadInfo): string {
  // Determine which persona to use
  const persona = determinePersona(leadInfo);
  
  // Simple response generation based on persona and lead stage
  let response = "";
  
  // If we have a name, use it
  const greeting = leadInfo.name ? `Hi ${leadInfo.name}! ` : "";
  
  // Generate a response based on persona
  switch (persona) {
    case 'strategist':
      response = `${greeting}From a strategic perspective, `;
      break;
    case 'technical':
      response = `${greeting}Looking at the technical aspects, `;
      break;
    case 'consultant':
      response = `${greeting}As a consultant, I'd advise that `;
      break;
    default:
      response = `${greeting}`;
  }
  
  // Add content based on lead stage
  switch (leadInfo.stage) {
    case 'discovery':
      response += "I'd like to understand more about your business needs. What specific challenges are you looking to address with AI automation?";
      break;
    case 'qualification':
      response += "Based on what you've shared, our AI solutions could help optimize your workflows. Would you like to know more about our specific services?";
      break;
    case 'interested':
      response += "I'm glad you're interested! Our AI automation services are tailored to your needs and typically start at $2,000 for a basic implementation. Would you like to schedule a consultation to discuss your specific requirements?";
      break;
    case 'ready-to-book':
      response += "Great! Let's schedule a consultation. Would you prefer a video call or phone call? Also, what times work best for you?";
      break;
    default:
      response += "How can I help you with AI automation today?";
  }
  
  return response;
}

export default {
  determinePersona,
  generateResponse
};
