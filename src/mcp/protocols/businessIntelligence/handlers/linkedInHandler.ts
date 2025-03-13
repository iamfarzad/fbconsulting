
/**
 * LinkedIn Handler
 * Handler for LinkedIn profile lookup operations
 */

import { Message, Handler } from '../../../core/types';
import { BusinessData, BusinessIntelligenceContext, LinkedInLookupPayload, MessageType } from '../types';

// LinkedIn lookup handler
export const linkedInLookupHandler: Handler<BusinessData, BusinessIntelligenceContext> = async (model, context, message) => {
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
      employeeCount: data.employee_count || model.employeeCount,
      founded: data.founded || model.founded,
      headquarters: data.headquarters || model.headquarters,
      confidenceScore: 0.75, // Default confidence score
      contact: {
        ...model.contact,
        name: data.name || model.contact?.name,
        title: data.title || model.contact?.title,
        role: data.role || model.contact?.role,
        department: data.department || model.contact?.department,
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
};
