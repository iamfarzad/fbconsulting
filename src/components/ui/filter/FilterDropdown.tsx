
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FilterButton } from './FilterButton';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterDropdownProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
  triggerClassName?: string;
  align?: 'start' | 'center' | 'end';
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  className,
  triggerClassName,
  align = 'end'
}) => {
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FilterButton
          className={triggerClassName}
          buttonText={selectedOption?.label || label}
          isActive={!!selectedOption && selectedOption.value !== options[0].value}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn("min-w-[180px]", className)}>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              value === option.value && "bg-muted"
            )}
            onClick={() => onChange(option.value)}
          >
            {option.icon}
            <span>{option.label}</span>
            {value === option.value && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
