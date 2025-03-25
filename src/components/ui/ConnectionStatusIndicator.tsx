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
    </div>
  );
};

export default ConnectionStatusIndicator;
