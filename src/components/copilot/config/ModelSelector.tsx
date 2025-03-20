
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
            <SelectItem value="gemini-2.0-flash">gemini-2.0-flash (Fastest)</SelectItem>
            <SelectItem value="gemini-2.0-pro">gemini-2.0-pro (Balance)</SelectItem>
            <SelectItem value="gemini-2.0-flash">gemini-2.0-flash (Vision)</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          Choose the Gemini model to use for generating responses
        </FormDescription>
      </FormItem>
    </div>
  );
}
