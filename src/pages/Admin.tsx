
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, FileText, BarChart3, Settings, 
  Bell, Search, Menu, X, LogOut, MessageSquare,
  Newspaper, Send, Link as LinkIcon, Globe, Webhook
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
import { toast } from "sonner";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const Admin = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [currentTab, setCurrentTab] = useState("dashboard");

  const [users, setUsers] = useState([
    { id: 1, name: "Alex Johnson", email: "alex@example.com", status: "active", role: "User" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", status: "pending", role: "Admin" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", status: "inactive", role: "User" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", status: "active", role: "Manager" },
  ]);

  // Removing the transactions state as it's no longer needed

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
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
              variant={currentTab === "users" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("users")}
              className="w-full justify-start"
            >
              <Users className="mr-2 h-4 w-4" />
              {language === 'en' ? "Users" : "Пользователи"}
            </Button>
            
            {/* Removed the transactions button */}
            
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
                 currentTab === "users" ? "Пользователи" :
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
          {currentTab === "blog" && <BlogAdminPanel />}
          {currentTab === "dashboard" && <DashboardPanel />}
          {currentTab === "articles" && <ArticlesPanel />}
          {currentTab === "webhooks" && <WebhookPanel />}
          {currentTab === "requests" && <RequestsPanel />}
          
          {currentTab === "users" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'en' ? "Users" : "Пользователи"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'en' ? "Name" : "Имя"}</TableHead>
                        <TableHead>{language === 'en' ? "Email" : "Email"}</TableHead>
                        <TableHead>{language === 'en' ? "Status" : "Статус"}</TableHead>
                        <TableHead>{language === 'en' ? "Role" : "Роль"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Removed the transactions content section */}
          
          {currentTab === "settings" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'en' ? "Settings" : "Настройки"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{language === 'en' ? "Here you can manage your settings." : "Здесь вы можете управлять своими настройками."}</p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {currentTab === "social" && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'en' ? "Social Links" : "Социальные ссылки"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{language === 'en' ? "Manage your social media links here." : "Управляйте своими ссылками на социальные сети здесь."}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
