import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BlogPostCard } from './blog/BlogPostCard';
import { BlogPostDialog } from './BlogPostDialog';
import { BlogSearchBar } from './blog/BlogSearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { blogPosts, getLocalizedContent, renderPostColor, getImageUrl } from '@/services/blogService';

export const BlogSection: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => 
    getLocalizedContent(post.category, language).toLowerCase()
  )))];

  // Filter posts based on search query and category
  const filteredPosts = blogPosts.filter(post => {
    const title = getLocalizedContent(post.title, language).toLowerCase();
    const excerpt = getLocalizedContent(post.excerpt, language).toLowerCase();
    const category = getLocalizedContent(post.category, language).toLowerCase();
    const searchTerms = searchQuery.toLowerCase();
    
    const matchesSearch = title.includes(searchTerms) || excerpt.includes(searchTerms);
    const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPost = (post) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  // Function to get localized content specifically for this component
  const getLocalizedPostContent = (content) => {
    return getLocalizedContent(content, language);
  };

  // Prepare the description text with brand highlighting
  const blogDescription = language === 'en' 
    ? 'Stay up-to-date with the latest industry insights and company news from <span class="text-foreground dark:text-foreground">FinTechAssist</span>.' 
    : 'Будьте в курсе последних отраслевых идей и новостей компании <span class="text-foreground dark:text-foreground">FinTechAssist</span>.';

  return (
    <section id="blog" className="py-16 bg-white dark:bg-gradient-to-b dark:from-blue-950/40 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-900/40 to-blue-800/30 backdrop-blur-sm border border-white/5">
            <span className="flex h-2 w-2 rounded-full bg-fintech-orange/80 mr-2"></span>
            <span className="text-fintech-orange/90">{language === 'en' ? 'Latest Updates' : 'Последние обновления'}</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">{language === 'en' ? 'Our Blog' : 'Наш Блог'}</h2>
          <p 
            className="text-muted-foreground dark:text-muted-foreground/90"
            dangerouslySetInnerHTML={{ __html: blogDescription }}
          />
        </div>

        <BlogSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          language={language}
        />

        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                getLocalizedContent={getLocalizedPostContent}
                handlePostClick={handleOpenPost}
                renderPostColor={renderPostColor}
                getImageUrl={getImageUrl}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground dark:text-muted-foreground/80">
              {language === 'en' 
                ? 'No blog posts found matching your criteria.' 
                : 'Не найдено записей блога, соответствующих вашим критериям.'}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} hover:bg-fintech-orange/20 hover:bg-gradient-to-r from-blue-900/40 to-blue-800/30`}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                      className={`${currentPage === index + 1 ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/30 text-fintech-orange/90 border border-white/5' : 'hover:bg-gradient-to-r hover:from-blue-900/40 hover:to-blue-800/30'}`}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} hover:bg-fintech-orange/20 hover:bg-gradient-to-r from-blue-900/40 to-blue-800/30`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {selectedPost && (
          <BlogPostDialog
            post={selectedPost}
            isOpen={true}
            onClose={handleClosePost}
          />
        )}
      </div>
    </section>
  );
};
