<<<<<<< HEAD
import React from "react";

interface ConnectionStatusIndicatorProps {
  status: "connected" | "connecting" | "disconnected";
}

const getColor = (status: ConnectionStatusIndicatorProps["status"]): string => {
  switch (status) {
    case "connected":
      return "text-green-500";
    case "connecting":
      return "text-yellow-500 animate-pulse";
    case "disconnected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getLabel = (status: ConnectionStatusIndicatorProps["status"]): string => {
  switch (status) {
    case "connected":
      return "🟢 Connected";
    case "connecting":
      return "🟠 Connecting...";
    case "disconnected":
      return "🔴 Disconnected";
    default:
      return "Unknown Status";
  }
};

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ status }) => {
  return (
    <div className={`text-sm font-medium ${getColor(status)}`}>
      {getLabel(status)}
=======
import React, { useContext } from 'react';
import { useGeminiConnectionManager } from '@/components/copilot/GeminiCopilotProvider';

const ConnectionStatusIndicator: React.FC = () => {
  const { isListening, voiceError, isPlaying, progress } = useGeminiConnectionManager();

  return (
    <div className="fixed bottom-4 right-4 p-2 bg-white shadow-lg rounded-lg">
      <p>Status: {isListening ? 'Listening' : 'Idle'}</p>
      {voiceError && <p className="text-red-500">Error: {voiceError}</p>}
      {isPlaying && <p>Playing audio... {progress}%</p>}
>>>>>>> origin/development
    </div>
  );
};

export default ConnectionStatusIndicator;
