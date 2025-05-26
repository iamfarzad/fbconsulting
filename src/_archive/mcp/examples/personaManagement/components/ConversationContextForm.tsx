
import React from 'react';

interface ConversationContextFormProps {
  conversationContext: string;
  onChange: (context: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ConversationContextForm: React.FC<ConversationContextFormProps> = ({
  conversationContext,
  onChange,
  onSubmit
}) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-3">Conversation Context</h3>
      <form onSubmit={onSubmit}>
        <textarea
          className="w-full p-2 mb-2 border rounded-md"
          rows={3}
          placeholder="Enter conversation text to analyze for persona determination"
          value={conversationContext}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Set Context
        </button>
      </form>
    </div>
  );
};
