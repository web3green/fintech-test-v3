import { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, BarChart3, Settings, 
  Bell, Search, Menu, X, LogOut, MessageSquare,
  Newspaper, Send, Link as LinkIcon, Globe, Webhook, Type, LayoutDashboard, Loader2
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription 
} from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Table, TableHeader, TableBody, TableFooter, 
  TableHead, TableRow, TableCell, TableCaption 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { BlogAdminPanel } from "@/components/admin/BlogAdminPanel";
import { ArticlesPanel } from "@/components/admin/ArticlesPanel";
import { DashboardPanel } from "@/components/admin/DashboardPanel";
import { WebhookPanel } from "@/components/admin/WebhookPanel";
import { RequestsPanel } from "@/components/admin/RequestsPanel";
import { SocialLinksPanel } from "@/components/admin/SocialLinksPanel";
import { SiteTextsPanel } from "@/components/admin/SiteTextsPanel";
import { toast } from "sonner";
import { Sidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ErrorBoundary";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Admin = () => {
  const navigate = useNavigate();
  const { language, isLoading } = useLanguage();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [currentTab, setCurrentTab] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === "true") {
      setIsAuthenticated(true);
    }
  }, [navigate]);

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

  const handleLogin = (data) => {
    if (data.username === "admin" && data.password === "password") {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("admin_token", "admin-token-123");
      setIsAuthenticated(true);
      toast.success(language === 'en' ? "Logged in successfully" : "Успешный вход");
    } else {
      toast.error(language === 'en' ? "Invalid credentials" : "Неверные учетные данные");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    toast.success(language === 'en' ? "Logged out successfully" : "Успешный выход");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fintech-blue mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 rounded-full bg-fintech-blue flex items-center justify-center text-white font-bold text-lg">
                FA
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              {language === 'en' ? "Admin Login" : "Вход в панель администратора"}
            </CardTitle>
            <CardDescription className="text-center">
              {language === 'en' ? "Enter your credentials to access the admin panel" : "Введите учетные данные для доступа к панели администратора"}
            </CardDescription>
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
                <Button type="submit" className="w-full mt-6 bg-fintech-blue hover:bg-fintech-blue-light">
                  {language === 'en' ? "Sign In" : "Войти"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="ghost" onClick={() => navigate('/')}>
              {language === 'en' ? "Back to Website" : "Вернуться на сайт"}
            </Button>
          </CardFooter>
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
              variant={currentTab === "blog" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("blog")}
              className="w-full justify-start"
            >
              <Newspaper className="mr-2 h-4 w-4" />
              {language === 'en' ? "Blog" : "Блог"}
            </Button>
            
            <Button 
              variant={currentTab === "articles" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("articles")}
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
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
              <Webhook className="mr-2 h-4 w-4" />
              {language === 'en' ? "Webhooks" : "Вебхуки"}
            </Button>
            
            <Button 
              variant={currentTab === "texts" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("texts")}
              className="w-full justify-start"
            >
              <Type className="mr-2 h-4 w-4" />
              {language === 'en' ? "Site Texts" : "Тексты сайта"}
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
                 currentTab === "blog" ? "Блог" :
                 currentTab === "articles" ? "Статьи" :
                 currentTab === "requests" ? "Заявки" :
                 currentTab === "settings" ? "Настройки" :
                 currentTab === "social" ? "Социальные ссылки" :
                 currentTab === "webhooks" ? "Вебхуки" :
                 currentTab === "texts" ? "Тексты сайта" : ""}
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

        <main className="flex-1 space-y-4 p-8 pt-6">
          <ErrorBoundary>
            {currentTab === 'dashboard' && (
              <Suspense fallback={<div className="p-4 text-center">Загрузка панели...</div>}>
                {typeof DashboardPanel === 'function' ? (
                  <DashboardPanel />
                ) : (
                  <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                      Компонент панели недоступен
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Панель управления не может быть загружена. Возможно, отсутствуют необходимые модули.
                    </p>
                    <div className="mt-4">
                      <Button 
                        onClick={() => setCurrentTab('blog')}
                        variant="outline"
                        className="mr-2"
                      >
                        Перейти к управлению блогом
                      </Button>
                    </div>
                  </div>
                )}
              </Suspense>
            )}
            {currentTab === 'blog' && <BlogAdminPanel />}
            {currentTab === 'articles' && <ArticlesPanel />}
            {currentTab === 'requests' && <RequestsPanel />}
            {currentTab === 'social' && <SocialLinksPanel />}
            {currentTab === 'webhooks' && <WebhookPanel />}
            {currentTab === 'texts' && <SiteTextsPanel />}
            {currentTab === 'settings' && (
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'en' ? "General Settings" : "Общие настройки"}</CardTitle>
                    <CardDescription>
                      {language === 'en' ? "Manage your site settings" : "Управление настройками сайта"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{language === 'en' ? "Manage your general site settings here." : "Управляйте общими настройками сайта здесь."}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default Admin;
