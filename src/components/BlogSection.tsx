
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPostDialog } from './BlogPostDialog';
import { BlogCard } from './blog/BlogCard';
import { BlogFilters } from './blog/BlogFilters';
import { BlogPagination } from './blog/BlogPagination';
import { LoadMoreButton } from './blog/LoadMoreButton';
import { blogPosts } from '@/data/blogPosts';
import { getLocalizedContent, getImageUrl } from '@/utils/blogUtils';

interface BlogSectionProps {
  expandedView?: boolean;
}

export const BlogSection = ({ expandedView = false }: BlogSectionProps) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = expandedView ? 9 : 6;

  const filteredPosts = blogPosts.filter(post => {
    const titleMatch = getLocalizedContent(post.title, language).toLowerCase().includes(searchQuery.toLowerCase());
    const excerptMatch = getLocalizedContent(post.excerpt, language).toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = categoryFilter === 'all' || getLocalizedContent(post.category, language).toLowerCase() === categoryFilter.toLowerCase();
    return (titleMatch || excerptMatch) && categoryMatch;
  });

  const categories = ['all', ...new Set(blogPosts.map(post => getLocalizedContent(post.category, language).toLowerCase()))];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const handlePostClick = (post, e) => {
    e.stopPropagation();
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  return (
    <section id="blog" className={`py-20 bg-white dark:bg-gray-900 ${expandedView ? 'min-h-screen' : ''}`}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {language === 'en' ? 'Latest Insights & Resources' : 'Последние аналитические материалы'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Stay informed with our latest articles on international business, finance, and regulatory updates' 
              : 'Будьте в курсе последних статей о международном бизнесе, финансах и нормативных изменениях'}
          </p>
        </div>

        {expandedView && (
          <BlogFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
            language={language}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {(expandedView ? currentPosts : filteredPosts.slice(0, 6)).map(post => (
            <BlogCard
              key={post.id}
              post={post}
              colorScheme={post.colorScheme}
              language={language}
              onClick={handlePostClick}
              getLocalizedContent={(content) => getLocalizedContent(content, language)}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>

        {expandedView && filteredPosts.length > postsPerPage && (
          <BlogPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}

        {!expandedView && filteredPosts.length > 6 && (
          <LoadMoreButton
            isOpen={isOpen}
            language={language}
            additionalPosts={filteredPosts.slice(6)}
            getLocalizedContent={(content) => getLocalizedContent(content, language)}
            getImageUrl={getImageUrl}
            handlePostClick={handlePostClick}
          />
        )}
      </div>
      
      <BlogPostDialog 
        post={selectedPost}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </section>
  );
};
