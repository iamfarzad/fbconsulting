
import React from 'react';
import { Filter } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterButtonProps extends Omit<ButtonProps, 'onClick'> {
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
  iconOnly?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  className,
  buttonText = 'Filter',
  showIcon = true,
  iconOnly = false,
  isActive = false,
  variant = 'outline',
  size = 'default',
  onClick,
  ...props
}) => {
  return (
    <Button
      variant={isActive ? 'default' : variant}
      size={size}
      onClick={onClick}
      className={cn(
        iconOnly && "w-9 p-0",
        isActive && "bg-black text-white dark:bg-white dark:text-black",
        className
      )}
      {...props}
    >
      {showIcon && <Filter className={cn("h-4 w-4", !iconOnly && "mr-2")} />}
      {!iconOnly && buttonText}
    </Button>
  );
};
