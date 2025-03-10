
import React from "react";
import { BarChart3, Code, MessageSquare, MonitorIcon, Workflow } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { trackEvent } from "@/services/analyticsService";

interface QuickActionsProps {
  onActionClick: (topic: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const handleActionClick = (topic: string) => {
    // Track the action click
    trackEvent({
      action: 'action_button_click',
      category: 'chatbot',
      label: topic,
      button_type: 'quick_action'
    });
    
    onActionClick(topic);
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
      <ActionButton
        icon={<MonitorIcon className="w-4 h-4 text-white" />}
        label="Chatbots"
        onClick={() => handleActionClick('Chatbots')}
      />
      <ActionButton
        icon={<Workflow className="w-4 h-4 text-white" />}
        label="Workflow Automation"
        onClick={() => handleActionClick('Workflow Automation')}
      />
      <ActionButton
        icon={<Code className="w-4 h-4 text-white" />}
        label="AI Strategy"
        onClick={() => handleActionClick('AI Strategy')}
      />
      <ActionButton
        icon={<MessageSquare className="w-4 h-4 text-white" />}
        label="Content Generation"
        onClick={() => handleActionClick('Content Generation')}
      />
      <ActionButton
        icon={<BarChart3 className="w-4 h-4 text-white" />}
        label="Data Analysis"
        onClick={() => handleActionClick('Data Analysis')}
      />
    </div>
  );
}
