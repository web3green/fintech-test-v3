import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { blogService, getLocalizedContent, renderPostColor, getImageUrl, BlogPost, PaginatedBlogPosts } from '@/services/blogService';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { language } = useLanguage();
  
  // State for posts, loading, error, and total count
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Fetch posts based on current page, filters
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching page: ${currentPage}, limit: ${postsPerPage}, search: '${searchQuery}', category: '${categoryFilter}'`);
      const { posts: fetchedPosts, totalCount } = await blogService.getPosts(
        currentPage, 
        postsPerPage, 
        searchQuery || undefined,
        categoryFilter !== 'all' ? categoryFilter : undefined
      ); 
      console.log('Fetched posts:', fetchedPosts, 'Total count:', totalCount);
      setPosts(fetchedPosts);
      setTotalPostCount(totalCount);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(language === 'en' ? "Failed to load blog posts." : "Не удалось загрузить записи блога.");
      setPosts([]);
      setTotalPostCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, postsPerPage, searchQuery, categoryFilter, language]);

  // Fetch posts on mount and when dependencies change
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Memoize categories based on fetched posts (or could fetch categories separately)
  const categories = useMemo(() => {
    const fetchAllCategories = async () => {
      try {
        const { posts: allPostsForCategories } = await blogService.getPosts(1, 1000);
        const uniqueCategories = new Set(allPostsForCategories.map(post => post.category || 'uncategorized'));
        return ['all', ...Array.from(uniqueCategories)];
      } catch (catErr) {
        console.error("Error fetching all categories:", catErr);
        return ['all'];
      }
    };
    const uniqueCategories = new Set(posts.map(post => post.category || 'uncategorized'));
    return ['all', ...Array.from(uniqueCategories)];
  }, [posts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
       setCurrentPage(1); 
    } else {
      fetchPosts();
    }
  }, [searchQuery, categoryFilter]); 

  // Calculate total pages based on total count from server
  const totalPages = useMemo(() => {
    return Math.ceil(totalPostCount / postsPerPage);
  }, [totalPostCount, postsPerPage]);
  
  // Adjust current page if it becomes invalid after data load (e.g., last item deleted)
  useEffect(() => {
    if (totalPostCount > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, totalPostCount]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };
  
  // Prepare the description text with brand highlighting
  const blogDescription = language === 'en' 
    ? 'Stay up-to-date with the latest industry insights and company news from <span class="text-foreground dark:text-foreground">FinTechAssist</span>.' 
    : 'Будьте в курсе последних отраслевых идей и новостей компании <span class="text-foreground dark:text-foreground">FinTechAssist</span>.';

  // Render loading state
  if (loading) {
    return (
      <section id="blog" className="py-16 min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" />
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section id="blog" className="py-16">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{language === 'en' ? 'Error' : 'Ошибка'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  // Render content
  return (
    <section id="blog" className="py-16 bg-white dark:bg-background">
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

        {!loading && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                getLocalizedContent={getLocalizedContent}
                handlePostClick={handleOpenPost}
                renderPostColor={renderPostColor}
                getImageUrl={getImageUrl}
                language={language}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-12 mt-10">
              <p className="text-lg text-muted-foreground dark:text-muted-foreground/80">
                {language === 'en' 
                  ? 'No blog posts found matching your criteria.' 
                  : 'Не найдено записей блога, соответствующих вашим критериям.'}
              </p>
            </div>
          )
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} hover:bg-fintech-orange/20 hover:bg-gradient-to-r from-blue-900/40 to-blue-800/30`}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                      className={`${currentPage === index + 1 ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/30 text-fintech-orange/90 border border-white/5' : 'hover:bg-gradient-to-r hover:from-blue-900/40 hover:to-blue-800/30'} cursor-pointer`}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
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
