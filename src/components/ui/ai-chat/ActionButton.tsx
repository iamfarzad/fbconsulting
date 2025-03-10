
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
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/20 dark:border-white/20 bg-white dark:bg-black hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      onClick={onClick}
    >
      <span className="text-black dark:text-white">{icon}</span>
      <span className="text-xs text-black dark:text-white">{label}</span>
    </Button>
  );
}
