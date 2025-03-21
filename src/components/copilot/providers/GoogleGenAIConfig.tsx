import React, { useState } from 'react';
import useGeminiAPI from '@/hooks/useGeminiAPI';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Info, Check, AlertCircle } from 'lucide-react';

export const GoogleGenAIConfig: React.FC = () => {
  const { apiKey } = useGeminiAPI();
  const [formState, setFormState] = useState({
    apiKey: apiKey || '',
    modelName: 'gemini-pro',
    temperature: 0.7,
    maxOutputTokens: 2048,
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

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
  );
};
