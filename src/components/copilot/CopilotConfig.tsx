
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { initializeAzureAI, testAzureConnection } from '../../services/copilot/azureService';

export const CopilotConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [deploymentName, setDeploymentName] = useState('gpt-4o');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveConfig = async () => {
    try {
      setIsLoading(true);
      
      // Initialize and test connection
      const config = initializeAzureAI({
        apiKey,
        endpoint,
        deploymentName
      });
      
      const isConnected = await testAzureConnection(config);
      
      if (isConnected) {
        // In a real implementation, we would save these securely
        localStorage.setItem('COPILOT_CONFIG', JSON.stringify({
          endpoint,
          deploymentName,
          // Note: In a real app, never store API keys in localStorage
          // This is just for demo purposes
          apiKey: apiKey.substring(0, 3) + '...' + apiKey.substring(apiKey.length - 3)
        }));
        
        toast.success('CopilotKit configuration saved successfully!');
      } else {
        toast.error('Failed to connect to Azure OpenAI');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>CopilotKit Configuration</CardTitle>
        <CardDescription>
          Configure your Azure OpenAI integration for CopilotKit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Azure API Key</Label>
          <Input
            id="apiKey"
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Azure API key"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endpoint">Azure Endpoint</Label>
          <Input
            id="endpoint" 
            value={endpoint} 
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://your-resource-name.openai.azure.com/"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deploymentName">Deployment Name</Label>
          <Input
            id="deploymentName" 
            value={deploymentName} 
            onChange={(e) => setDeploymentName(e.target.value)}
            placeholder="gpt-4o"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveConfig} 
          disabled={!apiKey || !endpoint || !deploymentName || isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing Connection...' : 'Save Configuration'}
        </Button>
      </CardFooter>
    </Card>
  );
};
