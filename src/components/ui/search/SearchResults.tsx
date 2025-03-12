
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'blog' | 'service' | 'page' | 'faq';
  date?: string;
  image?: string;
  tags?: string[];
}

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading: boolean;
  className?: string;
  onResultClick?: (result: SearchResultItem) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  className,
  onResultClick
}) => {
  if (isLoading) {
    return (
      <div className={cn("w-full p-4 bg-background dark:bg-black border rounded-lg shadow-lg", className)}>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={cn("w-full p-6 bg-background dark:bg-black border rounded-lg shadow-lg text-center", className)}>
        <p className="text-muted-foreground">No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full bg-background dark:bg-black border rounded-lg shadow-lg", className)}>
      <ScrollArea className="h-[300px] md:h-[400px]">
        <div className="p-2">
          {results.map((result, i) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link 
                to={result.url}
                className="block p-3 rounded-md hover:bg-muted transition-colors"
                onClick={() => onResultClick?.(result)}
              >
                <div className="flex gap-3">
                  {result.image && (
                    <div className="shrink-0 h-14 w-14 rounded overflow-hidden bg-muted">
                      <img src={result.image} alt={result.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground truncate">{result.title}</h4>
                      <Badge variant="outline" className="ml-2 capitalize">
                        {result.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.description}
                    </p>
                    {result.tags && result.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {result.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {result.date && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
