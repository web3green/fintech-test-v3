import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPostDialog } from '@/components/BlogPostDialog';
import { FeaturedArticle } from '@/components/blog/FeaturedArticle';
import { BlogSearchBar } from '@/components/blog/BlogSearchBar';
import { BlogPostsGrid } from '@/components/blog/BlogPostsGrid';
import { BlogNewsletter } from '@/components/blog/BlogNewsletter';
import { useBlogData } from '@/hooks/useBlogData';
import { getLocalizedContent, renderPostColor, getButtonStyle, getImageUrl } from '@/services/blogService';
import { BlogPost } from '@/services/databaseService';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Blog() {
  const { language } = useLanguage();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    loading,
    error,
    featuredPost,
    filteredPosts,
    currentPosts,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    categories
  } = useBlogData(language);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <Spinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 container mx-auto px-4 py-8">
           <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{language === 'en' ? 'Error' : 'Ошибка'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="container mx-auto px-8 md:px-12 lg:px-16">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                {language === 'en' ? 'Our Blog' : 'Наш Блог'}
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === 'en' 
                  ? 'Insights, guides, and updates on international business and finance' 
                  : 'Аналитика, руководства и обновления о международном бизнесе и финансах'}
              </p>
            </div>
          </div>
        </section>

        <BlogSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          language={language}
        />

        {featuredPost && searchQuery === '' && categoryFilter === 'all' && (
          <FeaturedArticle 
            post={featuredPost}
            language={language}
            getLocalizedContent={getLocalizedContent}
            getButtonStyle={getButtonStyle}
            handlePostClick={handlePostClick}
            getImageUrl={getImageUrl}
          />
        )}

        <BlogPostsGrid 
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          currentPosts={currentPosts}
          filteredPosts={filteredPosts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          getLocalizedContent={getLocalizedContent}
          handlePostClick={handlePostClick}
          renderPostColor={renderPostColor}
          getImageUrl={getImageUrl}
          language={language}
          setSearchQuery={setSearchQuery}
          setCategoryFilter={setCategoryFilter}
        />

        <BlogNewsletter language={language} />
      </main>
      <Footer />
      
      {selectedPost && (
         <BlogPostDialog 
            post={selectedPost}
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
          />
      )}
    </div>
  );
}
