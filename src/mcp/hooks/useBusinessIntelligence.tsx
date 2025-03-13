
/**
 * Custom hook for using the Business Intelligence Protocol
 */

import { useCallback, useState } from 'react';
import { useMCP } from './useMCP';
import { 
  BusinessData, 
  createBusinessIntelligenceProtocol,
  createLinkedInLookupMessage,
  createWebsiteLookupMessage,
  createSetCompanyInfoMessage,
  createSetContactInfoMessage,
  createClearDataMessage
} from '../protocols/businessIntelligence';

// Options for initializing the hook
interface UseBusinessIntelligenceOptions {
  initialData?: Partial<BusinessData>;
}

// Return type for the hook
interface UseBusinessIntelligenceResult {
  businessData: BusinessData;
  lookupLinkedIn: (profileUrl: string) => void;
  lookupWebsite: (websiteUrl: string) => void;
  setCompanyInfo: (companyInfo: Partial<BusinessData>) => void;
  setContactInfo: (contactInfo: Partial<BusinessData['contact']>) => void;
  clearData: () => void;
  isLoading: boolean;
  error?: string;
}

export function useBusinessIntelligence(
  options: UseBusinessIntelligenceOptions = {}
): UseBusinessIntelligenceResult {
  const protocol = createBusinessIntelligenceProtocol(options.initialData || {});
  const [model, sendMessage] = useMCP(protocol);
  
  // Track loading state and error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Lookup LinkedIn profile
  const lookupLinkedIn = useCallback(async (profileUrl: string) => {
    setIsLoading(true);
    try {
      await sendMessage(createLinkedInLookupMessage(profileUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [sendMessage]);

  // Lookup website
  const lookupWebsite = useCallback(async (websiteUrl: string) => {
    setIsLoading(true);
    try {
      await sendMessage(createWebsiteLookupMessage(websiteUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [sendMessage]);

  // Set company information
  const setCompanyInfo = useCallback((companyInfo: Partial<BusinessData>) => {
    sendMessage(createSetCompanyInfoMessage(companyInfo));
  }, [sendMessage]);

  // Set contact information
  const setContactInfo = useCallback((contactInfo: Partial<BusinessData['contact']>) => {
    sendMessage(createSetContactInfoMessage(contactInfo));
  }, [sendMessage]);

  // Clear all data
  const clearData = useCallback(() => {
    sendMessage(createClearDataMessage());
  }, [sendMessage]);

  return {
    businessData: model,
    lookupLinkedIn,
    lookupWebsite,
    setCompanyInfo,
    setContactInfo,
    clearData,
    isLoading,
    error
  };
}
