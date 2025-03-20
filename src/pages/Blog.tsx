
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Blog() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample blog posts data
  const posts = [
    {
      id: 1,
      title: 'Guide to Offshore Company Registration in 2023',
      excerpt: 'Learn about the benefits, procedures, and considerations for registering an offshore company in today\'s global business environment.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
      author: 'Alex Morgan',
      date: 'June 15, 2023',
      category: 'Company Registration',
      featured: true
    },
    {
      id: 2,
      title: 'Banking Options for International Businesses',
      excerpt: 'Explore the best banking solutions for international businesses, from traditional banks to modern fintech platforms.',
      image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc',
      author: 'Sarah Johnson',
      date: 'July 22, 2023',
      category: 'Banking'
    },
    {
      id: 3,
      title: 'Understanding Nominee Services for Your Business',
      excerpt: 'A comprehensive guide to nominee services, including benefits, risks, and regulatory considerations.',
      image: 'https://images.unsplash.com/photo-1664575599736-c5197c684172',
      author: 'Michael Chen',
      date: 'August 10, 2023',
      category: 'Nominee Services'
    },
    {
      id: 4,
      title: 'The Complete Guide to Financial Licensing',
      excerpt: 'Everything you need to know about obtaining financial licenses in different jurisdictions around the world.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
      author: 'Emma Williams',
      date: 'September 5, 2023',
      category: 'Licensing'
    },
    {
      id: 5,
      title: 'Tax Optimization Strategies for Global Businesses',
      excerpt: 'Legal and effective strategies to optimize your tax structure when operating internationally.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
      author: 'David Brown',
      date: 'October 12, 2023',
      category: 'Taxation'
    },
    {
      id: 6,
      title: 'Emerging Fintech Trends in 2023',
      excerpt: 'Explore the latest financial technology trends that are reshaping the global business landscape.',
      image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee',
      author: 'Jessica Lee',
      date: 'November 18, 2023',
      category: 'Fintech'
    }
  ];

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get featured post
  const featuredPost = posts.find(post => post.featured);
  // Get regular posts (excluding the featured one)
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Our Blog
              </h1>
              <p className="text-xl text-muted-foreground">
                Insights, guides, and updates on international business and finance
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && searchQuery === '' && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-display font-bold mb-8">Featured Article</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0">
                        <GlowingEffect 
                          blur={2} 
                          spread={30} 
                          glow={true} 
                          disabled={false} 
                          inactiveZone={0.4}
                          proximity={60}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
                      {featuredPost.category}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center mb-6 text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      <span className="mr-4">{featuredPost.author}</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <Button className="bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow">
                      Read Article <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-8">
                {searchQuery ? 'Search Results' : 'Latest Articles'}
              </h2>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground mb-4">No articles found for "{searchQuery}"</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(searchQuery === '' ? regularPosts : filteredPosts).map(post => (
                    <div 
                      key={post.id} 
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover-scale"
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-fintech-blue/10 text-fintech-blue dark:bg-fintech-blue/20 dark:text-fintech-blue-light mb-4">
                          {post.category}
                        </div>
                        <h3 className="text-xl font-display font-bold mb-3">{post.title}</h3>
                        <p className="text-muted-foreground mb-6 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{post.date}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-fintech-blue dark:text-fintech-blue-light">
                            Read More
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-fintech-blue/5 dark:bg-fintech-blue/10"></div>
                <GlowingEffect 
                  blur={10} 
                  spread={40} 
                  glow={true} 
                  disabled={false} 
                  inactiveZone={0.2}
                  proximity={100}
                />
              </div>
              <div className="relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                  Stay Updated
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Subscribe to our newsletter to receive the latest insights and updates on international business and finance.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full sm:w-64"
                  />
                  <Button className="bg-fintech-blue hover:bg-fintech-blue-dark text-white button-glow w-full sm:w-auto">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
