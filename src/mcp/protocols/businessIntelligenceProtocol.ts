
/**
 * Business Intelligence Protocol
 * Handles gathering and processing business data from external sources
 */

import { Protocol, Context, Message, Model } from '../core/types';
import { MCPClient, mcpClient } from '../services/mcpClient';

// Business data model
export interface BusinessData {
  companyName?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  linkedInProfile?: string;
  description?: string;
  services?: string[];
  employeeCount?: number;
  headquarters?: string;
  founded?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  // Information about the person we're talking to
  contact?: {
    name?: string;
    role?: string;
    department?: string;
  };
  lastUpdated?: number;
  confidenceScore?: number; // 0-1 indicating data reliability
  source?: string;
  rawData?: any; // Original data from sources
}

// Business Intelligence Context
export interface BusinessIntelligenceContext extends Context {
  mcpClient: MCPClient;
}

// Message types
export enum BusinessIntelligenceMessageTypes {
  LOOKUP_LINKEDIN = 'business/lookup_linkedin',
  LOOKUP_WEBSITE = 'business/lookup_website',
  SET_COMPANY_INFO = 'business/set_company_info',
  SET_CONTACT_INFO = 'business/set_contact_info',
  CLEAR_DATA = 'business/clear_data',
}

// Message creators
export const createLinkedInLookupMessage = (profileUrl: string): Message => ({
  type: BusinessIntelligenceMessageTypes.LOOKUP_LINKEDIN,
  payload: { profileUrl }
});

export const createWebsiteLookupMessage = (websiteUrl: string): Message => ({
  type: BusinessIntelligenceMessageTypes.LOOKUP_WEBSITE,
  payload: { websiteUrl }
});

export const createSetCompanyInfoMessage = (companyInfo: Partial<BusinessData>): Message => ({
  type: BusinessIntelligenceMessageTypes.SET_COMPANY_INFO,
  payload: companyInfo
});

export const createSetContactInfoMessage = (contactInfo: Partial<BusinessData['contact']>): Message => ({
  type: BusinessIntelligenceMessageTypes.SET_CONTACT_INFO,
  payload: contactInfo
});

export const createClearDataMessage = (): Message => ({
  type: BusinessIntelligenceMessageTypes.CLEAR_DATA
});

// Create the business intelligence protocol
export const createBusinessIntelligenceProtocol = (
  initialData: Partial<BusinessData> = {}
): Protocol<BusinessData, BusinessIntelligenceContext> => ({
  initialModel: {
    lastUpdated: Date.now(),
    confidenceScore: 0,
    ...initialData
  },
  context: {
    mcpClient
  },
  handlers: {
    [BusinessIntelligenceMessageTypes.LOOKUP_LINKEDIN]: async (model, context, message) => {
      if (!message.payload?.profileUrl) {
        return { ...model, error: 'No LinkedIn profile URL provided' };
      }

      try {
        const response = await context.mcpClient.queryLinkedIn(message.payload.profileUrl);
        
        if (!response.success) {
          return { 
            ...model, 
            error: response.error || 'Failed to retrieve LinkedIn data',
            lastUpdated: Date.now()
          };
        }

        // Extract company and contact information from LinkedIn data
        const data = response.data;
        const updatedModel: BusinessData = {
          ...model,
          linkedInProfile: message.payload.profileUrl,
          companyName: data.company?.name || model.companyName,
          industry: data.company?.industry || model.industry,
          contact: {
            ...model.contact,
            name: data.name || model.contact?.name,
            role: data.headline || model.contact?.role,
          },
          confidenceScore: 0.8, // LinkedIn data is generally reliable
          lastUpdated: Date.now(),
          source: 'LinkedIn',
          rawData: { ...model.rawData, linkedin: data }
        };

        return updatedModel;
      } catch (error) {
        console.error('LinkedIn lookup error:', error);
        return { 
          ...model, 
          error: error instanceof Error ? error.message : 'Unknown error during LinkedIn lookup',
          lastUpdated: Date.now()
        };
      }
    },

    [BusinessIntelligenceMessageTypes.LOOKUP_WEBSITE]: async (model, context, message) => {
      if (!message.payload?.websiteUrl) {
        return { ...model, error: 'No website URL provided' };
      }

      try {
        const response = await context.mcpClient.researchWebsite(message.payload.websiteUrl);
        
        if (!response.success) {
          return { 
            ...model, 
            error: response.error || 'Failed to retrieve website data',
            lastUpdated: Date.now()
          };
        }

        // Extract company information from website data
        const data = response.data;
        const updatedModel: BusinessData = {
          ...model,
          companyWebsite: message.payload.websiteUrl,
          companyName: data.company_name || model.companyName,
          description: data.description || model.description,
          industry: data.industry || model.industry,
          services: data.services || model.services,
          employeeCount: data.employee_count || model.employeeCount,
          headquarters: data.headquarters || model.headquarters,
          founded: data.founded || model.founded,
          contactInfo: {
            ...model.contactInfo,
            email: data.contact_email || model.contactInfo?.email,
            phone: data.contact_phone || model.contactInfo?.phone,
          },
          confidenceScore: 0.7, // Website data is reasonably reliable
          lastUpdated: Date.now(),
          source: 'Website',
          rawData: { ...model.rawData, website: data }
        };

        return updatedModel;
      } catch (error) {
        console.error('Website lookup error:', error);
        return { 
          ...model, 
          error: error instanceof Error ? error.message : 'Unknown error during website lookup',
          lastUpdated: Date.now()
        };
      }
    },

    [BusinessIntelligenceMessageTypes.SET_COMPANY_INFO]: (model, _, message) => {
      if (!message.payload) {
        return model;
      }

      return {
        ...model,
        ...message.payload,
        lastUpdated: Date.now()
      };
    },

    [BusinessIntelligenceMessageTypes.SET_CONTACT_INFO]: (model, _, message) => {
      if (!message.payload) {
        return model;
      }

      return {
        ...model,
        contact: {
          ...model.contact,
          ...message.payload
        },
        lastUpdated: Date.now()
      };
    },

    [BusinessIntelligenceMessageTypes.CLEAR_DATA]: (model) => {
      return {
        confidenceScore: 0,
        lastUpdated: Date.now()
      };
    }
  }
});
