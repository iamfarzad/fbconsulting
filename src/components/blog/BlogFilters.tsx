
import React from 'react';
import { FilterDropdown } from '@/components/ui/filter/FilterDropdown';
import { 
  CalendarRange, 
  Clock, 
  TrendingUp, 
  Filter, 
  X,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogFilters as BlogFiltersType, BlogSortOptions } from '@/services/blog/types';
import { getBlogCategories } from '@/services/blog';

interface BlogFiltersProps {
  filters: BlogFiltersType;
  onFilterChange: (filters: BlogFiltersType) => void;
  totalCount: number;
  filteredCount: number;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  filters,
  onFilterChange,
  totalCount,
  filteredCount
}) => {
  const categories = ['all', ...getBlogCategories()];
  
  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };
  
  const handleSortFieldChange = (field: 'date' | 'popularity') => {
    onFilterChange({ ...filters, sortField: field });
  };
  
  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    onFilterChange({ ...filters, sortOrder: order });
  };
  
  const handleClearFilters = () => {
    onFilterChange({
      category: 'all',
      searchTerm: '',
      sortField: 'date',
      sortOrder: 'desc'
    });
  };
  
  const hasActiveFilters = () => {
    return (
      filters.category !== 'all' || 
      (filters.searchTerm && filters.searchTerm.length > 0) || 
      filters.sortField !== 'date' || 
      filters.sortOrder !== 'desc'
    );
  };
  
  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex flex-wrap items-center gap-2">
        {/* Category filter */}
        <FilterDropdown 
          label="Category"
          options={categories.map(cat => ({
            value: cat,
            label: cat === 'all' ? 'All Categories' : cat
          }))}
          value={filters.category || 'all'}
          onChange={handleCategoryChange}
        />
        
        {/* Sort field filter */}
        <FilterDropdown
          label="Sort By"
          options={[
            { value: 'date', label: 'Date', icon: <CalendarRange className="h-4 w-4" /> },
            { value: 'popularity', label: 'Popularity', icon: <TrendingUp className="h-4 w-4" /> }
          ]}
          value={filters.sortField || 'date'}
          onChange={handleSortFieldChange as (value: string) => void}
        />
        
        {/* Sort order filter */}
        <FilterDropdown
          label="Order"
          options={[
            { value: 'desc', label: 'Descending', icon: <SortDesc className="h-4 w-4" /> },
            { value: 'asc', label: 'Ascending', icon: <SortAsc className="h-4 w-4" /> }
          ]}
          value={filters.sortOrder || 'desc'}
          onChange={handleSortOrderChange as (value: string) => void}
        />
        
        {/* Clear filters button - only show if filters are applied */}
        {hasActiveFilters() && (
          <Button 
            variant="ghost" 
            onClick={handleClearFilters} 
            size="sm"
            className="ml-2 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Filter summary/stats */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} articles
        {filters.category !== 'all' && <span> in <span className="font-medium">{filters.category}</span></span>}
        {filters.searchTerm && <span> matching "<span className="font-medium">{filters.searchTerm}</span>"</span>}
      </div>
    </div>
  );
};
