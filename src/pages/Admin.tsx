import { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, Settings, 
  Bell, Search, Menu, X, LogOut, MessageSquare,
  Newspaper, Send, Link as LinkIcon, Globe, Webhook, Type, Loader2
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
import { BlogManagementPanel } from "@/components/admin/BlogManagementPanel";
import { WebhookPanel } from "@/components/admin/WebhookPanel";
import { RequestsPanel } from "@/components/admin/RequestsPanel";
import { SocialLinksPanel } from "@/components/admin/SocialLinksPanel";
import { SiteTextsPanel } from "@/components/admin/SiteTextsPanel";
import { toast } from "sonner";
import { Sidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { authenticateAdmin } from "@/services/adminService";

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
  const [currentTab, setCurrentTab] = useState("blog");

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

  const handleLogin = async (data) => {
    try {
      // Проверяем учетные данные через Supabase
      const result = await authenticateAdmin(data.username, data.password);
      
      if (result.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("admin_token", "admin-token-123");
        localStorage.setItem("admin_id", result.data.id);
        setIsAuthenticated(true);
        toast.success(language === 'en' ? "Logged in successfully" : "Успешный вход");
      } else {
        toast.error(language === 'en' ? "Invalid credentials" : "Неверные учетные данные");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(language === 'en' ? "An error occurred during login" : "Произошла ошибка при входе");
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
              variant={currentTab === "blog" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("blog")}
              className="w-full justify-start"
            >
              <Newspaper className="mr-2 h-4 w-4" />
              {language === 'en' ? "Blog" : "Блог"}
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
              variant={currentTab === "webhooks" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("webhooks")}
              className="w-full justify-start"
            >
              <Webhook className="mr-2 h-4 w-4" />
              {language === 'en' ? "Webhooks" : "Вебхуки"}
            </Button>
            
            <Button 
              variant={currentTab === "social" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("social")}
              className="w-full justify-start"
            >
              <Globe className="mr-2 h-4 w-4" />
              {language === 'en' ? "Social Links" : "Соц. сети"}
            </Button>
            
            <Button 
              variant={currentTab === "texts" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("texts")}
              className="w-full justify-start"
            >
              <Type className="mr-2 h-4 w-4" />
              {language === 'en' ? "Site Texts" : "Тексты сайта"}
            </Button>
            
            <Button 
              variant={currentTab === "settings" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("settings")}
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              {language === 'en' ? "Settings" : "Настройки"}
            </Button>
          </nav>
          
          <div className="mt-auto">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {language === 'en' ? "Logout" : "Выйти"}
            </Button>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      }`}>
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={language === 'en' ? "Search..." : "Поиск..."}
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <ErrorBoundary>
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-fintech-blue" />
              </div>
            }>
              {currentTab === "blog" && <BlogManagementPanel />}
              {currentTab === "requests" && <RequestsPanel />}
              {currentTab === "webhooks" && <WebhookPanel />}
              {currentTab === "social" && <SocialLinksPanel />}
              {currentTab === "texts" && <SiteTextsPanel />}
              {currentTab === "settings" && <SettingsPanel />}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default Admin;
