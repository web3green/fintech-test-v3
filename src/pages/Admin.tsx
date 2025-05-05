import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText,
  Bell, Search, Menu, X, LogOut, MessageSquare,
  Newspaper, Send, Link as LinkIcon, Globe, Webhook, Type, Loader2, Brain, Briefcase, Languages, MailCheck, LayoutDashboard
} from "lucide-react";
import Logo from "@/components/Logo";
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
import { WebhookPanel } from "@/components/admin/WebhookPanel";
import { RequestsPanel } from "@/components/admin/RequestsPanel";
import { SocialLinksPanel } from "@/components/admin/SocialLinksPanel";
import { SiteTextsPanel } from "@/components/admin/SiteTextsPanel";
import { toast } from "sonner";
import { Sidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/lib/supabase";
import { BlogManagementPanel } from '@/components/admin/BlogManagementPanel';

// Dynamically import other panels
const ChatbotResponsesPanel = lazy(() => 
  import("@/components/admin/ChatbotResponsesPanel").then(module => ({ default: module.ChatbotResponsesPanel }))
);

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Define tab structure (Removed Dashboard)
const adminTabs = [
  // Removed Dashboard entry
  {
    id: 'blog',
    label: 'Blog Posts',
    labelRu: 'Посты блога',
    icon: Newspaper,
    component: BlogManagementPanel
  },
  {
    id: 'requests',
    label: 'Requests',
    labelRu: 'Заявки',
    icon: MessageSquare,
    component: RequestsPanel
  },
  {
    id: 'social_links',
    label: 'Social Links',
    labelRu: 'Соцсети',
    icon: LinkIcon,
    component: SocialLinksPanel
  },
  {
    id: 'site_texts',
    label: 'Site Texts',
    labelRu: 'Тексты сайта',
    icon: FileText,
    component: SiteTextsPanel
  },
  { id: 'webhooks', labelKey: 'admin.tabs.webhooks', component: WebhookPanel, icon: Webhook },
  { id: 'chatbot', labelKey: 'admin.tabs.chatbot', component: ChatbotResponsesPanel, icon: Brain },
];

const Admin = () => {
  const navigate = useNavigate();
  const { language, isLoading } = useLanguage();
  const isMobile = useIsMobile();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [currentTab, setCurrentTab] = useState('site_texts');

  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[Admin Auth Check] Initial session:', session);
      setSession(session);
      setAuthLoading(false);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`[Admin Auth Listener] Event: ${_event}, Session:`, session);
      setSession(session);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    loginForm.reset();
    try {
      console.log(`[handleLogin] Attempting Supabase sign in with email: ${data.email}`);
      const { data: loginData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('Supabase login error:', error);
        toast.error(error.message || (language === 'en' ? "Invalid credentials or error occurred" : "Неверные учетные данные или произошла ошибка"));
      } else if (loginData.session) {
        console.log('[handleLogin] Supabase login successful, session:', loginData.session);
        toast.success(language === 'en' ? "Logged in successfully" : "Успешный вход");
      } else {
          toast.error(language === 'en' ? "Login failed. No session received." : "Ошибка входа. Сессия не получена.");
      }
    } catch (error: any) {
      console.error('Login error (catch block):', error);
      toast.error(error.message || (language === 'en' ? "An error occurred during login" : "Произошла ошибка при входе"));
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase logout error:', error);
      toast.error(language === 'en' ? "Logout failed" : "Ошибка выхода");
    } else {
      toast.success(language === 'en' ? "Logged out successfully" : "Успешный выход");
      navigate("/");
    }
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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fintech-blue mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!session) {
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? "Email" : "Email"}</FormLabel>
                      <FormControl>
                        <Input placeholder={language === 'en' ? "Enter email" : "Введите email"} {...field} />
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

  // Log the adminTabs array right before rendering
  console.log('Admin Tabs:', adminTabs);

  const ActiveComponent = adminTabs.find(tab => tab.id === currentTab)?.component;

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
            {adminTabs.map(tab => (
            <Button 
                key={tab.id}
                variant={currentTab === tab.id ? "default" : "ghost"} 
                onClick={() => setCurrentTab(tab.id)}
              className="w-full justify-start"
            >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.labelKey?.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() ?? tab.id}
            </Button>
            ))}
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

      <main className={cn("flex-1 transition-all duration-300", isMobile ? "mt-16" : "lg:ml-64")} >
        {/* Mobile Header */} 
        {isMobile && (
          <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b flex items-center justify-between px-4 z-30">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
            <div className="font-bold text-lg">
               <span className="text-fintech-blue">Admin</span>
        </div>
             <Button variant="ghost" size="icon" onClick={handleLogout}>
               <LogOut className="h-5 w-5" />
            </Button>
          </header>
        )}
        
        <div className="p-4 lg:p-6"> 
          <ErrorBoundary fallback={<div>Error loading panel.</div>}>
            <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-fintech-blue" /></div>}>
              {ActiveComponent && <ActiveComponent />}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default Admin;
