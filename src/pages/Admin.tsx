import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, FileText, BarChart3, Settings, 
  Bell, Search, Menu, X, LogOut, MessageSquare,
  Newspaper, Send
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

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("webhookUrl") || "";
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
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setIsAuthenticated(true);
    }
  }, [navigate]);

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

  const handleLogin = (data) => {
    if (data.username === "admin" && data.password === "password") {
      localStorage.setItem("isAdmin", "true");
      setIsAuthenticated(true);
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
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
      toast.success("Article updated successfully");
    } else {
      const newArticle = {
        id: articles.length ? Math.max(...articles.map(a => a.id)) + 1 : 1,
        ...data,
        date: new Date().toISOString().split('T')[0]
      };
      setArticles([...articles, newArticle]);
      toast.success("Article created successfully");
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
    toast.success("Article deleted successfully");
  };

  const handleRequestSubmit = (data) => {
    if (selectedRequest) {
      const updatedRequests = requests.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, ...data }
          : request
      );
      setRequests(updatedRequests);
      toast.success("Request updated successfully");
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
    toast.success("Webhook URL saved successfully");
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL first");
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
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
      
      toast.success("Webhook test sent");
    } catch (error) {
      console.error("Webhook test error:", error);
      toast.error("Failed to test webhook");
    }
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
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
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
              Dashboard
            </Button>
            
            <Button 
              variant={currentTab === "articles" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("articles")}
              className="w-full justify-start"
            >
              <Newspaper className="mr-2 h-4 w-4" />
              Articles
            </Button>
            
            <Button 
              variant={currentTab === "requests" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("requests")}
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Requests
            </Button>
            
            <Button 
              variant={currentTab === "users" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("users")}
              className="w-full justify-start"
            >
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            
            <Button 
              variant={currentTab === "transactions" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("transactions")}
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              Transactions
            </Button>
            
            <Button 
              variant={currentTab === "settings" ? "default" : "ghost"} 
              onClick={() => setCurrentTab("settings")}
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
          
          <div className="mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
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
                {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
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
          {currentTab === "dashboard" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">892</div>
                  <p className="text-xs text-muted-foreground">+3.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">-8% from last month</p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm">New user <span className="font-medium">John Doe</span> registered</p>
                      <span className="ml-auto text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <p className="text-sm">Payment of <span className="font-medium">$1,299</span> received</p>
                      <span className="ml-auto text-xs text-muted-foreground">6 hours ago</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      <p className="text-sm">Support ticket <span className="font-medium">#45678</span> opened</p>
                      <span className="ml-auto text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <p className="text-sm">New feature <span className="font-medium">Mobile App</span> deployed</p>
                      <span className="ml-auto text-xs text-muted-foreground">2 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTab === "articles" && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedArticle ? "Edit Article" : "Create New Article"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...articleForm}>
                    <form onSubmit={articleForm.handleSubmit(handleArticleSubmit)} className="space-y-4">
                      <FormField
                        control={articleForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Article title" {...field} />
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
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="Article category" {...field} />
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
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Article content" 
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
                              <FormLabel>Published</FormLabel>
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
                          Cancel
                        </Button>
                        <Button type="submit">
                          {selectedArticle ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {articles.map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">{article.title}</TableCell>
                            <TableCell>{article.category}</TableCell>
                            <TableCell>
                              <Badge className={article.published ? "bg-green-500" : "bg-yellow-500"}>
                                {article.published ? "Published" : "Draft"}
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
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteArticle(article.id)}
                                >
                                  Delete
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
          )}

          {currentTab === "requests" && (
            <div className="grid gap-4 md:grid-cols-2">
              {selectedRequest && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...requestForm}>
                      <form onSubmit={requestForm.handleSubmit(handleRequestSubmit)} className="space-y-4">
                        <FormField
                          control={requestForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input readOnly {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={requestForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input readOnly {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={requestForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  readOnly 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={requestForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <select
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value="new">New</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(null);
                              requestForm.reset();
                            }}
                          >
                            Close
                          </Button>
                          <Button 
                            type="submit"
                            onClick={() => {
                              if (webhookUrl) {
                                fetch(webhookUrl, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  mode: "no-cors",
                                  body: JSON.stringify({
                                    event: "request_status_updated",
                                    requestId: selectedRequest.id,
                                    status: requestForm.getValues("status"),
                                    timestamp: new Date().toISOString()
                                  }),
                                }).catch(console.error);
                              }
                            }}
                          >
                            Update Status
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}

              <Card className={selectedRequest ? "md:col-span-1" : "md:col-span-2"}>
                <CardHeader>
                  <CardTitle>Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.name}</TableCell>
                            <TableCell>{request.email}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{request.date}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewRequest(request)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentTab === "users" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Users</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Add User</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label htmlFor="name">Name</label>
                          <Input id="name" placeholder="Enter name" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="email">Email</label>
                          <Input id="email" type="email" placeholder="Enter email" />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="role">Role</label>
                          <Input id="role" placeholder="Enter role" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="active" />
                          <label htmlFor="active">Active</label>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => toast.success("User added successfully")}>Save User</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{user.role}</td>
                          <td className="p-2">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  setUsers(users.filter(u => u.id !== user.id));
                                  toast.success("User deleted successfully");
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === "transactions" && (
            <Card>
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{transaction.user}</td>
                          <td className="p-2">${transaction.amount.toFixed(2)}</td>
                          <td className="p-2">{transaction.date}</td>
                          <td className="p-2">
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  setTransactions(transactions.filter(t => t.id !== transaction.id));
                                  toast.success("Transaction deleted successfully");
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {currentTab === "settings" && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="site-name">Site Name</label>
                    <Input id="site-name" defaultValue="Fintech Assist" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="site-description">Site Description</label>
                    <Input id="site-description" defaultValue="Admin Dashboard" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="contact-email">Contact Email</label>
                    <Input id="contact-email" type="email" defaultValue="admin@fintechassist.com" className="mt-1" />
                  </div>
                  <Button onClick={() => toast.success("Settings saved successfully")}>Save Settings</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Integration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...webhookForm}>
                    <form onSubmit={webhookForm.handleSubmit(handleWebhookSubmit)} className="space-y-4">
                      <FormField
                        control={webhookForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Webhook URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://your-webhook-url.com" 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setWebhookUrl(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between">
                        <Button type="submit">Save Webhook</Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleTestWebhook}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Test Webhook
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="2fa" />
                    <label htmlFor="2fa">Enable Two-Factor Authentication</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="session-timeout" defaultChecked />
                    <label htmlFor="session-timeout">Enable Session Timeout</label>
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="session-length">Session Length (minutes)</label>
                    <Input id="session-length" type="number" defaultValue="30" className="mt-1" />
                  </div>
                  <Button onClick={() => toast.success("Security settings saved")}>Update Security</Button>
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
