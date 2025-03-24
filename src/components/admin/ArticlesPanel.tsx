
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

const articleSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  published: z.boolean().default(false),
  resourceName: z.string().min(1, { message: "Resource name is required" }),
  resourceUrl: z.string().url({ message: "Valid URL is required" }),
  articleFormat: z.string().min(1, { message: "Format is required" }),
});

export const ArticlesPanel = () => {
  const { language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  const [articles, setArticles] = useState(() => {
    const savedArticles = localStorage.getItem("articles");
    return savedArticles ? JSON.parse(savedArticles) : [
      { id: 1, title: "The Future of Fintech", content: "Exploring trends in financial technology", category: "Technology", published: true, date: "2023-05-15", resourceName: "Finance Blog", resourceUrl: "https://financeblog.com", articleFormat: "Guest Post" },
      { id: 2, title: "Investment Strategies for 2023", content: "How to build a resilient portfolio", category: "Investment", published: true, date: "2023-05-10", resourceName: "Investing Daily", resourceUrl: "https://investingdaily.com", articleFormat: "Interview" },
      { id: 3, title: "Cryptocurrency Market Analysis", content: "Understanding the volatile crypto landscape", category: "Crypto", published: false, date: "2023-05-05", resourceName: "Crypto News", resourceUrl: "https://cryptonews.com", articleFormat: "Analysis" },
    ];
  });
  
  useEffect(() => {
    localStorage.setItem("articles", JSON.stringify(articles));
  }, [articles]);
  
  const articleForm = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      published: false,
      resourceName: "",
      resourceUrl: "",
      articleFormat: "",
    },
  });
  
  const handleArticleSubmit = (data) => {
    if (selectedArticle) {
      const updatedArticles = articles.map(article => 
        article.id === selectedArticle.id 
          ? { ...article, ...data, date: new Date().toISOString().split('T')[0] }
          : article
      );
      setArticles(updatedArticles);
      toast.success(language === 'en' ? "Article updated successfully" : "Статья успешно обновлена");
    } else {
      const newArticle = {
        id: articles.length ? Math.max(...articles.map(a => a.id)) + 1 : 1,
        ...data,
        date: new Date().toISOString().split('T')[0]
      };
      setArticles([...articles, newArticle]);
      toast.success(language === 'en' ? "Article created successfully" : "Статья успешно создана");
    }
    
    articleForm.reset();
    setSelectedArticle(null);
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    articleForm.reset({
      title: article.title,
      content: article.content,
      category: article.category,
      published: article.published,
      resourceName: article.resourceName || "",
      resourceUrl: article.resourceUrl || "",
      articleFormat: article.articleFormat || "",
    });
  };

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter(article => article.id !== id));
    toast.success(language === 'en' ? "Article deleted successfully" : "Статья успешно удалена");
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{selectedArticle ? (language === 'en' ? "Edit Article" : "Редактировать статью") : (language === 'en' ? "Create New Article" : "Создать новую статью")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...articleForm}>
            <form onSubmit={articleForm.handleSubmit(handleArticleSubmit)} className="space-y-4">
              <FormField
                control={articleForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? "Title" : "Заголовок"}</FormLabel>
                    <FormControl>
                      <Input placeholder={language === 'en' ? "Article title" : "Заголовок статьи"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={articleForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? "Category" : "Категория"}</FormLabel>
                    <FormControl>
                      <Input placeholder={language === 'en' ? "Article category" : "Категория статьи"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={articleForm.control}
                  name="resourceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? "Resource Name" : "Название ресурса"}</FormLabel>
                      <FormControl>
                        <Input placeholder={language === 'en' ? "Where published" : "Где опубликовано"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={articleForm.control}
                  name="resourceUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? "Resource URL" : "URL ресурса"}</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={articleForm.control}
                name="articleFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? "Article Format" : "Формат статьи"}</FormLabel>
                    <FormControl>
                      <Input placeholder={language === 'en' ? "Guest post, interview, etc." : "Гостевой пост, интервью и т.д."} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={articleForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? "Content" : "Содержание"}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={language === 'en' ? "Article content" : "Содержание статьи"} 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={articleForm.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{language === 'en' ? "Published" : "Опубликовано"}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedArticle(null);
                    articleForm.reset({
                      title: "",
                      content: "",
                      category: "",
                      published: false,
                      resourceName: "",
                      resourceUrl: "",
                      articleFormat: "",
                    });
                  }}
                >
                  {language === 'en' ? "Cancel" : "Отмена"}
                </Button>
                <Button type="submit">
                  {selectedArticle ? (language === 'en' ? "Update" : "Обновить") : (language === 'en' ? "Create" : "Создать")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? "Published Articles" : "Опубликованные статьи"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? "Title" : "Заголовок"}</TableHead>
                  <TableHead>{language === 'en' ? "Resource" : "Ресурс"}</TableHead>
                  <TableHead>{language === 'en' ? "Format" : "Формат"}</TableHead>
                  <TableHead>{language === 'en' ? "Date" : "Дата"}</TableHead>
                  <TableHead>{language === 'en' ? "Actions" : "Действия"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>
                      {article.resourceName && (
                        <a 
                          href={article.resourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {article.resourceName}
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      {article.articleFormat && (
                        <Badge variant="outline">
                          {article.articleFormat}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{article.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditArticle(article)}
                        >
                          {language === 'en' ? "Edit" : "Редактировать"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          {language === 'en' ? "Delete" : "Удалить"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
