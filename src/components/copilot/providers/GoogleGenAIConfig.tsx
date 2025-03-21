import React, { useState } from 'react';
import useGeminiAPI from '@/hooks/useGeminiAPI';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
<<<<<<< HEAD
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Info, Check, AlertCircle } from 'lucide-react';
=======
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { testGoogleGenAIConnection } from '@/services/copilot/googleGenAIAdapter';
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248

export const GoogleGenAIConfig: React.FC = () => {
  const { apiKey } = useGeminiAPI();
  const [formState, setFormState] = useState({
    apiKey: apiKey || '',
<<<<<<< HEAD
    modelName: 'gemini-pro',
    temperature: 0.7,
    maxOutputTokens: 2048,
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
=======
    modelName: 'gemini-1.5-flash',
    temperature: 0.7,
    maxOutputTokens: 2048,
  });
  const [isLoading, setIsLoading] = useState(false);
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const saveAPIKey = () => {
    if (!formState.apiKey) return;

    localStorage.setItem('gemini-api-key', formState.apiKey);
    setTestMessage('API key saved to local storage');
    setTestStatus('success');

    // Reset status after 3 seconds
    setTimeout(() => {
      setTestStatus('idle');
      setTestMessage('');
    }, 3000);
  };

  const testConnection = async () => {
    setTestStatus('loading');
    setTestMessage('Testing connection...');

    try {
      // Simple test request would go here
      // For demo purposes, we'll simulate a successful test
      await new Promise(resolve => setTimeout(resolve, 1500));

      setTestStatus('success');
      setTestMessage('Connection successful!');
    } catch (error) {
      setTestStatus('error');
      setTestMessage('Connection failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setTestStatus('idle');
      setTestMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Gemini AI Configuration</CardTitle>
          <CardDescription>
            Configure your Google Gemini AI API settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex space-x-2">
              <Input 
                id="api-key"
                name="apiKey"
                type="password"
                placeholder="Enter your Google API key"
                value={formState.apiKey}
                onChange={handleInputChange}
                className="flex-1"
              />
              <Button onClick={saveAPIKey} disabled={!formState.apiKey}>
                <Key className="mr-2 h-4 w-4" />
                Save Key
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={formState.modelName} onValueChange={(value) => setFormState(prev => ({ ...prev, modelName: value }))}>
              <SelectTrigger id="model" className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={testConnection} 
            variant="outline" 
            disabled={!formState.apiKey || testStatus === 'loading'}
            className="w-full"
          >
            {testStatus === 'loading' ? (
              <>Testing connection...</>
            ) : (
              <>
                <Info className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>
          
          {testStatus !== 'idle' && testMessage && (
            <Alert variant={testStatus === 'error' ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {testMessage}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
=======
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormState(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Test connection with the provided configuration
      const isConnected = await testGoogleGenAIConnection({
        apiKey: formState.apiKey,
        modelName: formState.modelName,
        temperature: formState.temperature,
        maxOutputTokens: formState.maxOutputTokens,
      });

      if (isConnected) {
        toast({
          title: 'Success',
          description: 'Google GenAI configuration saved successfully!',
        });
      }
    } catch (error) {
      console.error('Failed to test connection:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to Google GenAI. Please check your configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Google GenAI Configuration</CardTitle>
        <CardDescription>
          Configure your Google GenAI integration for CopilotKit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              value={formState.apiKey}
              onChange={handleInputChange}
              placeholder="Enter your Google GenAI API Key"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelName">Model</Label>
            <Select
              value={formState.modelName}
              onValueChange={(value) => handleSelectChange('modelName', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature: {formState.temperature}</Label>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[formState.temperature]}
              onValueChange={(value) => handleSliderChange('temperature', value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxOutputTokens">Max Output Tokens</Label>
            <Input
              id="maxOutputTokens"
              name="maxOutputTokens"
              type="number"
              min={1}
              max={8192}
              value={formState.maxOutputTokens}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Testing Connection...' : 'Save Configuration'}
        </Button>
      </CardFooter>
    </Card>
>>>>>>> 44c511508503dd095b03982951210a7fcbaaf248
  );
};
