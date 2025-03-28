import React from 'react';

interface CopilotConfigProps {
  apiKey?: string;
  modelName?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export const CopilotConfig: React.FC<CopilotConfigProps> = (props) => {
  // We're intentionally not destructuring props since they're used for configuration
  // and accessed by parent components through React's component tree
  React.useEffect(() => {
    // Register configuration with parent provider
    if (process.env.NODE_ENV === 'development') {
      console.debug('CopilotConfig initialized with:', {
        ...props,
        apiKey: props.apiKey ? '[REDACTED]' : undefined
      });
    }
  }, [props]);

  return null;
};

export default CopilotConfig;
