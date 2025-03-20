import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, FileText, BarChart3, Settings, 
  Bell, Search, Menu, X, LogOut, MessageSquare,
  Newspaper, Send, Link as LinkIcon, Globe
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const articleSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  published: z.boolean().default(false),
});

const requestSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  status: z.enum(["new", "in-progress", "resolved", "rejected"]).default("new"),
});

const webhookSchema = z.object({
  url: z.string().url({ message: "Invalid webhook URL" }),
});

const socialLinkSchema = z.object({
  platform: z.string().min(1, { message: "Platform is required" }),
  url: z.string().url({ message: "Invalid URL" }),
  icon: z.string().min(1, { message: "Icon is required" }),
});

const Admin = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedSocialLink, setSelectedSocialLink] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("webhookUrl") || "";
  });

  const [socialLinks, setSocialLinks] = useState(() => {
    const storedLinks = localStorage.getItem("socialLinks");
    return storedLinks ? JSON.parse(storedLinks) : [
      { id: 1, platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
      { id: 2, platform: 'Twitter', url: 'https://x.com', icon: 'twitter' },
      { id: 3, platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
      { id: 4, platform: 'Telegram', url: 'https://t.me/fintechassist', icon: 'telegram' },
      { id: 5, platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' }
    ];
  });
  
  const [users, setUsers] = useState([
    { id: 1, name: "Alex Johnson", email: "alex@example.com", status: "active", role: "User" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", status: "pending", role: "Admin" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", status: "inactive", role: "User" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", status: "active", role: "Manager" },
  ]);

  const [articles, setArticles] = useState(() => {
    const savedArticles = localStorage.getItem("articles");
    return savedArticles ? JSON.parse(savedArticles) : [
      { id: 1, title: "The Future of Fintech", content: "Exploring trends in financial technology", category: "Technology", published: true, date: "2023-05-15" },
      { id: 2, title: "Investment Strategies for 2023", content: "How to build a resilient portfolio", category: "Investment", published: true, date: "2023-05-10" },
      { id: 3, title: "Cryptocurrency Market Analysis", content: "Understanding the volatile crypto landscape", category: "Crypto", published: false, date: "2023-05-05" },
    ];
  });

  const [requests, setRequests] = useState(() => {
    const savedRequests = localStorage.getItem("requests");
    return savedRequests ? JSON.parse(savedRequests) : [
      { id: 1, name: "David Wilson", email: "david@example.com", message: "I'd like to know more about your investment services", status: "new", date: "2023-05-12" },
      { id: 2, name: "Lisa Anderson", email: "lisa@example.com", message: "Having trouble with the mobile app login", status: "in-progress", date: "2023-05-11" },
      { id: 3, name: "Robert Johnson", email: "robert@example.com", message: "Interested in a consultation about retirement planning", status: "resolved", date: "2023-05-10" },
      { id: 4, name: "Jennifer Brown", email: "jennifer@example.com", message: "Need help with account verification", status: "rejected", date: "2023-05-09" },
    ];
  });

  const [transactions, setTransactions] = useState([
    { id: 1, user: "Alex Johnson", amount: 1250, date: "2023-05-12", status: "completed" },
    { id: 2, user: "Sarah Smith", amount: 845, date: "2023-05-11", status: "pending" },
    { id: 3, user: "Michael Brown", amount: 1650, date: "2023-05-10", status: "completed" },
    { id: 4, user: "Emily Davis", amount: 520, date: "2023-05-09", status: "failed" },
  ]);

  useEffect(() => {
    localStorage.setItem("articles", JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("webhookUrl", webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem("socialLinks", JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Responsive: Toggle sidebar when screen size changes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const articleForm = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      published: false,
    },
  });

  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      status: "new",
    },
  });

  const webhookForm = useForm({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      url: webhookUrl,
    },
  });

  const socialLinkForm = useForm({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
    },
  });

  const handleLogin = (data) => {
    if (data.username === "admin" && data.password === "password") {
      localStorage.setItem("isAdmin", "true");
      setIsAuthenticated(true);
      toast.success(language === 'en' ? "Logged in successfully" : "Успешный вход");
    } else {
      toast.error(language === 'en' ? "Invalid credentials" : "Неверные учетные данные");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    toast.success(language === 'en' ? "Logged out successfully" : "Успешный выход");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    });
  };

  const handleDeleteArticle = (id) => {
    setArticles(articles.filter(article => article.id !== id));
    toast.success(language === 'en' ? "Article deleted successfully" : "Статья успешно удалена");
  };

  const handleRequestSubmit = (data) => {
    if (selectedRequest) {
      const updatedRequests = requests.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, ...data }
          : request
      );
      setRequests(updatedRequests);
      toast.success(language === 'en' ? "Request updated successfully" : "Заявка успешно обновлена");
    }
    
    requestForm.reset();
    setSelectedRequest(null);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    requestForm.reset({
      name: request.name,
      email: request.email,
      message: request.message,
      status: request.status,
    });
  };

  const handleWebhookSubmit = (data) => {
    setWebhookUrl(data.url);
    toast.success(language === 'en' ? "Webhook URL saved successfully" : "URL вебхука успешно сохранен");
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast.error(language === 'en' ? "Please enter a webhook URL first" : "Сначала введите URL вебхука");
      return;
    }

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          event: "test",
          timestamp: new Date().toISOString(),
          source: "Fintech-Assist Admin Panel"
        }),
      });
      
      toast.success(language === 'en' ? "Webhook test sent" : "Тестовый вебхук отправлен");
    } catch (error) {
      console.error("Webhook test error:", error);
      toast.error(language === 'en' ? "Failed to test webhook" : "Не удалось протестировать вебхук");
    }
  };

  const handleSocialLinkSubmit = (data) => {
    if (selectedSocialLink) {
      const updatedLinks = socialLinks.map(link => 
        link.id === selectedSocialLink.id 
          ? { ...link, ...data }
          : link
      );
      setSocialLinks(updatedLinks);
      toast.success(language === 'en' ? "Social link updated successfully" : "Социальная ссылка успешно обновлена");
    } else {
      const newLink = {
        id: socialLinks.length ? Math.max(...socialLinks.map(link => link.id)) + 1 : 1,
        ...data
      };
      setSocialLinks([...socialLinks, newLink]);
      toast.success(language === 'en' ? "Social link added successfully" : "Социальная ссылка успешно добавлена");
    }
    
    socialLinkForm.reset();
    setSelectedSocialLink(null);
  };

  const handleEditSocialLink = (link) => {
    setSelectedSocialLink(link);
    socialLinkForm.reset({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
    });
  };

  const handleDeleteSocialLink = (id) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
    toast.success(language === 'en' ? "Social link deleted successfully" : "Социальная ссылка успешно удалена");
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "resolved":
        return "bg-green-500";
      case "pending":
      case "in-progress":
        return "bg-yellow-500";
      case "inactive":
      case "failed":
      case "rejected":
        return "bg-red-500";
      case "new":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">{language === 'en' ? "Admin Login" : "Вход для администратора"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? "Username" : "Имя пользователя"}</FormLabel>
                      <FormControl>
                        <Input placeholder={language === 'en' ? "Enter username" : "Введите имя пользователя"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? "Password" : "Пароль"}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={language === 'en' ? "Enter password" : "Введите пароль"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {language === 'en' ? "Login" : "Войти"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-card border-r w-64 shadow-sm`}
      >
        <div className="flex flex-col h-full px-3 py-4">
          <div className="flex items-center justify-center mb-6 mt-2">
            <Logo showText={false} />
            <span className="ml-2 font-display font-bold text-xl">
              <span className="text-fintech-blue dark:text-fintech-blue-light">Fintech</span>
              <span className="text-fintech-orange">Admin</span>
            </span>
          </div>
          
          <nav className="flex-1 space-y-1">
            <Button 
              variant={currentTab === "dashboard" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("dashboard")}
              className="w-full justify-start"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {language === 'en' ? "Dashboard" : "Дашборд"}
            </Button>
            
            <Button 
              variant={currentTab === "articles" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("articles")}
              className="w-full justify-start"
            >
              <Newspaper className="mr-2 h-4 w-4" />
              {language === 'en' ? "Articles" : "Статьи"}
            </Button>
            
            <Button 
              variant={currentTab === "requests" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("requests")}
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              {language === 'en' ? "Requests" : "Заявки"}
            </Button>
            
            <Button 
              variant={currentTab === "users" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("users")}
              className="w-full justify-start"
            >
              <Users className="mr-2 h-4 w-4" />
              {language === 'en' ? "Users" : "Пользователи"}
            </Button>
            
            <Button 
              variant={currentTab === "transactions" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("transactions")}
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              {language === 'en' ? "Transactions" : "Транзакции"}
            </Button>
            
            <Button 
              variant={currentTab === "settings" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("settings")}
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              {language === 'en' ? "Settings" : "Настройки"}
            </Button>
            
            <Button 
              variant={currentTab === "social" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("social")}
              className="w-full justify-start"
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              {language === 'en' ? "Social Links" : "Социальные ссылки"}
            </Button>
            
            <Button 
              variant={currentTab === "webhooks" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("webhooks")}
              className="w-full justify-start"
            >
              <Globe className="mr-2 h-4 w-4" />
              {language === 'en' ? "Webhooks" : "Вебхуки"}
            </Button>
          </nav>
          
          <div className="mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {language === 'en' ? "Logout" : "Выйти"}
            </Button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 ${isSidebarOpen ? "lg:ml-64" : ""}`}>
        <header className="bg-card shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden" 
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? <X /> : <Menu />}
              </Button>
              <h1 className="text-xl font-semibold ml-2">
                {language === 'en' ? currentTab.charAt(0).toUpperCase() + currentTab.slice(1) : 
                 currentTab === "dashboard" ? "Дашборд" :
                 currentTab === "articles" ? "Статьи" :
                 currentTab === "requests" ? "Заявки" :
                 currentTab === "users" ? "Пользователи" :
                 currentTab === "transactions" ? "Транзакции" :
                 currentTab === "settings" ? "Настройки" :
                 currentTab === "social" ? "Социальные ссылки" :
                 currentTab === "webhooks" ? "Вебхуки" : ""}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={language === 'en' ? "Search..." : "Поиск..."}
                  className="pl-8 w-64 md:w-80 h-9"
                />
              </div>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4">
          {/* Dashboard Tab */}
          {currentTab === "dashboard" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'en' ? "Total Users" : "Всего пользователей"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">{language === 'en' ? "+12% from last month" : "+12% с прошлого месяца"}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'en' ? "Revenue" : "Доход"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">{language === 'en' ? "+5.2% from last month" : "+5.2% с прошлого месяца"}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'en' ? "Active Subscriptions" : "Активные подписки"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">892</div>
                  <p className="text-xs text-muted-foreground">{language === 'en' ? "+3.1% from last month" : "+3.1% с прошлого месяца"}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{language === 'en' ? "Support Tickets" : "Заявки в поддержку"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">{language === 'en' ? "-8% from last month" : "-8% с прошлого месяца"}</p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>{language === 'en' ? "Recent Activity" : "Последние действия"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm">{language === 'en' ? "New user" : "Новый пользователь"} <span className="font-medium">John Doe</span> {language === 'en' ? "registered" : "зарегистрирован"}</p>
                      <span className="ml-auto text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <p className="text-sm">{language === 'en' ? "Payment of" : "Оплата"} <span className="font-medium">$1,299</span> {language === 'en' ? "received" : "получена"}</p>
                      <span className="ml-auto text-xs text-muted-foreground">6 hours ago</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      <p className="text-sm">{language === 'en' ? "Support ticket" : "Заявка в поддержку"} <span className="font-medium">#45678</span> {language === 'en' ? "opened" : "открыта"}</p>
                      <span className="ml-auto text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <p className="text-sm">{language === 'en' ? "New feature" : "Новая функция"} <span className="font-medium">Mobile App</span> {language === 'en' ? "deployed" : "развернута"}</p>
                      <span className="ml-auto text-xs text-muted-foreground">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Articles Tab */}
          {currentTab === "articles" && (
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
                      <FormField
                        control={articleForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{language === 'en' ? "Content" : "Содержание"}</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={language === 'en' ? "Article content" : "Содержание статьи"} 
                                className="min-h-[200px]"
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
                  <CardTitle>{language === 'en' ? "Articles" : "Статьи"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'en' ? "Title" : "Заголовок"}</TableHead>
                          <TableHead>{language === 'en' ? "Category" : "Категория"}</TableHead>
                          <TableHead>{language === 'en' ? "Status" : "Статус"}</TableHead>
                          <TableHead>{language === 'en' ? "Date" : "Дата"}</TableHead>
                          <TableHead>{language === 'en' ? "Actions" : "Действия"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {articles.map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">{article.title}</TableCell>
                            <TableCell>{article.category}</TableCell>
                            <TableCell>
                              <Badge className={article.published ? "bg-green-500" : "bg-yellow-500"}>
                                {article.published ? (language === 'en' ? "Published" : "Опубликовано") : (language === 'en' ? "Draft" : "Черновик")}
                              </Badge>
                            </TableCell>
                            <TableCell>{article.date}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditArticle(article)}
                                >
                                  {language === 'en' ? "Edit" : "Редактировать"}
                                </Button>
