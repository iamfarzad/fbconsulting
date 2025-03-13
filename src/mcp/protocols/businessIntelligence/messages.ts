
/**
 * Business Intelligence Protocol Messages
 * Message creators for business intelligence operations
 */

import { Message } from '../../core/types';
import { 
  BusinessData, 
  MessageType, 
  LinkedInLookupPayload, 
  WebsiteLookupPayload
} from './types';

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
