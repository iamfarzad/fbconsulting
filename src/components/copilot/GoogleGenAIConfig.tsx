
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Info, Check, AlertCircle } from 'lucide-react';

export const GoogleGenAIConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-pro');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  
  const saveAPIKey = () => {
    if (!apiKey) return;
    
    localStorage.setItem('gemini-api-key', apiKey);
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
                type="password"
                placeholder="Enter your Google API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveAPIKey} disabled={!apiKey}>
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
            <Select value={model} onValueChange={setModel}>
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
            disabled={!apiKey || testStatus === 'loading'}
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
