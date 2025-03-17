
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useGeminiAPI } from '@/App';

export const CopilotConfig: React.FC = () => {
  const { apiKey: contextApiKey } = useGeminiAPI();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Load saved API key from localStorage if available
  useEffect(() => {
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setApiKey(config.apiKey || '');
      } catch (error) {
        console.error('Error parsing saved configuration:', error);
      }
    } else if (contextApiKey) {
      setApiKey(contextApiKey);
    }
  }, [contextApiKey]);
  
  const testGeminiConnection = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: 'Hello, this is a test message.' }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 100,
            }
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return !!data.candidates;
    } catch (error) {
      console.error('Error testing Gemini API:', error);
      return false;
    }
  };
  
  const handleSaveConfig = async () => {
    try {
      setIsLoading(true);
      
      // Test connection
      const isConnected = await testGeminiConnection(apiKey);
      
      if (isConnected) {
        // Save configuration to localStorage
        localStorage.setItem('GEMINI_CONFIG', JSON.stringify({
          apiKey: apiKey.substring(0, 3) + '...' + apiKey.substring(apiKey.length - 3),
        }));
        
        toast.success('Gemini API configuration saved successfully!');
      } else {
        toast.error('Failed to connect to Gemini API. Please check your API key.');
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
        <CardTitle>Gemini API Configuration</CardTitle>
        <CardDescription>
          Configure your Google Gemini API integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Gemini API Key</Label>
          <Input
            id="apiKey"
            type="password" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveConfig} 
          disabled={!apiKey || isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing Connection...' : 'Save Configuration'}
        </Button>
      </CardFooter>
    </Card>
  );
};
