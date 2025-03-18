
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';

interface ModelSelectorProps {
  modelName: string;
  setModelName: (modelName: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  modelName, 
  setModelName 
}) => {
  const handleChange = (value: string) => {
    setModelName(value);
  };
  
  return (
    <div className="space-y-2">
      <FormItem>
        <FormLabel>Gemini Model</FormLabel>
        <Select value={modelName} onValueChange={handleChange}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="gemini-1.5-flash">gemini-1.5-flash (Fastest)</SelectItem>
            <SelectItem value="gemini-1.5-pro">gemini-1.5-pro (Balance)</SelectItem>
            <SelectItem value="gemini-1.5-pro-vision">gemini-1.5-pro-vision (Vision)</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          Choose the Gemini model to use for generating responses
        </FormDescription>
      </FormItem>
    </div>
  );
}
