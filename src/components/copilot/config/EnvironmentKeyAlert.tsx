
import React from 'react';
import { Check } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EnvironmentKeyAlertProps {
  hasEnvKey: boolean;
  envKeyValue: string;
}

export const EnvironmentKeyAlert: React.FC<EnvironmentKeyAlertProps> = ({
  hasEnvKey,
  envKeyValue
}) => {
  if (!hasEnvKey) return null;
  
  return (
    <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      <AlertDescription className="text-green-600 dark:text-green-400">
        Environment API key detected: {envKeyValue.substring(0, 5)}...{envKeyValue.substring(envKeyValue.length - 4)}
      </AlertDescription>
    </Alert>
  );
};
