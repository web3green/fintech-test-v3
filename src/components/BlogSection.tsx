import React, { useState, useEffect, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { BlogPostCard } from './blog/BlogPostCard';
import { BlogPostDialog } from './BlogPostDialog';
import { BlogSearchBar } from './blog/BlogSearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogService, getLocalizedContent, renderPostColor, getImageUrl, BlogPost, PaginatedBlogPosts } from '@/services/blogService';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { BlogPostCardSkeleton } from './blog/BlogPostCardSkeleton';
import { cn } from '@/lib/utils';

// Define the fetcher function for SWR
const blogPostsFetcher = async ([key, page, limit, query, category]: [
  string, // Key prefix, e.g., 'blogPosts'
  number, 
  number, 
  string | undefined, 
  string | undefined
]): Promise<PaginatedBlogPosts> => { 
  console.log(`[BlogSectionFetcher] Fetching: key=${key}, page=${page}, limit=${limit}, query=${query}, category=${category}`); // <-- Log fetcher start
  try {
    const result = await blogService.getPosts(page, limit, query, category);
    console.log(`[BlogSectionFetcher] Fetched ${result?.posts?.length ?? 0} posts, total: ${result?.totalCount ?? 0}`); // <-- Log fetcher success
    return result;
  } catch (error) {
    console.error('[BlogSectionFetcher] Error fetching posts:', error); // <-- Log fetcher error
    throw error;
  }
};

export const BlogSection: React.FC = () => {
  console.log('[BlogSection] Mounting or re-rendering...'); // <-- Log component mount/render
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null); // <-- Создаем ref

  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  // Construct the key for useSWR based on dependencies
  const swrKey = [
    'blogPosts', 
    currentPage, 
    postsPerPage, 
    searchQuery || undefined, 
    categoryFilter !== 'all' ? categoryFilter : undefined
  ];
  console.log('[BlogSection] SWR Key:', swrKey); // <-- Log SWR key

  // Use SWR to fetch data, keep previous data while loading new page
  const { data: paginatedData, error: swrError, isLoading: swrLoading } = useSWR<PaginatedBlogPosts, Error>(
      swrKey, 
      blogPostsFetcher,
      {
        // Keep showing the previous page's data while loading the new one
        // keepPreviousData: true,
        // We can keep these false as well, shouldn't hurt
        revalidateOnFocus: false,
        revalidateOnReconnect: false, 
      }
  );

  console.log('[BlogSection] SWR State: isLoading=', swrLoading, 'error=', swrError, 'dataExists=', !!paginatedData); // <-- Log SWR state

  // Extract posts and total count from SWR data
  const posts = useMemo(() => paginatedData?.posts ?? [], [paginatedData]);
  const totalPostCount = useMemo(() => paginatedData?.totalCount ?? 0, [paginatedData]);
  
  // Map SWR error to our component's error state format (optional)
  const error = swrError ? (language === 'en' ? "Failed to load blog posts." : "Не удалось загрузить записи блога.") : null;
  const isLoading = swrLoading;

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
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]); 

  // Calculate total pages based on total count from server
  const totalPages = useMemo(() => {
    return Math.ceil(totalPostCount / postsPerPage);
  }, [totalPostCount, postsPerPage]);
  
  // Adjust current page if it becomes invalid after data load
  useEffect(() => {
    if (totalPostCount > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, totalPostCount]);

  // ВОССТАНАВЛИВАЕМ ПРОСТУЮ ФУНКЦИЮ
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber); // <-- ТОЛЬКО СМЕНА СОСТОЯНИЯ
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

  // Initial loading state (ONLY for the very first load)
  if (!paginatedData && isLoading && !error) { 
    return (
      <section id="blog" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-10 text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue-dark dark:text-fintech-blue-light mb-4">
              <span className="flex h-2 w-2 rounded-full bg-fintech-orange/80 mr-2"></span>
              <span>{language === 'en' ? 'Latest Updates' : 'Последние обновления'}</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{language === 'en' ? 'Our Blog' : 'Наш Блог'}</h2>
            <p 
              className="text-muted-foreground dark:text-muted-foreground/90"
              dangerouslySetInnerHTML={{ __html: blogDescription }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 min-h-[300px]">
            {Array.from({ length: postsPerPage }).map((_, index) => (
              <BlogPostCardSkeleton key={`initial-skel-${index}`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !paginatedData) { // Show error only if there's no data at all
    console.error('[BlogSection] Rendering Error State:', swrError); // <-- Log rendering error state
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

  // Render content - SWR with keepPreviousData handles showing old data while loading
  return (
    <section id="blog" ref={sectionRef} className="py-16 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue-dark dark:text-fintech-blue-light mb-4">
            <span className="flex h-2 w-2 rounded-full bg-fintech-orange/80 mr-2"></span>
            <span>{language === 'en' ? 'Latest Updates' : 'Последние обновления'}</span>
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

        {/* Posts Grid - Задаем ФИКСИРОВАННУЮ ВЫСОТУ, 2 ряда и выравнивание по верху */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-6 mt-10 h-[800px] overflow-hidden items-start"> {/* ЗАМЕНИТЕ h-[800px]! ДОБАВЛЕНО lg:grid-rows-2 */} 
          
          {/* Рендерим скелетоны во время загрузки */} 
          {isLoading && (
            Array.from({ length: postsPerPage }).map((_, index) => (
              <BlogPostCardSkeleton key={`loading-skel-${index}`} />
            ))
          )}

          {/* Рендерим посты, если загрузка НЕ идет И посты есть */} 
          {!isLoading && posts && posts.length > 0 && (
            posts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                getLocalizedContent={getLocalizedContent}
                handlePostClick={handleOpenPost}
                renderPostColor={renderPostColor}
                getImageUrl={getImageUrl}
                language={language}
              />
            ))
          )}
          
          {/* Рендерим "No posts", если загрузка НЕ идет И постов нет */} 
          {!isLoading && (!posts || posts.length === 0) && (
              <div className="col-span-full text-center py-12 mt-10">
                <p className="text-lg text-muted-foreground dark:text-muted-foreground/80">
                  {language === 'en' 
                    ? 'No blog posts found matching your criteria.' 
                    : 'Не найдено записей блога, соответствующих вашим критериям.'}
                </p>
              </div>
            )
          }
        </div>

        {/* НОВАЯ ПРОСТАЯ ПАГИНАЦИЯ */} 
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {/* Кнопка Previous */} 
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                "px-3 py-1 border rounded-md text-sm",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:bg-accent dark:hover:bg-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              )}
            >
              &lt; {language === 'en' ? 'Previous' : 'Назад'}
            </button>

            {/* Номера страниц */} 
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={currentPage === pageNumber}
                  className={cn(
                    "px-3 py-1 border rounded-md text-sm",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    currentPage === pageNumber ? "bg-primary text-primary-foreground dark:bg-fintech-blue-dark dark:text-fintech-blue-light" : "hover:bg-accent dark:hover:bg-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  )}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Кнопка Next */} 
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                "px-3 py-1 border rounded-md text-sm",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:bg-accent dark:hover:bg-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              )}
            >
              {language === 'en' ? 'Next' : 'Вперед'} &gt;
            </button>
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
