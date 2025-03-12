
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { SearchDialog } from './SearchDialog';
import { cn } from '@/lib/utils';

interface SearchButtonProps extends Omit<ButtonProps, 'onClick'> {
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
  iconOnly?: boolean;
}

export const SearchButton: React.FC<SearchButtonProps> = ({
  className,
  buttonText = 'Search',
  showIcon = true,
  iconOnly = false,
  variant = 'outline',
  size = 'default',
  ...props
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsSearchOpen(true)}
        className={cn(
          iconOnly && "w-9 p-0",
          className
        )}
        {...props}
      >
        {showIcon && <Search className={cn("h-4 w-4", !iconOnly && "mr-2")} />}
        {!iconOnly && buttonText}
      </Button>
      
      <SearchDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
      />
    </>
  );
};
