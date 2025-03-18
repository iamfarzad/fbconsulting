
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { APIKeyInput } from './config/APIKeyInput';
import { ModelSelector } from './config/ModelSelector';
import { ConnectionTester } from './config/ConnectionTester';
import { EnvironmentKeyAlert } from './config/EnvironmentKeyAlert';
import { useGeminiConfig } from './config/useGeminiConfig';

export const CopilotConfig: React.FC = () => {
  const {
    apiKey,
    setApiKey,
    modelName,
    setModelName,
    isLoading,
    hasSavedKey,
    hasEnvKey,
    envKeyValue,
    handleSaveConfig,
    handleClearConfig
  } = useGeminiConfig();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Gemini API Configuration</CardTitle>
        <CardDescription>
          Configure your Google Gemini API integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EnvironmentKeyAlert 
          hasEnvKey={hasEnvKey} 
          envKeyValue={envKeyValue} 
        />
        
        <APIKeyInput 
          apiKey={apiKey} 
          setApiKey={setApiKey} 
          hasSavedKey={hasSavedKey} 
        />
        
        <ModelSelector 
          modelName={modelName} 
          setModelName={setModelName} 
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <ConnectionTester 
          apiKey={apiKey}
          modelName={modelName}
          isLoading={isLoading}
          hasSavedKey={hasSavedKey}
          onSave={handleSaveConfig}
          onClear={handleClearConfig}
        />
      </CardFooter>
    </Card>
  );
};
