import React from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage, GeminiUserInfo } from '@/types';

interface ProposalPreviewProps {
  userInfo: GeminiUserInfo;
  messages: ChatMessage[];
  onSend: () => void;
  onStartOver: () => void;
  className?: string;
}

export const ProposalPreview: React.FC<ProposalPreviewProps> = ({
  userInfo,
  messages,
  onSend,
  onStartOver,
  className,
}) => {
  // Extract key points from messages
  const keyPoints = messages
    .filter((m) => m.role === 'assistant')
    .map((m) => m.content)
    .join('\n')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .slice(0, 5);

  return (
    <div className={cn("space-y-6 p-6 bg-white rounded-lg shadow-lg", className)}>
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold mb-2">Your Proposal Summary</h2>
        <p className="text-gray-600">
          Prepared for {userInfo.name} ({userInfo.email})
        </p>
      </div>

      {/* Key Points */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Key Points</h3>
        <ul className="list-disc pl-5 space-y-2">
          {keyPoints.map((point, index) => (
            <li key={index} className="text-gray-700">{point}</li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end pt-4 border-t">
        <button
          onClick={onStartOver}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Start Over
        </button>
        <button
          onClick={onSend}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Send Proposal
        </button>
      </div>
    </div>
  );
};

export default ProposalPreview;
