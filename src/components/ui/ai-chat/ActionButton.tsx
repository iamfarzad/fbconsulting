
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
      variant="outline" 
      size="sm"
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/30 dark:border-white/30 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}
