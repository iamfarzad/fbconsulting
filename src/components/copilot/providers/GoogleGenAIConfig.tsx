
import React, { useState } from 'react';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { testGoogleGenAIConnection } from '@/services/copilot/googleGenAIAdapter';

export const GoogleGenAIConfig: React.FC = () => {
  const { apiKey } = useGeminiAPI();
  const [formState, setFormState] = useState({
    apiKey: apiKey || '',
    modelName: 'gemini-1.5-flash',
    temperature: 0.7,
    maxOutputTokens: 2048,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

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
  );
};
