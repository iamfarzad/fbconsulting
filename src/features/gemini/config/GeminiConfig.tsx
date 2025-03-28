
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

export const CopilotConfig: React.FC = () => {
  const [formState, setFormState] = useState({
    apiKey: '',
    modelName: 'gemini-1.5-flash',
    temperature: 0.7,
    maxTokens: 2048,
    enableVoice: false,
    voiceName: 'en-US-Neural2-F',
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save configuration to localStorage
      localStorage.setItem('COPILOT_CONFIG', JSON.stringify({
        apiKey: formState.apiKey,
        modelName: formState.modelName,
        temperature: formState.temperature,
        maxTokens: formState.maxTokens,
        voice: {
          enabled: formState.enableVoice,
          name: formState.voiceName
        }
      }));

      toast({
        title: 'Success',
        description: 'Configuration saved successfully!',
      });
    } catch (error) {
      console.error('Failed to save configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to save configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Copilot Configuration</CardTitle>
        <CardDescription>
          Configure your Copilot integration
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
              placeholder="Enter your API Key"
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
            <Label htmlFor="maxTokens">Max Tokens</Label>
            <Input
              id="maxTokens"
              name="maxTokens"
              type="number"
              min={1}
              max={8192}
              value={formState.maxTokens}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableVoice">Enable Voice</Label>
            <Switch
              id="enableVoice"
              checked={formState.enableVoice}
              onCheckedChange={(checked) => handleSwitchChange('enableVoice', checked)}
            />
          </div>

          {formState.enableVoice && (
            <div className="space-y-2">
              <Label htmlFor="voiceName">Voice</Label>
              <Select
                value={formState.voiceName}
                onValueChange={(value) => handleSelectChange('voiceName', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US-Neural2-F">Female (US)</SelectItem>
                  <SelectItem value="en-US-Neural2-M">Male (US)</SelectItem>
                  <SelectItem value="en-GB-Neural2-F">Female (UK)</SelectItem>
                  <SelectItem value="en-GB-Neural2-M">Male (UK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CopilotConfig;
