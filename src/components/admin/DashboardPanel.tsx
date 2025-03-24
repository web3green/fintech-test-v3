
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageContext";

// Sample data for demonstration
const visitData = [
  { name: "Jan", Visits: 4000, NewUsers: 2400 },
  { name: "Feb", Visits: 3000, NewUsers: 1398 },
  { name: "Mar", Visits: 2000, NewUsers: 9800 },
  { name: "Apr", Visits: 2780, NewUsers: 3908 },
  { name: "May", Visits: 1890, NewUsers: 4800 },
  { name: "Jun", Visits: 2390, NewUsers: 3800 },
  { name: "Jul", Visits: 3490, NewUsers: 4300 },
];

const bounceRateData = [
  { name: "Jan", rate: 45 },
  { name: "Feb", rate: 52 },
  { name: "Mar", rate: 49 },
  { name: "Apr", rate: 47 },
  { name: "May", rate: 43 },
  { name: "Jun", rate: 41 },
  { name: "Jul", rate: 39 },
];

export const DashboardPanel = () => {
  const { language } = useLanguage();
  const [analyticsConnected, setAnalyticsConnected] = useState(() => {
    return localStorage.getItem("analyticsConnected") === "true";
  });
  
  const toggleAnalyticsConnection = () => {
    const newState = !analyticsConnected;
    setAnalyticsConnected(newState);
    localStorage.setItem("analyticsConnected", newState.toString());
  };

  return (
    <div className="space-y-4">
      {!analyticsConnected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'en' ? "Analytics Not Connected" : "Аналитика не подключена"}
          </AlertTitle>
          <AlertDescription>
            {language === 'en' 
              ? "Connect your Google Analytics and Yandex Metrica accounts to see analytics data here." 
              : "Подключите свои аккаунты Google Analytics и Яндекс.Метрику, чтобы видеть данные аналитики здесь."}
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={toggleAnalyticsConnection}
          >
            {language === 'en' ? "Connect Analytics" : "Подключить аналитику"}
          </Button>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{language === 'en' ? "Total Visits" : "Всего посещений"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,589</div>
            <p className="text-xs text-muted-foreground">{language === 'en' ? "+12% from last month" : "+12% с прошлого месяца"}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{language === 'en' ? "Unique Visitors" : "Уникальные посетители"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,472</div>
            <p className="text-xs text-muted-foreground">{language === 'en' ? "+8.2% from last month" : "+8.2% с прошлого месяца"}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{language === 'en' ? "Bounce Rate" : "Показатель отказов"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.3%</div>
            <p className="text-xs text-muted-foreground">{language === 'en' ? "-2.1% from last month" : "-2.1% с прошлого месяца"}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{language === 'en' ? "Avg. Session" : "Сред. сессия"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2:15</div>
            <p className="text-xs text-muted-foreground">{language === 'en' ? "+0:12 from last month" : "+0:12 с прошлого месяца"}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic">
        <TabsList className="mb-4">
          <TabsTrigger value="traffic">{language === 'en' ? "Traffic" : "Трафик"}</TabsTrigger>
          <TabsTrigger value="engagement">{language === 'en' ? "Engagement" : "Вовлеченность"}</TabsTrigger>
          <TabsTrigger value="sources">{language === 'en' ? "Traffic Sources" : "Источники трафика"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Website Traffic" : "Трафик сайта"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={visitData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Visits" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="NewUsers" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Bounce Rate" : "Показатель отказов"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bounceRateData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: .5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" fill="#FF7D05" name={language === 'en' ? "Bounce Rate %" : "Показатель отказов %"} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Traffic Sources" : "Источники трафика"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { name: "Google", value: 34 },
                      { name: "Direct", value: 25 },
                      { name: "Yandex", value: 18 },
                      { name: "Social", value: 15 },
                      { name: "Referral", value: 8 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 50,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3366FF" name={language === 'en' ? "Percentage" : "Процент"} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
