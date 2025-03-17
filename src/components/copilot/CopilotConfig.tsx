
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useGeminiAPI } from '@/App';
import { Loader2 } from 'lucide-react';

export const CopilotConfig: React.FC = () => {
  const { apiKey: contextApiKey } = useGeminiAPI();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);
  
  // Load saved API key from localStorage if available
  useEffect(() => {
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.apiKey) {
          setApiKey(config.apiKey);
          setHasSavedKey(true);
        }
      } catch (error) {
        console.error('Error parsing saved configuration:', error);
      }
    } else if (contextApiKey) {
      setApiKey(contextApiKey);
      setHasSavedKey(true);
    }
  }, [contextApiKey]);
  
  const testGeminiConnection = async (key: string): Promise<boolean> => {
    if (!key) return false;
    
    try {
      setIsLoading(true);
      
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
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      return Boolean(data.candidates);
    } catch (error) {
      console.error('Error testing Gemini API:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveConfig = async () => {
    try {
      // Test connection
      const isConnected = await testGeminiConnection(apiKey);
      
      if (isConnected) {
        // Save configuration to localStorage - store the full API key securely
        localStorage.setItem('GEMINI_CONFIG', JSON.stringify({
          apiKey: apiKey,
          timestamp: Date.now()
        }));
        
        setHasSavedKey(true);
        toast.success('Gemini API configuration saved successfully!');
        
        // Reload the page to apply the new API key
        window.location.reload();
      } else {
        toast.error('Failed to connect to Gemini API', {
          description: 'Please check your API key and try again.'
        });
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    }
  };
  
  const handleClearConfig = () => {
    localStorage.removeItem('GEMINI_CONFIG');
    setApiKey('');
    setHasSavedKey(false);
    toast.success('API configuration cleared');
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
          <p className="text-xs text-muted-foreground mt-1">
            Get your API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleSaveConfig} 
          disabled={!apiKey || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            hasSavedKey ? 'Update API Key' : 'Save Configuration'
          )}
        </Button>
        
        {hasSavedKey && (
          <Button 
            variant="outline" 
            onClick={handleClearConfig} 
            className="w-full"
          >
            Clear Configuration
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
