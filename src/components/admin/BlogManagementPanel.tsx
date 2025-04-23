import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
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
import { blogService, getLocalizedContent, getImageUrl, renderPostColor, getDistinctCategories } from '@/services/blogService';
import Cropper, { Area } from 'react-easy-crop';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import getCroppedImg from '@/utils/cropImage';
import type { BlogPost as BlogPostType } from '@/services/databaseService';

// --- Helper function to convert Blob to Data URL ---
const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert Blob to Data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

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
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryInputValue, setNewCategoryInputValue] = useState("");

  // --- New state for Cropper ---
  const [imageSrcForCropper, setImageSrcForCropper] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  // --- End Cropper state ---

  useEffect(() => {
    loadPosts();
    loadCategories();
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

  const loadCategories = async () => {
    console.log('[loadCategories] Fetching categories...');
    try {
      const fetchedCategories = await getDistinctCategories();
      setCategories(fetchedCategories);
      console.log('[loadCategories] Categories loaded:', fetchedCategories);
    } catch (err) {
      console.error('[loadCategories] Error loading categories:', err);
      // Optionally show a toast error
      // toast.error('Failed to load categories');
    }
  };

  // Modified image selection handler
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // Basic type check
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrcForCropper(reader.result?.toString() || null);
        setSelectedFile(file); // Store the original file
        setCroppedAreaPixels(null); // Reset crop area when new image is selected
        setZoom(1); // Reset zoom
        setCrop({ x: 0, y: 0 }); // Reset crop position
        setIsCropperOpen(true); // Open the cropper dialog immediately
      });
      reader.readAsDataURL(file);
      // Clear the input value to allow selecting the same file again
      event.target.value = '';
    }
  };
  
  // Callback for react-easy-crop
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    console.log('[onCropComplete] Saving cropped area pixels:', croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // handleImageUpload now only uploads, doesn't handle file selection or preview
  const handleImageUpload = async (fileToUpload: File): Promise<string | null> => {
    setIsUploading(true); // Keep this for the upload itself
    console.log(`[handleImageUpload] Uploading processed file: ${fileToUpload.name}, size: ${fileToUpload.size}`);
    try {
      const imageUrl = await databaseService.uploadImage(fileToUpload);
      console.log(`[handleImageUpload] Upload successful. URL: ${imageUrl}`);
      // No toast here, will be shown after successful save
      return imageUrl;
    } catch (error: any) {
      console.error('Detailed Upload Error (Panel):', error);
      console.error('Upload Error Message (Panel):', error.message);
      console.error('Upload Error Status (Panel):', error.status);
      // Throw the error so handleSubmit can catch it
      throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Modified handleSubmit to include cropping logic
  const handleSubmit = async () => {
    // Existing validations...
      if (!formData.title_en || !formData.title_ru) {
        toast.error('Title is required in both languages.');
        return;
      }
      if (!formData.content_en || !formData.content_ru) {
        toast.error('Content is required in both languages.');
        return;
      }
    // Add other necessary validations

    let finalImageUrl = formData.image_url; // Start with existing or null if creating new
    setIsProcessingImage(true); // Show loading state

    try {
       // Check if a new file was selected and crop area is defined
       if (selectedFile && croppedAreaPixels && imageSrcForCropper) {
          console.log('[handleSubmit] Cropping selected image...');

          const croppedBlob = await getCroppedImg(imageSrcForCropper, croppedAreaPixels);

          if (!croppedBlob) {
            throw new Error('Failed to crop image');
          }

          // Create a File object from the Blob
          // Use a generic name or derive from original, ensure correct type
          const fileName = `cropped-${Date.now()}-${selectedFile.name}`;
          const croppedFile = new File([croppedBlob], fileName, { type: croppedBlob.type || selectedFile.type });

          console.log('[handleSubmit] Uploading cropped image...');
          const uploadedUrl = await handleImageUpload(croppedFile);

          if (!uploadedUrl) {
              throw new Error('Failed to upload cropped image');
          }
          finalImageUrl = uploadedUrl; // Use the URL of the cropped image
          console.log(`[handleSubmit] Using new cropped image URL: ${finalImageUrl}`);
       } else if (selectedFile && !croppedAreaPixels) {
           // Case: User selected a file but didn't crop (or closed cropper before completion)
           // Decide how to handle this - maybe upload original? For now, throw error.
           // Alternatively, you could automatically upload the original file here.
           console.warn('[handleSubmit] File selected but no crop area defined. Image not processed.');
           // toast.info('Image selected but not cropped. Uploading original file.');
           // const originalUrl = await handleImageUpload(selectedFile);
           // if (!originalUrl) throw new Error('Failed to upload original image');
           // finalImageUrl = originalUrl;
           throw new Error('Image was selected but not cropped. Please crop the image or clear the selection.');
       } else {
           console.log(`[handleSubmit] No new image selected or processed. Using existing URL: ${finalImageUrl}`);
       }

      console.log('[handleSubmit] Preparing to save post data...');
      // Construct dataToSave *after* potential image upload
      const dataToSave: Partial<BlogPost> = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : (formData.tags as string || '').split(',').map(tag => tag.trim()).filter(Boolean), // Ensure tags is array
        reading_time: String(formData.reading_time || '0'), // Convert to string, defaulting to '0' if empty/null
        image_url: finalImageUrl // Ensure the final URL is included
      };

      // Remove undefined/null keys to avoid issues with Supabase update/insert
       Object.keys(dataToSave).forEach(key => {
           if (dataToSave[key as keyof BlogPost] === undefined || dataToSave[key as keyof BlogPost] === null) {
               delete dataToSave[key as keyof BlogPost];
           }
       });

      if (selectedPost) {
        console.log(`[handleSubmit] Updating post ID: ${selectedPost.id}`);
        console.log(`[handleSubmit] Final data for update:`, dataToSave);
        await databaseService.updatePost(selectedPost.id, dataToSave);
        toast.success('Post updated successfully');
      } else {
        console.log('[handleSubmit] Creating new post');
        // Ensure all required fields for creation are present, provide defaults if needed
        const rawData = { // Renamed to rawData to handle color_scheme validation separately
        title_en: '',
        title_ru: '',
        content_en: '',
        content_ru: '',
        excerpt_en: '',
        excerpt_ru: '',
        author: '',
        category: '',
            reading_time: '0', // Default reading_time as string '0' - matches the fix above
        tags: [],
        featured: false,
            color_scheme: 'blue', // Default color scheme
        published: false,
            ...dataToSave // Overwrite defaults with formData
        };

        // Ensure color_scheme is one of the allowed enum values
        const validColorSchemes = ['blue', 'orange', 'graphite'] as const;
        type ValidColorScheme = typeof validColorSchemes[number];

        // Explicitly type dataToCreate and validate color_scheme
        const dataToCreate: Omit<BlogPostType, 'id' | 'created_at' | 'updated_at'> = {
          ...rawData,
          // Validate and set color_scheme
          color_scheme: validColorSchemes.includes(rawData.color_scheme as any)
                          ? rawData.color_scheme as ValidColorScheme
                          : 'blue' // Fallback to default 'blue' if invalid
        };

        // Final check for required fields before creating
        if (!dataToCreate.title_en || !dataToCreate.title_ru || !dataToCreate.content_en || !dataToCreate.content_ru) {
            throw new Error("Missing required fields (title, content) for creating a new post.");
        }

        console.log('[handleSubmit] Final data for create:', dataToCreate);
        await databaseService.createPost(dataToCreate);
        toast.success('Post created successfully');
      }

      console.log('[handleSubmit] Save successful. Resetting state...');

      // Reset state after successful save
      handleCloseDialog(); // Closes the main post form dialog
      // Reset image/crop specific state outside dialog closure
      setSelectedFile(null);
      setImageSrcForCropper(null);
      setCroppedAreaPixels(null);
      setImagePreview(null); // Clear preview if necessary
      loadPosts(); // Reload posts list
    } catch (error: any) { // Catch errors from cropping, upload, or save
      console.error('Error saving post:', error);
      toast.error(`Failed to save post: ${error.message || 'Unknown error'}`);
    } finally {
       setIsProcessingImage(false); // Hide loading state
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

    // Explicitly type the array to match the expected input type of createPost
    const initialPostsToSeed: Omit<BlogPostType, 'id' | 'created_at' | 'updated_at'>[] = [
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

  // Modified handleCropperClose to generate and show cropped preview
  const handleCropperClose = async () => {
    setIsCropperOpen(false);
    console.log('[handleCropperClose] Cropper closed. Attempting to generate preview...');
    if (imageSrcForCropper && croppedAreaPixels) {
      try {
        console.log('[handleCropperClose] Calling getCroppedImg with:', imageSrcForCropper.substring(0, 50) + '...', croppedAreaPixels);
        const croppedBlob = await getCroppedImg(imageSrcForCropper, croppedAreaPixels);
        if (croppedBlob) {
          console.log('[handleCropperClose] Cropped blob generated, converting to Data URL...');
          const croppedDataUrl = await blobToDataURL(croppedBlob);
          console.log('[handleCropperClose] Setting imagePreview to cropped Data URL:', croppedDataUrl.substring(0, 50) + '...');
          setImagePreview(croppedDataUrl); // Show the cropped image preview
        } else {
          console.warn('[handleCropperClose] getCroppedImg returned null. Falling back to original preview.');
          setImagePreview(imageSrcForCropper); // Fallback to original if cropping fails
        }
      } catch (error) {
        console.error('[handleCropperClose] Error generating cropped preview:', error);
        toast.error('Failed to generate cropped image preview.');
        setImagePreview(imageSrcForCropper); // Fallback to original on error
      }
    } else {
      console.warn('[handleCropperClose] Missing image source or crop area for preview generation.');
      // If no crop was really done, maybe just keep the original?
      // Or clear preview if selectedFile exists but no crop?
      // Let's stick to showing original if src exists
      setImagePreview(imageSrcForCropper);
    }
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
                    <div className="space-y-4">
                      <div>
                      <Label htmlFor="blog-image-upload-input" className="block text-sm font-medium mb-1">Image</Label>
                        <div className="flex items-center space-x-4">
                        <Input
                          id="blog-image-upload-input"
                            type="file"
                            accept="image/*"
                          onChange={handleFileSelect}
                            disabled={isUploading}
                          className="block w-full text-sm text-gray-500 px-3 py-2
                            file:mr-4 file:py-1 file:px-3
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-fintech-blue file:text-white
                              hover:file:bg-fintech-blue-dark"
                          />
                        </div>
                      {/* --- UPDATED PREVIEW LOGIC --- */}
                      {imagePreview && ( // Show preview if imagePreview state is set
                          <div className="relative mt-2">
                            <img
                            src={imagePreview} // Use imagePreview state directly
                              alt="Preview"
                            className="w-full h-32 object-contain rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                              // --- UPDATED CLEAR LOGIC --- Clear all relevant states
                                setImagePreview(null);
                              setFormData(prev => ({ ...prev, image_url: selectedPost?.image_url || '' })); // Reset to original URL if editing, or empty if creating
                              setSelectedFile(null);
                              setCroppedAreaPixels(null);
                              setImageSrcForCropper(null); // Also clear the cropper source
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div>
                      <Label htmlFor="author" className="block text-sm font-medium mb-1">Author</Label>
                        <Input
                        id="author"
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        />
                      </div>
                      <div>
                      <Label htmlFor="category-select" className="block text-sm font-medium mb-1">Category</Label>
                      <select
                        id="category-select"
                        value={formData.category || ""}
                        onChange={(e) => {
                          const selectedCategory = e.target.value;
                          console.log("Selected category from select:", selectedCategory);
                          setFormData(prev => ({ ...prev, category: selectedCategory }));
                          setNewCategoryInputValue("");
                        }}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 mb-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">-- Select Existing --</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                        <Input
                        id="new-category-input"
                        type="text"
                        placeholder="Or enter new category"
                        value={newCategoryInputValue}
                        onChange={(e) => {
                          const newCatValue = e.target.value;
                          console.log("Typed in new category input:", newCatValue);
                          setNewCategoryInputValue(newCatValue);
                          setFormData(prev => ({ ...prev, category: newCatValue.trim() }));
                        }}
                        className="w-full"
                        />
                      </div>
                      <div>
                      <Label htmlFor="reading-time" className="block text-sm font-medium mb-1">Reading Time</Label>
                        <Input
                        id="reading-time"
                          value={formData.reading_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, reading_time: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                        id="featured-switch"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                        />
                      <Label htmlFor="featured-switch" className="text-sm font-medium">Featured</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                        id="published-switch"
                          checked={formData.published}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                        />
                      <Label htmlFor="published-switch" className="text-sm font-medium">Published</Label>
                    </div>
                      <div>
                      <Label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (comma separated)</Label>
                        <Input
                        id="tags"
                          value={formData.tags?.join(', ')}
                          onChange={(e) => {
                            const tags = e.target.value.split(',').map(tag => tag.trim());
                            setFormData(prev => ({ ...prev, tags }));
                          }}
                        />
                      </div>
                      <div>
                      <Label htmlFor="color-scheme" className="block text-sm font-medium mb-1">Color Scheme</Label>
                        <select
                        id="color-scheme"
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
                  <div className="space-y-4">
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ru">Russian</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" className="space-y-4">
                      <div>
                          <Label htmlFor="title_en" className="block text-sm font-medium mb-1">Title</Label>
                        <Input
                            id="title_en"
                          value={formData.title_en}
                          onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                        />
                      </div>
                      <div>
                          <Label htmlFor="excerpt_en" className="block text-sm font-medium mb-1">Excerpt</Label>
                        <Textarea
                            id="excerpt_en"
                          value={formData.excerpt_en}
                          onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                          <Label htmlFor="content_en" className="block text-sm font-medium mb-1">Content</Label>
                        <Textarea
                            id="content_en"
                          value={formData.content_en}
                          onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                          className="min-h-[200px]"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="ru" className="space-y-4">
                      <div>
                          <Label htmlFor="title_ru" className="block text-sm font-medium mb-1">Title</Label>
                        <Input
                            id="title_ru"
                          value={formData.title_ru}
                          onChange={(e) => setFormData(prev => ({ ...prev, title_ru: e.target.value }))}
                        />
                      </div>
                      <div>
                          <Label htmlFor="excerpt_ru" className="block text-sm font-medium mb-1">Excerpt</Label>
                        <Textarea
                            id="excerpt_ru"
                          value={formData.excerpt_ru}
                          onChange={(e) => setFormData(prev => ({ ...prev, excerpt_ru: e.target.value }))}
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                          <Label htmlFor="content_ru" className="block text-sm font-medium mb-1">Content</Label>
                        <Textarea
                            id="content_ru"
                          value={formData.content_ru}
                          onChange={(e) => setFormData(prev => ({ ...prev, content_ru: e.target.value }))}
                          className="min-h-[200px]"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={isUploading}>
                    {isUploading ? "Processing..." : "Save"}
                  </Button>
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
                  <TableRow key={post.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => {
                    setSelectedPost(post);
                    setFormData(post);
                    setImagePreview(post.image_url);
                  }}>
                    <TableCell className="font-medium flex items-center">
                      {post.image_url && (
                        <img
                          src={getImageUrl(post.image_url)}
                          alt={getLocalizedContent(post, 'title', 'en')}
                          className="h-10 w-10 object-cover rounded mr-3 shrink-0"
                          loading="lazy"
                        />
                      )}
                      <span className="truncate group-hover:underline" title={getLocalizedContent(post, 'title', 'en')}>
                        {getLocalizedContent(post, 'title', 'en')}
                      </span>
                    </TableCell>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(post);
                            setFormData(post);
                            setImagePreview(post.image_url);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post.id);
                          }}
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

      {/* Cropper Dialog */}
      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative h-[400px] bg-muted">
            {imageSrcForCropper && (
              <Cropper
                image={imageSrcForCropper}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9} // Or your desired aspect ratio
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete} // Automatically saves crop area
              />
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Label className="w-16">Zoom</Label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              className="flex-grow"
            />
          </div>
          <DialogFooter className="mt-4">
            {/* Removed Apply Crop Area button */}
            <Button onClick={handleCropperClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 