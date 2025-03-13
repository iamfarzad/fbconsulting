
/**
 * Business Intelligence Protocol Types
 * Type definitions for business intelligence operations
 */

import { Context } from '../../core/types';
import { mcpClient } from '../../services/mcpClient';

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
  
  // Additional fields
  employeeCount?: string;
  founded?: string;
  headquarters?: string;
  confidenceScore?: number;
  
  // Contact information
  contact?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
    role?: string;
    department?: string;
  };
  
  // Technical metadata
  lastUpdated?: string;
  rawData?: any;
  error?: string;
}

// Context for business intelligence operations
export interface BusinessIntelligenceContext extends Context {
  mcpClient: typeof mcpClient;
}

// Default context with MCP client
export const defaultContext: BusinessIntelligenceContext = {
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
