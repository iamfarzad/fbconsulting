
/**
 * Update Handlers
 * Handlers for updating business information
 */

import { Handler } from '../../../core/types';
import { BusinessData, BusinessIntelligenceContext } from '../types';

// Company info update handler
export const setCompanyInfoHandler: Handler<BusinessData, BusinessIntelligenceContext> = (model, _context, message) => {
  const companyInfo = message.payload as Partial<BusinessData>;
  return {
    ...model,
    ...companyInfo,
    lastUpdated: new Date().toISOString(),
    error: undefined
  };
};

// Contact info update handler
export const setContactInfoHandler: Handler<BusinessData, BusinessIntelligenceContext> = (model, _context, message) => {
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
};

// Clear data handler
export const clearDataHandler: Handler<BusinessData, BusinessIntelligenceContext> = (_model, _context, _message) => {
  return {
    lastUpdated: new Date().toISOString(),
    error: undefined
  };
};
