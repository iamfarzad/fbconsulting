import React from 'react';

interface ClearChatButtonProps {
  onClick: () => void;
}

export const ClearChatButton: React.FC<ClearChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      Clear Chat
    </button>
  );
};
