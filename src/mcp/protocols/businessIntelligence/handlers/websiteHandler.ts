
/**
 * Website Handler
 * Handler for website lookup operations
 */

import { Handler } from '../../../core/types';
import { BusinessData, BusinessIntelligenceContext, WebsiteLookupPayload } from '../types';

// Website lookup handler
export const websiteLookupHandler: Handler<BusinessData, BusinessIntelligenceContext> = async (model, context, message) => {
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
      employeeCount: data.employee_count || model.employeeCount,
      founded: data.founded || model.founded,
      headquarters: data.headquarters || model.headquarters,
      confidenceScore: 0.85, // Default confidence score for website lookup
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
};
