
import React from "react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-teal/30 text-teal hover:text-teal transition-colors"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
