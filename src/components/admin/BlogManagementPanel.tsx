import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, ImagePlus, X, UploadCloud } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from "@/contexts/LanguageContext";
import { Spinner } from '@/components/ui/spinner';
import { databaseService, BlogPost } from '@/services/databaseService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { blogService, getLocalizedContent, getImageUrl, renderPostColor } from '@/services/blogService';

export function BlogManagementPanel() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title_en: '',
    title_ru: '',
    content_en: '',
    content_ru: '',
    excerpt_en: '',
    excerpt_ru: '',
    image_url: '',
    author: '',
    category: '',
    reading_time: '',
    tags: [],
    featured: false,
    color_scheme: 'blue',
    published: false,
  });
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogService.getPosts(1, 999);
      if (response && Array.isArray(response.posts)) {
        setPosts(response.posts);
      } else {
        console.error("Invalid data structure received from getPosts:", response);
        setPosts([]);
        setError("Failed to load posts: Invalid data format.");
      }
    } catch (err: any) {
      console.error('Error loading posts:', err);
      setError('Failed to load posts: ' + err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const imageUrl = await databaseService.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setImagePreview(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title_en || !formData.title_ru) {
        toast.error('Title is required in both languages');
        return;
      }
      if (!formData.content_en || !formData.content_ru) {
        toast.error('Content is required in both languages');
        return;
      }
      if (!formData.excerpt_en || !formData.excerpt_ru) {
        toast.error('Excerpt is required in both languages');
        return;
      }
      if (!formData.author) {
        toast.error('Author is required');
        return;
      }
      if (!formData.category) {
        toast.error('Category is required');
        return;
      }
      if (!formData.reading_time) {
        toast.error('Reading time is required');
        return;
      }

      if (selectedPost) {
        await databaseService.updatePost(selectedPost.id, formData);
        toast.success('Post updated successfully');
      } else {
        await databaseService.createPost(formData as Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>);
        toast.success('Post created successfully');
      }
      setSelectedPost(null);
      setFormData({
        title_en: '',
        title_ru: '',
        content_en: '',
        content_ru: '',
        excerpt_en: '',
        excerpt_ru: '',
        image_url: '',
        author: '',
        category: '',
        reading_time: '',
        tags: [],
        featured: false,
        color_scheme: 'blue',
        published: false,
      });
      setImagePreview(null);
      loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await databaseService.deletePost(id);
      toast.success('Post deleted successfully');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleSeedPosts = async () => {
    if (!confirm('Are you sure you want to seed the initial 8 blog posts? This should only be done once.')) return;

    setIsSeeding(true);
    let successCount = 0;
    let errorCount = 0;

    const initialPostsToSeed = [
      { title_en: "Guide to Offshore Company Registration in 2025", title_ru: "Руководство по регистрации оффшорных компаний в 2025 году", excerpt_en: "Learn about the benefits, procedures, and considerations for registering an offshore company in today's global business environment.", excerpt_ru: "Узнайте о преимуществах, процедурах и особенностях регистрации оффшорной компании в современной глобальной бизнес-среде.", content_en: "[Placeholder content - please replace in admin panel]", content_ru: "[Замените этот текст в админ-панели]", image_url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop", author: "Alex Morgan", category: "Company Registration", reading_time: "8 min", tags: ["offshore", "company registration", "international business", "tax optimization"], featured: true, color_scheme: "blue", published: true },
      { title_en: "Banking Options for International Businesses", title_ru: "Банковские решения для международного бизнеса", excerpt_en: "Explore the best banking solutions for international businesses, from traditional banks to modern fintech platforms.", excerpt_ru: "Исследуйте лучшие банковские решения для международного бизнеса, от традиционных банков до современных финтех-платформ.", content_en: "[Placeholder content - please replace in admin panel]", content_ru: "[Замените этот текст в админ-панели]", image_url: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop", author: "Sarah Johnson", category: "Banking", reading_time: "6 min", tags: ["international banking", "business accounts", "fintech", "payment solutions"], featured: false, color_scheme: "orange", published: true },
      { title_en: "Understanding Nominee Services for Your Business", title_ru: "Понимание номинального сервиса для вашего бизнеса", excerpt_en: "A comprehensive guide to nominee services, including benefits, risks, and regulatory considerations.", excerpt_ru: "Комплексное руководство по номинальным услугам, включая преимущества, риски и нормативные соображения.", content_en: "[Placeholder content - please replace in admin panel]", content_ru: "[Замените этот текст в админ-панели]", image_url: "https://images.unsplash.com/photo-1542744094-24638eff58bb?ixlib=rb-4.0.3&auto=format&fit=crop", author: "Michael Chen", category: "Nominee Services", reading_time: "10 min", tags: ["nominee directors", "nominee shareholders", "business confidentiality", "legal representation"], featured: false, color_scheme: "graphite", published: true },
      { title_en: "The Complete Guide to Financial Licensing", title_ru: "Полное руководство по финансовому лицензированию", excerpt_en: "Everything you need to know about obtaining financial licenses in different jurisdictions around the world.", excerpt_ru: "Все, что вам нужно знать о получении финансовых лицензий в различных юрисдикциях по всему миру.", content_en: "[Placeholder content - please replace in admin panel]", content_ru: "[Замените этот текст в админ-панели]", image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85", author: "Emma Williams", category: "Licensing", reading_time: "12 min", tags: ["financial licenses", "EMI license", "regulatory compliance", "financial institutions"], featured: false, color_scheme: "blue", published: true },
      { title_en: "Tax Optimization Strategies for Global Businesses", title_ru: "Стратегии налоговой оптимизации для глобального бизнеса", excerpt_en: "Legal and effective strategies to optimize your tax structure when operating internationally.", excerpt_ru: "Законные и эффективные стратегии оптимизации налоговой структуры при ведении международного бизнеса.", content_en: "[Placeholder content - please replace in admin panel]", content_ru: "[Замените этот текст в админ-панели]", image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f", author: "David Brown", category: "Taxation", reading_time: "9 min", tags: ["tax optimization", "international taxation", "tax planning", "corporate structure"], featured: false, color_scheme: "orange", published: true },
      { title_en: "Emerging Fintech Trends in 2025", title_ru: "Новые тенденции финтеха в 2025 году", excerpt_en: "Explore the latest financial technology trends that are reshaping the global business landscape.", excerpt_ru: "Изучите последние тенденции финансовых технологий, которые меняют глобальный бизнес-ландшафт.", content_en: "[Placeholder content - please replace in admin panel]", content_ru: "[Замените этот текст в админ-панели]", image_url: "https://images.unsplash.com/photo-1618044733300-9472054094ee", author: "Jessica Lee", category: "Fintech", reading_time: "7 min", tags: ["fintech", "digital payments", "blockchain", "cryptocurrency"], featured: false, color_scheme: "graphite", published: true },
      { title_en: "Cryptocurrency Exchange Regulations Worldwide", title_ru: "Регулирование криптовалютных бирж по всему миру", excerpt_en: "A comprehensive overview of cryptocurrency exchange regulations across different jurisdictions.", excerpt_ru: "Комплексный обзор регулирования криптовалютных бирж в различных юрисдикциях.", content_en: "[Placeholder content - please replace in admin panel]", content_ru: "[Замените этот текст в админ-панели]", image_url: "https://images.unsplash.com/photo-1516245834210-c4c142787335", author: "Robert Zhang", category: "Crypto Licensing", reading_time: "11 min", tags: ["cryptocurrency", "crypto exchange", "regulations", "compliance", "bitcoin"], featured: false, color_scheme: "blue", published: true },
      { title_en: "Corporate Restructuring: When and How to Do It Right", title_ru: "Корпоративная реструктуризация: когда и как делать это правильно", excerpt_en: "Learn about the strategic approaches to corporate restructuring that maximize efficiency and minimize risks.", excerpt_ru: "Узнайте о стратегических подходах к корпоративной реструктуризации, которые максимизируют эффективность и минимизируют риски.", content_en: "[Placeholder content - please replace in admin panel]", content_ru: "[Замените этот текст в админ-панели]", image_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984", author: "Thomas Wilson", category: "Corporate Restructuring", reading_time: "10 min", tags: ["corporate restructuring", "business optimization", "reorganization", "mergers and acquisitions"], featured: false, color_scheme: "orange", published: true }
    ];

    for (const postData of initialPostsToSeed) {
      try {
        await databaseService.createPost(postData);
        successCount++;
      } catch (err) {
        console.error('Error seeding post:', postData.title_en, err);
        errorCount++;
      }
    }

    setIsSeeding(false);

    if (errorCount > 0) {
      toast.error(`Seeding finished with ${errorCount} errors and ${successCount} successes.`);
    } else {
      toast.success(`Successfully seeded ${successCount} initial posts.`);
      // Optionally disable button after success - requires additional state
    }
    loadPosts(); // Refresh the list
  };

  const handleCloseDialog = () => {
    console.log('handleCloseDialog called');
    setSelectedPost(null);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setSelectedPost(null);
    setFormData({
      title_en: '',
      title_ru: '',
      content_en: '',
      content_ru: '',
      excerpt_en: '',
      excerpt_ru: '',
      image_url: '',
      author: '',
      category: '',
      reading_time: '',
      tags: [],
      featured: false,
      color_scheme: 'blue',
      published: false,
    });
    setImagePreview(null);
    setIsCreatingNew(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button variant="outline" className="mt-4" onClick={loadPosts}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Blog Posts</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={handleSeedPosts}
              disabled={isSeeding || posts.length > 0}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              {isSeeding ? "Seeding..." : "Seed Initial Posts"}
            </Button>
            <Dialog open={!!selectedPost || isCreatingNew} onOpenChange={(isOpen) => {
              if (!isOpen) {
                handleCloseDialog();
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateNew}>Create New Post</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file);
                              }
                            }}
                            disabled={isUploading}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-fintech-blue file:text-white
                              hover:file:bg-fintech-blue-dark"
                          />
                        </div>
                        {imagePreview && (
                          <div className="relative mt-2">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setFormData(prev => ({ ...prev, image_url: '' }));
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Author</label>
                        <Input
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Input
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Reading Time</label>
                        <Input
                          value={formData.reading_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, reading_time: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                        />
                        <label className="text-sm font-medium">Featured</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.published}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                        />
                        <label className="text-sm font-medium">Published</label>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                        <Input
                          value={formData.tags?.join(', ')}
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map(tag => tag.trim());
                            setFormData(prev => ({ ...prev, tags }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Color Scheme</label>
                        <select
                          value={formData.color_scheme}
                          onChange={(e) => setFormData(prev => ({ ...prev, color_scheme: e.target.value as 'blue' | 'orange' | 'graphite' }))}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="blue">Blue</option>
                          <option value="orange">Orange</option>
                          <option value="graphite">Graphite</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ru">Russian</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                          value={formData.title_en}
                          onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Excerpt</label>
                        <Textarea
                          value={formData.excerpt_en}
                          onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <Textarea
                          value={formData.content_en}
                          onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                          className="min-h-[200px]"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="ru" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                          value={formData.title_ru}
                          onChange={(e) => setFormData(prev => ({ ...prev, title_ru: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Excerpt</label>
                        <Textarea
                          value={formData.excerpt_ru}
                          onChange={(e) => setFormData(prev => ({ ...prev, excerpt_ru: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <Textarea
                          value={formData.content_ru}
                          onChange={(e) => setFormData(prev => ({ ...prev, content_ru: e.target.value }))}
                          className="min-h-[200px]"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts found. Create your first post!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={getLocalizedContent(post, 'title', 'en')}
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{getLocalizedContent(post, 'title', 'en')}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{getLocalizedContent(post, 'category', 'en')}</TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const postToEdit = posts.find(p => p.id === post.id);
                            if (postToEdit) {
                              setSelectedPost(postToEdit);
                              setFormData(postToEdit);
                              setImagePreview(postToEdit.image_url);
                            } else {
                              console.error("Could not find post to edit:", post.id);
                            }
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 