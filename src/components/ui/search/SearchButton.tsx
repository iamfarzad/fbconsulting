
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
}

export const SearchButton = ({ onClick, className }: SearchButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn("rounded-full w-9 h-9", className)}
      aria-label="Search"
    >
      <Search className="h-4 w-4" />
    </Button>
  );
};

export default SearchButton;
