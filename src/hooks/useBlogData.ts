import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { blogService, getLocalizedContent, BlogPost } from '@/services/blogService';

export const useBlogData = (language: string) => {
  // State for all posts, loading, error
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Adjust as needed
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- Data Fetching ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getPosts(); // Fetch from service
        setAllPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(language === 'en' ? "Failed to load blog posts." : "Не удалось загрузить записи блога.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []); // Fetch only once on mount

  // --- URL Params Handling ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    // Update state from URL, but don't trigger navigation again
    setSearchQuery(searchParam || ''); 
    setCategoryFilter(categoryParam || 'all');
  }, [location.search]);

  // --- Filter/Search Update Functions (with URL update) ---
  const updateSearchQuery = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset page on new search
    const params = new URLSearchParams(location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  
  const updateCategoryFilter = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1); // Reset page on new category
    const params = new URLSearchParams(location.search);
    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // --- Memoized Calculations ---
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allPosts.map(post => post.category || 'uncategorized'));
    return ['all', ...Array.from(uniqueCategories)];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      // Use updated getLocalizedContent
      const titleMatch = getLocalizedContent(post, 'title', language).toLowerCase().includes(searchQuery.toLowerCase());
      const excerptMatch = getLocalizedContent(post, 'excerpt', language).toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || false;
      const categoryMatch = categoryFilter === 'all' || (post.category?.toLowerCase() || '') === categoryFilter.toLowerCase();
      
      return (titleMatch || excerptMatch || tagMatch) && categoryMatch;
    });
  }, [allPosts, searchQuery, categoryFilter, language]);

  const featuredPost = useMemo(() => {
    return allPosts.find(post => post.featured);
  }, [allPosts]);
  
  const totalPages = useMemo(() => {
      return Math.ceil(filteredPosts.length / postsPerPage);
  }, [filteredPosts, postsPerPage]);

  const currentPosts = useMemo(() => {
      const indexOfLastPost = currentPage * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  }, [filteredPosts, currentPage, postsPerPage]);

  // --- Reset page if needed ---
   useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1 && totalPages > 0) {
        // Handle cases where filters result in 0 pages? Set to 1?
        setCurrentPage(1);
    } 
  }, [currentPage, totalPages]);

  // --- Return values ---
  return {
    loading, // Expose loading state
    error,   // Expose error state
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
