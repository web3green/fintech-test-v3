import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { blogPosts, getLocalizedContent } from '@/services/blogService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export const BlogAdminPanel = () => {
  const { language } = useLanguage();
  const [posts, setPosts] = useState([...blogPosts]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [postFormOpen, setPostFormOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: { en: '', ru: '' },
    excerpt: { en: '', ru: '' },
    content: { en: '', ru: '' },
    category: { en: '', ru: '' },
    image: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    readingTime: '5 min',
    tags: [],
    featured: false,
    colorScheme: 'blue'
  });

  const filteredPosts = posts.filter(post => {
    const title = getLocalizedContent(post.title, language).toLowerCase();
    const category = getLocalizedContent(post.category, language).toLowerCase();
    const searchTerms = searchQuery.toLowerCase();
    
    return title.includes(searchTerms) || category.includes(searchTerms);
  });

  const handleAddNew = () => {
    setIsEditMode(false);
    setFormData({
      title: { en: '', ru: '' },
      excerpt: { en: '', ru: '' },
      content: { en: '', ru: '' },
      category: { en: '', ru: '' },
      image: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      readingTime: '5 min',
      tags: [],
      featured: false,
      colorScheme: 'blue'
    });
    setPostFormOpen(true);
  };

  const handleEdit = (post) => {
    setIsEditMode(true);
    setFormData({
      ...post,
      tags: post.tags ? post.tags.join(', ') : ''
    });
    setSelectedPost(post);
    setPostFormOpen(true);
  };

  const handleDelete = (postId) => {
    if (confirm(language === 'en' ? 'Are you sure you want to delete this post?' : 'Вы уверены, что хотите удалить эту запись?')) {
      setPosts(posts.filter(post => post.id !== postId));
      toast.success(language === 'en' ? 'Post deleted successfully' : 'Запись успешно удалена');
    }
  };

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData({
        ...formData,
        [field]: {
          ...formData[field],
          [lang]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleTagsChange = (value) => {
    setFormData({
      ...formData,
      tags: value.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode && selectedPost) {
      // Update existing post
      const updatedPosts = posts.map(post => 
        post.id === selectedPost.id ? { ...formData, id: post.id } : post
      );
      setPosts(updatedPosts);
      toast.success(language === 'en' ? 'Post updated successfully' : 'Запись успешно обновлена');
    } else {
      // Add new post
      const newPost = {
        ...formData,
        id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        date: new Date().toISOString().split('T')[0]
      };
      setPosts([...posts, newPost]);
      toast.success(language === 'en' ? 'Post created successfully' : 'Запись успешно создана');
    }
    
    setPostFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{language === 'en' ? 'Blog Management' : 'Управление блогом'}</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Add New Post' : 'Добавить новую запись'}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder={language === 'en' ? "Search posts..." : "Поиск записей..."}
          className="pl-10 pr-4 py-2 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{language === 'en' ? 'Title' : 'Заголовок'}</TableHead>
                <TableHead>{language === 'en' ? 'Category' : 'Категория'}</TableHead>
                <TableHead>{language === 'en' ? 'Author' : 'Автор'}</TableHead>
                <TableHead>{language === 'en' ? 'Date' : 'Дата'}</TableHead>
                <TableHead>{language === 'en' ? 'Featured' : 'Избранное'}</TableHead>
                <TableHead>{language === 'en' ? 'Actions' : 'Действия'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.id}</TableCell>
                    <TableCell className="font-medium">{getLocalizedContent(post.title, language)}</TableCell>
                    <TableCell>{getLocalizedContent(post.category, language)}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      {post.featured ? (
                        <Badge variant="default" className="bg-green-500">
                          {language === 'en' ? 'Yes' : 'Да'}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          {language === 'en' ? 'No' : 'Нет'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {language === 'en' ? 'No posts found' : 'Записи не найдены'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={postFormOpen} onOpenChange={setPostFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isEditMode 
                ? language === 'en' ? 'Edit Blog Post' : 'Редактировать запись блога' 
                : language === 'en' ? 'Create New Blog Post' : 'Создать новую запись блога'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue="english">
              <TabsList className="mb-4">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="russian">Russian</TabsTrigger>
                <TabsTrigger value="common">{language === 'en' ? 'Common Fields' : 'Общие поля'}</TabsTrigger>
              </TabsList>

              <TabsContent value="english" className="space-y-4">
                <div>
                  <Label htmlFor="title-en">Title (English)</Label>
                  <Input 
                    id="title-en" 
                    value={formData.title.en || ''} 
                    onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt-en">Excerpt (English)</Label>
                  <Textarea 
                    id="excerpt-en" 
                    value={formData.excerpt.en || ''} 
                    onChange={(e) => handleInputChange('excerpt', e.target.value, 'en')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content-en">Full Content (English)</Label>
                  <RichTextEditor
                    value={formData.content.en || ''}
                    onChange={(value) => handleInputChange('content', value, 'en')}
                    placeholder="Write your article content here..."
                  />
                </div>
                <div>
                  <Label htmlFor="category-en">Category (English)</Label>
                  <Input 
                    id="category-en" 
                    value={formData.category.en || ''} 
                    onChange={(e) => handleInputChange('category', e.target.value, 'en')}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="russian" className="space-y-4">
                <div>
                  <Label htmlFor="title-ru">Title (Russian)</Label>
                  <Input 
                    id="title-ru" 
                    value={formData.title.ru || ''} 
                    onChange={(e) => handleInputChange('title', e.target.value, 'ru')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt-ru">Excerpt (Russian)</Label>
                  <Textarea 
                    id="excerpt-ru" 
                    value={formData.excerpt.ru || ''} 
                    onChange={(e) => handleInputChange('excerpt', e.target.value, 'ru')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content-ru">Full Content (Russian)</Label>
                  <RichTextEditor
                    value={formData.content.ru || ''}
                    onChange={(value) => handleInputChange('content', value, 'ru')}
                    placeholder="Напишите содержание статьи здесь..."
                  />
                </div>
                <div>
                  <Label htmlFor="category-ru">Category (Russian)</Label>
                  <Input 
                    id="category-ru" 
                    value={formData.category.ru || ''} 
                    onChange={(e) => handleInputChange('category', e.target.value, 'ru')}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="common" className="space-y-4">
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input 
                    id="image" 
                    value={formData.image || ''} 
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author" 
                    value={formData.author || ''} 
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reading-time">Reading Time</Label>
                  <Input 
                    id="reading-time" 
                    value={formData.readingTime || ''} 
                    onChange={(e) => handleInputChange('readingTime', e.target.value)}
                    placeholder="5 min"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} 
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div>
                  <Label htmlFor="color-scheme">Color Scheme</Label>
                  <select 
                    id="color-scheme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.colorScheme || 'blue'}
                    onChange={(e) => handleInputChange('colorScheme', e.target.value)}
                  >
                    <option value="blue">Blue</option>
                    <option value="orange">Orange</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="featured" 
                    checked={formData.featured} 
                    onCheckedChange={(checked) => handleInputChange('featured', checked)} 
                  />
                  <Label htmlFor="featured">
                    {language === 'en' ? 'Featured Post' : 'Избранная запись'}
                  </Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setPostFormOpen(false)}>
                {language === 'en' ? 'Cancel' : 'Отмена'}
              </Button>
              <Button type="submit">
                {isEditMode 
                  ? language === 'en' ? 'Update Post' : 'Обновить запись'
                  : language === 'en' ? 'Create Post' : 'Создать запись'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
