
import { CardType } from '@/components/ui/ai-chat/GraphicCard';

export type FormType = 'email-summary' | 'newsletter-signup' | 'booking-request' | 'contact-form';

export interface ExtractedCard {
  type: CardType;
  title: string;
  description: string;
  variant?: 'default' | 'bordered' | 'minimal';
}

export interface ExtractedForm {
  type: FormType;
  data?: Record<string, string>;
}

export interface ExtractedContent {
  textContent: string;
  cards: ExtractedCard[];
  forms: ExtractedForm[];
}

/**
 * Extracts cards, forms and cleans text content from AI message
 */
export const extractContentFromMessage = (content: string): ExtractedContent => {
  const cards: ExtractedCard[] = [];
  const forms: ExtractedForm[] = [];
  let textContent = content;
  
  // Extract card data from message content
  // Format: [[CARD:type:title:description:variant?]]
  const cardRegex = /\[\[CARD:(\w+):([^:]+):([^:]+)(?::(\w+))?\]\]/g;
  let cardMatch;
  
  while ((cardMatch = cardRegex.exec(content)) !== null) {
    const type = cardMatch[1] as CardType;
    const title = cardMatch[2];
    const description = cardMatch[3];
    const variant = cardMatch[4] as 'default' | 'bordered' | 'minimal' | undefined;
    
    cards.push({ type, title, description, variant });
    
    // Remove the card data from the text content
    textContent = textContent.replace(cardMatch[0], '');
  }
  
  // Extract form data from message content
  // Format: [[FORM:type:optionalJsonData?]]
  const formRegex = /\[\[FORM:(\w+)(?::(\{.*?\}))?\]\]/g;
  let formMatch;
  
  while ((formMatch = formRegex.exec(content)) !== null) {
    const type = formMatch[1] as FormType;
    const jsonData = formMatch[2]; 
    
    const form: ExtractedForm = { type };
    
    // Parse JSON data if present
    if (jsonData) {
      try {
        form.data = JSON.parse(jsonData);
      } catch (error) {
        console.error('Failed to parse form data:', error);
      }
    }
    
    forms.push(form);
    
    // Remove the form marker from the text content
    textContent = textContent.replace(formMatch[0], '');
  }

  return {
    textContent: textContent.trim(),
    cards,
    forms
  };
};

/**
 * Helper function to build a card marker string
 */
export const buildCardMarker = (
  type: CardType, 
  title: string, 
  description: string, 
  variant?: 'default' | 'bordered' | 'minimal'
): string => {
  if (variant) {
    return `[[CARD:${type}:${title}:${description}:${variant}]]`;
  }
  return `[[CARD:${type}:${title}:${description}]]`;
};

/**
 * Helper function to build a form marker string
 */
export const buildFormMarker = (type: FormType, data?: Record<string, string>): string => {
  if (data) {
    return `[[FORM:${type}:${JSON.stringify(data)}]]`;
  }
  return `[[FORM:${type}]]`;
};

