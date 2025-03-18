
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useGeminiAPI } from '@/App';
import { Loader2, Info, AlertCircle, Check } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const CopilotConfig: React.FC = () => {
  const { apiKey: contextApiKey } = useGeminiAPI();
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('gemini-2.0-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSavedKey, setHasSavedKey] = useState(false);
  const [hasEnvKey, setHasEnvKey] = useState(false);
  const [envKeyValue, setEnvKeyValue] = useState('');
  
  // Load saved API key from localStorage if available
  useEffect(() => {
    // Check for environment variable
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    setHasEnvKey(!!envApiKey);
    if (envApiKey) {
      setEnvKeyValue(envApiKey);
      console.log("Environment API key detected:", envApiKey.substring(0, 5) + "..." + envApiKey.substring(envApiKey.length - 4));
    }
    
    // Check localStorage
    const savedConfig = localStorage.getItem('GEMINI_CONFIG');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.apiKey) {
          setApiKey(config.apiKey);
          setHasSavedKey(true);
          console.log("Local storage API key detected");
        }
        if (config.modelName) {
          setModelName(config.modelName);
        }
      } catch (error) {
        console.error('Error parsing saved configuration:', error);
      }
    } else if (contextApiKey) {
      setApiKey(contextApiKey);
      setHasSavedKey(true);
    }
  }, [contextApiKey]);
  
  const testGeminiConnection = async (key: string, model: string): Promise<boolean> => {
    if (!key) return false;
    
    try {
      setIsLoading(true);
      console.log(`Testing Gemini connection with model: ${model}`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
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
        console.error("API error response:", errorData);
        throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Test response:", data.candidates ? "Success" : "No candidates in response");
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
      const isConnected = await testGeminiConnection(apiKey, modelName);
      
      if (isConnected) {
        // Save configuration to localStorage - store the full API key securely
        localStorage.setItem('GEMINI_CONFIG', JSON.stringify({
          apiKey: apiKey,
          modelName: modelName,
          timestamp: Date.now()
        }));
        
        setHasSavedKey(true);
        toast.success('Gemini API configuration saved successfully!');
        
        // Reload the page to apply the new API key
        window.location.reload();
      } else {
        toast.error('Failed to connect to Gemini API', {
          description: 'Please check your API key and model selection and try again.'
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
    setModelName('gemini-2.0-flash');
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
        {hasEnvKey && (
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              Environment API key detected: {envKeyValue.substring(0, 5)}...{envKeyValue.substring(envKeyValue.length - 4)}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="apiKey">Gemini API Key</Label>
            {hasSavedKey && (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="h-3 w-3" /> Key saved
              </span>
            )}
          </div>
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
        
        <div className="space-y-2">
          <Label htmlFor="modelSelect">Gemini Model</Label>
          <Select value={modelName} onValueChange={setModelName}>
            <SelectTrigger id="modelSelect">
              <SelectValue placeholder="Select Gemini model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
              <SelectItem value="gemini-2.0-pro">Gemini 2.0 Pro</SelectItem>
              <SelectItem value="gemini-2.0-vision">Gemini 2.0 Vision</SelectItem>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
              <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
              <SelectItem value="gemini-1.5-pro-vision">Gemini 1.5 Pro Vision</SelectItem>
              <SelectItem value="gemini-pro">Gemini Pro (Legacy)</SelectItem>
              <SelectItem value="gemini-pro-vision">Gemini Pro Vision (Legacy)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Select the Gemini model you want to use for AI assistant
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
