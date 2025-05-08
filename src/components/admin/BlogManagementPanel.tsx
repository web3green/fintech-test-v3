import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import {
    Pencil, Trash2, X, UploadCloud, Edit, Link as LinkIcon, Image as ImageIcon, Code, ListOrdered,
    Bold, Italic, List, Heading2, AlertCircle, Loader2
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from "@/contexts/LanguageContext";
import { Spinner } from '@/components/ui/spinner';
import { databaseService, BlogPost } from '@/services/databaseService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { blogService, getLocalizedContent, getImageUrl, getDistinctCategories } from '@/services/blogService';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import getCroppedImg from '@/utils/cropImage';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import slugify from 'slugify';

const blogPostSchema = z.object({
  title_en: z.string().min(1, { message: "English title is required." }),
  title_ru: z.string().min(1, { message: "Russian title is required." }),
  slug: z.string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase alphanumeric with hyphens." })
          .optional()
          .or(z.literal('')),
  content_en: z.string().min(1, { message: "English content is required." }),
  content_ru: z.string().min(1, { message: "Russian content is required." }),
  excerpt_en: z.string().optional(),
  excerpt_ru: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  reading_time: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image_url: z.string().url({ message: "Must be a valid URL." }).or(z.literal('')).nullable().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  color_scheme: z.enum(['blue', 'orange']).default('blue'),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const TiptapToolbar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex items-center space-x-1 border border-input bg-transparent rounded-md p-1 mb-2">
      <Button
        type="button"
        size="sm" variant={editor.isActive('bold') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
         type="button"
         size="sm" variant={editor.isActive('italic') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm" variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="sm" variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
       <Button
        type="button"
        size="sm" variant={editor.isActive('link') ? 'default' : 'ghost'}
        onClick={setLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
       <Button
         type="button"
        size="sm" variant={'ghost'}
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        Unlink
      </Button>
    </div>
  );
};

const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export function BlogManagementPanel() {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const [imageSrcForCropper, setImageSrcForCropper] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
    title_en: '',
    title_ru: '',
      slug: '',
    content_en: '',
    content_ru: '',
    excerpt_en: '',
    excerpt_ru: '',
    author: '',
    category: '',
    reading_time: '',
    tags: [],
      image_url: null,
    featured: false,
    published: false,
      color_scheme: 'blue',
    },
  });

  const watchedImageUrl = watch("image_url");

  const editorEn = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false, autolink: true })],
    content: '',
    onUpdate: ({ editor }) => setValue('content_en', editor.getHTML(), { shouldValidate: true }),
    editorProps: {
       attributes: { class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] border border-input border-t-0 bg-background rounded-b-md p-2' },
    }
  });
  const editorRu = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false, autolink: true })],
    content: '',
    onUpdate: ({ editor }) => setValue('content_ru', editor.getHTML(), { shouldValidate: true }),
    editorProps: {
       attributes: { class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[150px] border border-input border-t-0 bg-background rounded-b-md p-2' },
    }
  });

  useEffect(() => {
    loadPosts();
    loadCategories();
  }, []);

  useEffect(() => {
    const contentEn = getValues('content_en') || '';
    const contentRu = getValues('content_ru') || '';

    if (editorEn && editorEn.getHTML() !== contentEn) {
      editorEn.commands.setContent(contentEn);
    }
    if (editorRu && editorRu.getHTML() !== contentRu) {
      editorRu.commands.setContent(contentRu);
    }
  }, [selectedPost, editorEn, editorRu, getValues]);

  useEffect(() => {
    return () => {
      editorEn?.destroy();
      editorRu?.destroy();
    };
  }, [editorEn, editorRu]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await databaseService.getPosts(1, 1000);
      if (result && Array.isArray(result.posts)) {
         setPosts(result.posts);
      } else {
         console.warn('Received unexpected data structure from getPosts:', result);
        setPosts([]);
      }
    } catch (err: any) {
      console.error('Error loading posts:', err);
      const message = `Failed to load posts: ${err.message || 'Unknown error'}`;
      setError(message);
      setPosts([]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    console.log('[loadCategories] Fetching categories...');
    try {
      const fetchedCategories = await getDistinctCategories();
        setCategories(fetchedCategories.sort());
      console.log('[loadCategories] Categories loaded:', fetchedCategories);
    } catch (err: any) {
        const message = `Failed to load categories: ${err.message || 'Unknown error'}`;
        console.error('[loadCategories] Error:', err);
        toast.error(message);
    }
  };

  const handleAddCategory = () => {
    const newCategoryName = newCategoryInput.trim();
    if (!newCategoryName) {
        toast.warning("Please enter a category name.");
        return;
    }
    const existingCategory = categories.find(cat => cat.toLowerCase() === newCategoryName.toLowerCase());
    if (existingCategory) {
        toast.info(`Category "${existingCategory}" already exists.`);
        setValue('category', existingCategory);
        setNewCategoryInput('');
        return;
    }

    const updatedCategories = [...categories, newCategoryName].sort();
    setCategories(updatedCategories);
    
    setValue('category', newCategoryName);
    
    setNewCategoryInput('');
    
    toast.success(`Category "${newCategoryName}" added. It will be saved with the post.`);
    console.log('[handleAddCategory] Added locally:', newCategoryName, 'Updated categories state:', updatedCategories);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrcForCropper(reader.result?.toString() || null);
        setCroppedAreaPixels(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(file);
      event.target.value = '';
    }
  };
  
  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsValue: Area) => {
    console.log('[onCropComplete] Saving cropped area pixels:', croppedAreaPixelsValue);
    setCroppedAreaPixels(croppedAreaPixelsValue);
  }, []);

  const handleConfirmCrop = async () => {
    if (!imageSrcForCropper || !croppedAreaPixels) {
        toast.error("Could not crop image. Please try again.");
        console.error("[handleConfirmCrop] Missing image source or cropped area pixels.", { imageSrcForCropper, croppedAreaPixels });
        return;
    }

    setIsProcessingImage(true);
    console.log('[handleConfirmCrop] Starting crop generation...');
    try {
        const croppedImageBlob = await getCroppedImg(
            imageSrcForCropper,
            croppedAreaPixels
        );
        
        if (!croppedImageBlob) {
             throw new Error("Cropped image blob is null.");
        }

        console.log('[handleConfirmCrop] Cropped image blob created:', croppedImageBlob);

        const originalFilename = selectedFile?.name || 'cropped-image.jpeg'; 
        const croppedFile = new File([croppedImageBlob], originalFilename, {
            type: croppedImageBlob.type || 'image/jpeg',
            lastModified: Date.now(),
        });

        console.log('[handleConfirmCrop] Cropped file created:', croppedFile);

        const dataUrl = await blobToDataURL(croppedImageBlob);
        setValue('image_url', dataUrl);
        setSelectedFile(croppedFile);
        
        setIsCropperOpen(false);
        setImageSrcForCropper(null);
        console.log('[handleConfirmCrop] Crop confirmed, preview updated, cropper closed.');

    } catch (e: any) {
        console.error("[handleConfirmCrop] Failed to crop image:", e);
        toast.error(`Failed to process image: ${e.message}`);
    } finally {
        setIsProcessingImage(false);
    }
  };

  const handleImageUpload = async (fileToUpload: File): Promise<string | null> => {
    setIsUploading(true);
    console.log(`[handleImageUpload] Uploading processed file: ${fileToUpload.name}, size: ${fileToUpload.size}`);
    try {
      const imageUrl = await databaseService.uploadImage(fileToUpload);
      console.log(`[handleImageUpload] Upload successful. URL: ${imageUrl}`);
      return imageUrl;
    } catch (error: any) {
      console.error('Detailed Upload Error (Panel):', error);
      console.error('Upload Error Message (Panel):', error.message);
      console.error('Upload Error Status (Panel):', error.status);
      throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    reset({
      title_en: post.title_en || '',
      title_ru: post.title_ru || '',
      slug: post.slug || '',
      content_en: post.content_en || '',
      content_ru: post.content_ru || '',
      excerpt_en: post.excerpt_en || '',
      excerpt_ru: post.excerpt_ru || '',
      author: post.author || '',
      category: post.category || '',
      reading_time: post.reading_time || '',
      tags: post.tags || [],
      image_url: post.image_url || null,
      featured: post.featured || false,
      published: post.published || false,
      color_scheme: post.color_scheme || 'blue',
    });
    setImageSrcForCropper(null);
    setSelectedFile(null);
    setIsCropperOpen(false);
    setCroppedAreaPixels(null);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedPost(null);
    reset({
        title_en: '',
        title_ru: '',
      slug: '',
        content_en: '',
        content_ru: '',
        excerpt_en: '',
        excerpt_ru: '',
        author: '',
        category: '',
      reading_time: '',
        tags: [],
      image_url: null,
        featured: false,
        published: false,
      color_scheme: 'blue',
    });
    editorEn?.commands.setContent('');
    editorRu?.commands.setContent('');
    setIsDialogOpen(true);
  };

 const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
       await databaseService.deletePost(postId);
      toast.success('Post deleted successfully');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const onSubmitForm = async (formData: BlogPostFormData) => {
    console.log("Form Data Submitted:", formData);
    let finalImageUrl = formData.image_url;

    if (selectedFile && !watchedImageUrl) {
      toast.info("Processing image...");
      setIsProcessingImage(true);
      const uploadedUrl = await handleImageUpload(selectedFile);
      setIsProcessingImage(false);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
        setValue('image_url', uploadedUrl);
      } else {
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }

    let finalSlug = formData.slug;
    if (!finalSlug && formData.title_en) {
      finalSlug = slugify(formData.title_en, { lower: true, strict: true });
      console.log(`Generated slug: ${finalSlug}`);
    }

    const postData = {
      ...formData,
      image_url: finalImageUrl,
      slug: finalSlug,
      tags: formData.tags || [],
      featured: formData.featured || false,
      published: formData.published || false,
    };

    setIsProcessingImage(true);

    try {
      if (selectedPost) {
        console.log(`[onSubmitForm] Updating post ID: ${selectedPost.id}`);
        await databaseService.updatePost(selectedPost.id, postData);
        toast.success('Post updated successfully');
        } else {
        console.log('[onSubmitForm] Creating new post');
        await databaseService.createPost(postData);
        toast.success('Post created successfully');
      }

      setIsDialogOpen(false);
      loadPosts();
      setSelectedPost(null);
      setImageSrcForCropper(null);
      setSelectedFile(null);
      setCroppedAreaPixels(null);

    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(`Failed to save post: ${error.message || 'Unknown error'}`);
    } finally {
       setIsProcessingImage(false);
    }
  };

  if (loading) return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  if (error) return (
      <Alert variant="destructive" className="m-4">
          {/* ... error display ... */}
      </Alert>
    );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold">Blog Management</h1>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateNew}>Create New Post</Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{selectedPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {selectedPost ? `Edit blog post titled ${selectedPost.title_en || selectedPost.title_ru}` : 'Dialog to add a new blog post. Fill in the details below.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 p-1">
                      <div>
                        <Label htmlFor="image-upload">Featured Image</Label>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                          onChange={handleFileSelect}
                            className="mb-2"
                            disabled={isUploading || isProcessingImage}
                        />
                        <div className="w-full min-h-40 border rounded bg-muted flex items-center justify-center text-muted-foreground mb-2 p-2 relative group">
                            {watchedImageUrl ? (
                                <>
                                    <img
                                        src={watchedImageUrl.startsWith('data:') ? watchedImageUrl : getImageUrl(watchedImageUrl)}
                                        alt="Current image preview" 
                                        className="max-w-full max-h-40 object-contain rounded"
                                    />
                                    <Button
                              type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 z-10"
                              onClick={() => {
                                            setValue('image_url', null);
                              setSelectedFile(null);
                                        }}
                                        disabled={isUploading || isProcessingImage}
                                        aria-label="Clear Image"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </> 
                            ) : (
                                <span>No Image Selected</span>
                            )}
                        </div>
                        {(isUploading || isProcessingImage) && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>{isUploading ? "Uploading..." : "Processing Image..."}</span>
                          </div>
                        )}
                        {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>}
                      </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                            <Label htmlFor="author">Author</Label>
                            <Input id="author" {...register("author")} placeholder="Author's name" />
                            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
                      </div>
                      <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" {...register("slug")} placeholder="seo-friendly-unique-slug" />
                            <p className="text-sm text-muted-foreground mt-1">
                              {language === 'en' 
                                ? "Unique identifier for the URL (e.g., /blog/your-slug-here). Use lowercase letters, numbers, and hyphens only. This is important for SEO and will not be shown directly on the page."
                                : "Уникальный идентификатор для URL (напр., /blog/vash-slug-tut). Используйте только строчные буквы, цифры и дефисы. Важно для SEO, на странице не отображается."
                              }
                            </p>
                            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                        </div>
                       
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                            
                            <div className="mt-3 flex items-center space-x-2">
                        <Input
                                    placeholder="Or enter new category name" 
                                    value={newCategoryInput}
                                    onChange={(e) => setNewCategoryInput(e.target.value)}
                                    className="flex-grow"
                                />
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddCategory}
                                    disabled={!newCategoryInput.trim()}
                                >
                                    Add Category
                                </Button>
                      </div>
                    </div>
                      <div>
                            <Label htmlFor="reading_time">Reading Time</Label>
                            <Input id="reading_time" {...register("reading_time")} placeholder="e.g., 5 min" />
                            {errors.reading_time && <p className="text-red-500 text-sm mt-1">{errors.reading_time.message}</p>}
                        </div>
                         <div className="md:col-span-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Controller
                                name="tags"
                                control={control}
                                render={({ field }) => (
                        <Input
                        id="tags"
                                        placeholder="tech, finance, updates"
                                        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                          onChange={(e) => {
                                            const stringValue = e.target.value;
                                            const arrayValue = stringValue 
                                                ? stringValue.split(',').map(tag => tag.trim()).filter(Boolean) 
                                                : [];
                                            field.onChange(arrayValue);
                                        }}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                    />
                                )}
                            />
                            {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags.message || (errors.tags.root && errors.tags.root.message)}</p>}
                      </div>
                      <div>
                            <Label htmlFor="color_scheme">Color Scheme</Label>
                             <Controller
                                name="color_scheme"
                                control={control}
                                render={({ field }) => (
                                     <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select color scheme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="blue">Blue</SelectItem>
                                            <SelectItem value="orange">Orange</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.color_scheme && <p className="text-red-500 text-sm mt-1">{errors.color_scheme.message}</p>}
                      </div>
                    </div>

                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ru">Russian</TabsTrigger>
                    </TabsList>
                        <TabsContent value="en" className="space-y-4 mt-4">
                      <div>
                                <Label htmlFor="title_en">Title (English)</Label>
                                <Input id="title_en" {...register("title_en")} />
                                {errors.title_en && <p className="text-red-500 text-sm mt-1">{errors.title_en.message}</p>}
                      </div>
                      <div>
                                <Label htmlFor="excerpt_en">Excerpt (English)</Label>
                                <textarea 
                            id="excerpt_en"
                                     {...register("excerpt_en")} 
                                     rows={3} 
                                     className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50 p-2"
                                 />
                                {errors.excerpt_en && <p className="text-red-500 text-sm mt-1">{errors.excerpt_en.message}</p>}
                      </div>
                      <div>
                                <Label htmlFor="content_en">Content (English)</Label>
                                <TiptapToolbar editor={editorEn} />
                                <EditorContent editor={editorEn} />
                                {errors.content_en && <p className="text-red-500 text-sm mt-1">{errors.content_en.message}</p>}
                      </div>
                    </TabsContent>
                        <TabsContent value="ru" className="space-y-4 mt-4">
                      <div>
                                <Label htmlFor="title_ru">Title (Russian)</Label>
                                <Input id="title_ru" {...register("title_ru")} />
                                {errors.title_ru && <p className="text-red-500 text-sm mt-1">{errors.title_ru.message}</p>}
                      </div>
                      <div>
                                <Label htmlFor="excerpt_ru">Excerpt (Russian)</Label>
                                 <textarea 
                            id="excerpt_ru"
                                     {...register("excerpt_ru")} 
                                     rows={3} 
                                     className="mt-1 block w-full rounded-md border-input bg-background shadow-sm focus:border-ring focus:ring focus:ring-ring focus:ring-opacity-50 p-2"
                                 />
                                {errors.excerpt_ru && <p className="text-red-500 text-sm mt-1">{errors.excerpt_ru.message}</p>}
                      </div>
                      <div>
                                <Label htmlFor="content_ru">Content (Russian)</Label>
                                <TiptapToolbar editor={editorRu} />
                                <EditorContent editor={editorRu} />
                                {errors.content_ru && <p className="text-red-500 text-sm mt-1">{errors.content_ru.message}</p>}
                      </div>
                    </TabsContent>
                  </Tabs>

                    <div className="flex items-center space-x-6 pt-4">
                         <Controller
                            name="featured"
                            control={control}
                            render={({ field }) => (
                                 <div className="flex items-center space-x-2">
                                     <Checkbox id="featured" checked={field.value} onCheckedChange={field.onChange} />
                                    <Label htmlFor="featured" className="cursor-pointer">Featured Post</Label>
                  </div>
                            )}
                         />
                         <Controller
                            name="published"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="published" checked={field.value} onCheckedChange={field.onChange} />
                                    <Label htmlFor="published" className="cursor-pointer">Published</Label>
                </div>
                             )}
                        />
                </div>

                   <DialogFooter className="mt-6">
                       <DialogClose asChild>
                           <Button type="button" variant="outline">Cancel</Button>
                       </DialogClose>
                       <Button type="submit" disabled={isUploading || isProcessingImage}>
                            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> 
                             : isProcessingImage ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> 
                             : (selectedPost ? "Update Post" : "Create Post")}
                       </Button>
                   </DialogFooter>
              </form>
              </DialogContent>
            </Dialog>
          </div>

    <Card className="mt-6">
       <CardHeader>
           <CardTitle>Existing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No posts found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>
                                    {post.image_url ? (
                        <img
                          src={getImageUrl(post.image_url)}
                                            alt=""
                                            className="h-10 w-10 object-cover rounded"
                          loading="lazy"
                        />
                                    ) : (
                                         <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-muted-foreground">
                                             <ImageIcon className="h-4 w-4" />
                                         </div>
                      )}
                    </TableCell>
                                <TableCell className="font-medium">{post.title_en || '-'}</TableCell> 
                                <TableCell>{post.author || '-'}</TableCell> 
                                <TableCell className="capitalize">{post.category || '-'}</TableCell> 
                    <TableCell>
                                    <Badge variant={post.published ? 'default' : 'outline'}> 
                                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(post); }}> 
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit Post</span>
                        </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}> 
                                        <Trash2 className="h-4 w-4" />
                                         <span className="sr-only">Delete Post</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    <Dialog open={isCropperOpen} onOpenChange={(open) => { 
        if (!isProcessingImage) setIsCropperOpen(open);
        if (!open && !selectedFile) setImageSrcForCropper(null);
     }}>
        <DialogContent className="max-w-[90vw] sm:max-w-xl p-0">
            <DialogHeader className="p-6 pb-0">
            <DialogTitle>Crop Image</DialogTitle>
                 <DialogDescription className="sr-only">Adjust the image crop area and zoom level.</DialogDescription>
          </DialogHeader>
            {imageSrcForCropper && (
                <div className="p-6 pt-2">
                    <div className="relative w-full h-[40vh] sm:h-[50vh] bg-muted mb-4 overflow-hidden">
              <Cropper
                image={imageSrcForCropper}
                crop={crop}
                zoom={zoom}
                            aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
              />
          </div>
                    <div className="space-y-2">
                        <Label htmlFor="zoom-slider">Zoom</Label>
            <Slider
                            id="zoom-slider"
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
                            disabled={isProcessingImage}
            />
          </div>
                </div>
             )}
            <DialogFooter className="p-6 pt-0">
                <Button 
                    variant="outline" 
                    onClick={() => {
                         setIsCropperOpen(false);
                         setImageSrcForCropper(null);
                     }}
                    disabled={isProcessingImage}
                 >
                    Cancel
                </Button>
                <Button 
                    onClick={handleConfirmCrop}
                    disabled={!croppedAreaPixels || isProcessingImage}
                 >
                     {isProcessingImage ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Confirm Crop"}
                </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 