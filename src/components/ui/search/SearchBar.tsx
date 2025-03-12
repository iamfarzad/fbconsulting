
import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'transparent';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  className,
  variant = 'default'
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const variantClasses = {
    default: 'border border-border bg-background rounded-lg w-full max-w-xs',
    minimal: 'border-none bg-transparent shadow-none',
    transparent: 'border border-white/20 bg-white/5 backdrop-blur-md text-white rounded-full w-full max-w-sm'
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        'relative group flex items-center transition-all duration-200',
        variantClasses[variant],
        isFocused && 'ring-1 ring-foreground/20',
        className
      )}
    >
      <div className="flex items-center flex-1">
        <Search 
          className={cn(
            "ml-3 size-4 shrink-0",
            variant === 'transparent' ? 'text-white/70' : 'text-muted-foreground'
          )} 
        />
        <Input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
            variant === 'transparent' && 'placeholder:text-white/50 text-white'
          )}
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className={cn(
              "h-7 w-7 p-0 mr-1",
              variant === 'transparent' && 'text-white/70 hover:text-white'
            )}
          >
            <X className="size-3" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
      <Button
        type="submit"
        variant={variant === 'transparent' ? 'outline' : 'default'}
        size="sm"
        className={cn(
          "rounded-r-md mr-1", 
          !value && "opacity-50 pointer-events-none",
          variant === 'transparent' && 'rounded-full border-white/30 text-white hover:bg-white/10'
        )}
        disabled={!value}
      >
        Search
      </Button>
    </form>
  );
};
