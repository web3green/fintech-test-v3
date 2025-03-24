
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlogPostDialog } from '@/components/BlogPostDialog';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { FeaturedArticle } from '@/components/blog/FeaturedArticle';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { NewsletterSection } from '@/components/blog/NewsletterSection';
import { blogPosts } from '@/data/blogPosts';
import { getLocalizedContent, getImageUrl } from '@/utils/blogUtils';

export default function Blog() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPosts = blogPosts.filter(post => 
    getLocalizedContent(post.title, language).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getLocalizedContent(post.category, language).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getLocalizedContent(post.excerpt, language).toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <BlogHeader language={language} />
        <BlogSearch 
          language={language} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {featuredPost && searchQuery === '' && (
          <section className="py-12">
            <div className="container mx-auto px-8 md:px-12 lg:px-16">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-8">
                  {language === 'en' ? 'Featured Article' : 'Рекомендуемая Статья'}
                </h2>
                <FeaturedArticle 
                  post={featuredPost}
                  language={language}
                  getLocalizedContent={(content) => getLocalizedContent(content, language)}
                  getImageUrl={getImageUrl}
                  handlePostClick={handlePostClick}
                />
              </div>
            </div>
          </section>
        )}

        <BlogGrid 
          posts={searchQuery === '' ? regularPosts : filteredPosts}
          language={language}
          searchQuery={searchQuery}
          getLocalizedContent={(content) => getLocalizedContent(content, language)}
          getImageUrl={getImageUrl}
          handlePostClick={handlePostClick}
        />

        <NewsletterSection language={language} />
      </main>
      <Footer />
      
      <BlogPostDialog 
        post={selectedPost}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
