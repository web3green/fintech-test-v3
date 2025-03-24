
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

interface BlogSectionProps {
  expandedView?: boolean;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ expandedView = false }) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = expandedView ? 8 : 4;

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

  return (
    <section id="blog" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h2 className="text-3xl font-bold mb-4">{language === 'en' ? 'Our Blog' : 'Наш Блог'}</h2>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Stay up-to-date with the latest industry insights and company news from <span class="text-red-500">Fin</span><span class="text-fintech-blue">Tech</span><span class="text-fintech-orange">Assist</span>.' 
              : 'Будьте в курсе последних отраслевых идей и новостей компании <span class="text-red-500">Fin</span><span class="text-fintech-blue">Tech</span><span class="text-fintech-orange">Assist</span>.'}
          </p>
        </div>

        {expandedView && (
          <BlogSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
            language={language}
          />
        )}

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
            <p className="text-lg text-muted-foreground">
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
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {!expandedView && (
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <a href="/blog">
                {language === 'en' ? 'View All Posts' : 'Просмотреть все записи'}
              </a>
            </Button>
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
