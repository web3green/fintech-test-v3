
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, FileText, BarChart3, Settings, 
  Bell, Search, Menu, X, LogOut 
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Mocked data - in a real app this would come from an API
  const [users, setUsers] = useState([
    { id: 1, name: "Alex Johnson", email: "alex@example.com", status: "active", role: "User" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", status: "pending", role: "Admin" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", status: "inactive", role: "User" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", status: "active", role: "Manager" },
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, user: "Alex Johnson", amount: 1250, date: "2023-05-12", status: "completed" },
    { id: 2, user: "Sarah Smith", amount: 845, date: "2023-05-11", status: "pending" },
    { id: 3, user: "Michael Brown", amount: 1650, date: "2023-05-10", status: "completed" },
    { id: 4, user: "Emily Davis", amount: 520, date: "2023-05-09", status: "failed" },
  ]);

  // Authentication check (in a real app this would check for admin rights)
  useEffect(() => {
    // Simulating an auth check - uncomment in real implementation
    // const isAdmin = localStorage.getItem("isAdmin");
    // if (!isAdmin) {
    //   navigate("/");
    //   toast.error("Access denied. Admin permissions required.");
    // }
  }, [navigate]);

  const handleLogout = () => {
    // In a real app, this would clear auth tokens/state
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "inactive":
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className={`flex-1 ${isSidebarOpen ? "lg:ml-64" : ""}`}>
        {/* Header */}
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

        {/* Dashboard content */}
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
