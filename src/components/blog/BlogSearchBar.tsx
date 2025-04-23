import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface BlogSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  categories: string[];
  language: string;
}

export const BlogSearchBar: React.FC<BlogSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  categories,
  language
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the input onChange
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="blog-article-search"
            name="blog-article-search"
            type="search"
            placeholder={language === 'en' ? "Search articles..." : "Поиск статей..."}
            className="pl-10 pr-4 py-2 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select 
            name="blog-category-filter"
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger 
              className="bg-background border-input"
              aria-label={language === 'en' ? 'Filter by category' : 'Фильтр по категории'}
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={language === 'en' ? 'Filter by Category' : 'Фильтр по категории'} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' 
                    ? (language === 'en' ? 'All Categories' : 'Все категории') 
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="hidden">Search</Button>
      </form>
    </div>
  );
};
