
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BlogSearchProps {
  language: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const BlogSearch = ({ language, searchQuery, setSearchQuery }: BlogSearchProps) => {
  return (
    <section className="py-12 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder={language === 'en' ? "Search articles..." : "Поиск статей..."}
              className="pl-10 pr-4 py-2 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
