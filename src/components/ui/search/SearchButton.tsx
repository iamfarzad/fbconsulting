
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SearchButtonProps {
  onClick?: () => void;
  iconOnly?: boolean;
  className?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
}

export const SearchButton = ({
  onClick,
  iconOnly = false,
  className,
  children,
  size = 'default'
}: SearchButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      className={cn("flex items-center gap-2", className)}
      type="button"
    >
      <Search className="h-4 w-4" />
      {!iconOnly && (children || "Search")}
    </Button>
  );
};

export default SearchButton;
