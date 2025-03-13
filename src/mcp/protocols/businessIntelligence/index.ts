
/**
 * Business Intelligence Protocol
 * Protocol for gathering business information from LinkedIn, websites, etc.
 */

import { Protocol, Handler } from '../../core/types';
import { BusinessData, BusinessIntelligenceContext, defaultContext, MessageType } from './types';
import { linkedInLookupHandler } from './handlers/linkedInHandler';
import { websiteLookupHandler } from './handlers/websiteHandler';
import { setCompanyInfoHandler, setContactInfoHandler, clearDataHandler } from './handlers/updateHandlers';

// Export all types and message creators
export * from './types';
export * from './messages';

// Protocol handlers mapping
const handlers: Record<string, Handler<BusinessData, BusinessIntelligenceContext>> = {
  [MessageType.LINKEDIN_LOOKUP]: linkedInLookupHandler,
  [MessageType.WEBSITE_LOOKUP]: websiteLookupHandler,
  [MessageType.SET_COMPANY_INFO]: setCompanyInfoHandler,
  [MessageType.SET_CONTACT_INFO]: setContactInfoHandler,
  [MessageType.CLEAR_DATA]: clearDataHandler
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
