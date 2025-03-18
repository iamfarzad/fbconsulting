
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ModelSelectorProps {
  modelName: string;
  setModelName: (value: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  modelName,
  setModelName
}) => {
  return (
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
  );
};
