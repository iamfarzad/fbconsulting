
/**
 * Business Intelligence Protocol
 * Protocol for gathering business information from LinkedIn, websites, etc.
 */

import { Protocol, Handler, Message, Context } from '../core/types';
import { mcpClient } from '../services/mcpClient';

// Business data model
export interface BusinessData {
  // Company information
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  linkedInProfile?: string;
  description?: string;
  services?: string[];
  products?: string[];
  locations?: string[];
  foundingYear?: number;
  revenue?: string;
  
  // Contact information
  contact?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
  };
  
  // Technical metadata
  lastUpdated?: string;
  rawData?: any;
  error?: string; // Added error field
}

// Context for business intelligence operations
export interface BusinessIntelligenceContext extends Context {
  mcpClient: typeof mcpClient;
}

// Default context with MCP client
const defaultContext: BusinessIntelligenceContext = {
  mcpClient
};

// Message types for the protocol
export enum MessageType {
  LINKEDIN_LOOKUP = 'LINKEDIN_LOOKUP',
  WEBSITE_LOOKUP = 'WEBSITE_LOOKUP',
  SET_COMPANY_INFO = 'SET_COMPANY_INFO',
  SET_CONTACT_INFO = 'SET_CONTACT_INFO',
  CLEAR_DATA = 'CLEAR_DATA',
}

// Message payload interfaces
export interface LinkedInLookupPayload {
  profileUrl: string;
}

export interface WebsiteLookupPayload {
  websiteUrl: string;
}

// Message creators
export function createLinkedInLookupMessage(profileUrl: string): Message<LinkedInLookupPayload> {
  return {
    type: MessageType.LINKEDIN_LOOKUP,
    payload: { profileUrl }
  };
}

export function createWebsiteLookupMessage(websiteUrl: string): Message<WebsiteLookupPayload> {
  return {
    type: MessageType.WEBSITE_LOOKUP,
    payload: { websiteUrl }
  };
}

export function createSetCompanyInfoMessage(companyInfo: Partial<BusinessData>): Message<Partial<BusinessData>> {
  return {
    type: MessageType.SET_COMPANY_INFO,
    payload: companyInfo
  };
}

export function createSetContactInfoMessage(contactInfo: Partial<BusinessData['contact']>): Message<Partial<BusinessData['contact']>> {
  return {
    type: MessageType.SET_CONTACT_INFO,
    payload: contactInfo
  };
}

export function createClearDataMessage(): Message<void> {
  return {
    type: MessageType.CLEAR_DATA
  };
}

// Protocol handlers
const handlers: Record<string, Handler<BusinessData, BusinessIntelligenceContext>> = {
  [MessageType.LINKEDIN_LOOKUP]: async (model, context, message) => {
    try {
      const payload = message.payload as LinkedInLookupPayload;
      
      console.log(`Looking up LinkedIn profile: ${payload.profileUrl}`);
      
      // Call the MCP client to get LinkedIn data
      const response = await context.mcpClient.queryLinkedIn(payload.profileUrl);
      
      if (!response.success) {
        return {
          ...model,
          error: response.error || 'Failed to retrieve LinkedIn profile data'
        };
      }
      
      // Extract relevant data from the response
      const data = response.data || {};
      return {
        ...model,
        companyName: data.company_name || model.companyName,
        companySize: data.company_size || model.companySize,
        industry: data.industry || model.industry,
        linkedInProfile: payload.profileUrl,
        contact: {
          ...model.contact,
          name: data.name || model.contact?.name,
          title: data.title || model.contact?.title,
          linkedIn: payload.profileUrl
        },
        lastUpdated: new Date().toISOString(),
        rawData: { ...model.rawData, linkedin: data },
        error: undefined
      };
    } catch (error) {
      console.error('Error in LinkedIn lookup handler:', error);
      return {
        ...model,
        error: error instanceof Error ? error.message : 'Unknown error during LinkedIn lookup'
      };
    }
  },
  
  [MessageType.WEBSITE_LOOKUP]: async (model, context, message) => {
    try {
      const payload = message.payload as WebsiteLookupPayload;
      
      console.log(`Researching website: ${payload.websiteUrl}`);
      
      // Call the MCP client to get website data
      const response = await context.mcpClient.researchWebsite(payload.websiteUrl);
      
      if (!response.success) {
        return {
          ...model,
          error: response.error || 'Failed to retrieve website data'
        };
      }
      
      // Extract relevant data from the response
      const data = response.data || {};
      return {
        ...model,
        companyWebsite: payload.websiteUrl,
        companyName: data.company_name || model.companyName,
        description: data.description || model.description,
        services: data.services || model.services,
        products: data.products || model.products,
        industry: data.industry || model.industry,
        companySize: data.company_size || model.companySize,
        lastUpdated: new Date().toISOString(),
        rawData: { ...model.rawData, website: data },
        error: undefined
      };
    } catch (error) {
      console.error('Error in website lookup handler:', error);
      return {
        ...model,
        error: error instanceof Error ? error.message : 'Unknown error during website lookup'
      };
    }
  },
  
  [MessageType.SET_COMPANY_INFO]: (model, _context, message) => {
    const companyInfo = message.payload as Partial<BusinessData>;
    return {
      ...model,
      ...companyInfo,
      lastUpdated: new Date().toISOString(),
      error: undefined
    };
  },
  
  [MessageType.SET_CONTACT_INFO]: (model, _context, message) => {
    const contactInfo = message.payload as Partial<BusinessData['contact']>;
    return {
      ...model,
      contact: {
        ...(model.contact || {}),
        ...contactInfo
      },
      lastUpdated: new Date().toISOString(),
      error: undefined
    };
  },
  
  [MessageType.CLEAR_DATA]: (_model, _context, _message) => {
    return {
      lastUpdated: new Date().toISOString(),
      error: undefined
    };
  }
};

// Create protocol
export function createBusinessIntelligenceProtocol(initialData: Partial<BusinessData> = {}): Protocol<BusinessData, BusinessIntelligenceContext> {
  return {
    initialModel: {
      ...initialData,
      lastUpdated: new Date().toISOString()
    } as BusinessData,
    context: defaultContext,
    handlers
  };
}
