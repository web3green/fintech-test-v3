
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { blogPosts, getLocalizedContent } from '@/services/blogService';

export const useBlogData = (language: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for search query in URL
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    // Check for category in URL
    const categoryParam = params.get('category');
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    }
  }, [location.search]);

  // Update URL when search or category changes
  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    const params = new URLSearchParams(location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    
    navigate(`/blog?${params.toString()}`);
  };
  
  const updateCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
    
    const params = new URLSearchParams(location.search);
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    
    navigate(`/blog?${params.toString()}`);
  };

  const filteredPosts = blogPosts.filter(post => {
    const titleMatch = getLocalizedContent(post.title, language).toLowerCase().includes(searchQuery.toLowerCase());
    const excerptMatch = getLocalizedContent(post.excerpt, language).toLowerCase().includes(searchQuery.toLowerCase());
    const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const categoryMatch = categoryFilter === 'all' || getLocalizedContent(post.category, language).toLowerCase() === categoryFilter.toLowerCase();
    
    return (titleMatch || excerptMatch || tagMatch) && categoryMatch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => 
    getLocalizedContent(post.category, language).toLowerCase()
  )))];

  return {
    featuredPost,
    filteredPosts,
    currentPosts,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery: updateSearchQuery,
    categoryFilter,
    setCategoryFilter: updateCategoryFilter,
    categories
  };
};
