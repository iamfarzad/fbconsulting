
import React, { useState } from 'react';
import { useGemini } from '@/components/copilot/providers/GeminiProvider';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function HeroChat() {
  const [inputValue, setInputValue] = useState('');
  const { messages, sendMessage, isProcessing: isLoading } = useGemini();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await sendMessage({
        type: 'text_message',
        text: inputValue,
      });
      setInputValue('');
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  // Find the most recent response from the assistant
  const latestResponse = messages
    .filter(msg => msg.role === 'assistant')
    .pop()?.content || '';

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800 dark:text-white">
        <div className="min-h-[200px] mb-4">
          {latestResponse && (
            <div className="prose dark:prose-invert">
              <p>{latestResponse}</p>
            </div>
          )}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
