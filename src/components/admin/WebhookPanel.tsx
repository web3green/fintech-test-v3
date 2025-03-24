import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, Send, Globe, Webhook } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const webhookSchema = z.object({
  url: z.string().url({ message: "Invalid webhook URL" }),
});

const pixelSchema = z.object({
  provider: z.string().min(1, { message: "Provider is required" }),
  trackingId: z.string().min(1, { message: "Tracking ID is required" }),
  active: z.boolean().default(true),
});

const telegramSchema = z.object({
  botToken: z.string().min(1, { message: "Bot token is required" }),
  chatId: z.string().min(1, { message: "Chat ID is required" }),
});

const whatsappSchema = z.object({
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  apiKey: z.string().min(1, { message: "API key is required" }),
});

export const WebhookPanel = () => {
  const { language } = useLanguage();
  
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("webhookUrl") || "";
  });
  
  const [pixels, setPixels] = useState(() => {
    const storedPixels = localStorage.getItem("trackingPixels");
    return storedPixels ? JSON.parse(storedPixels) : [
      { id: 1, provider: "Google Analytics", trackingId: "UA-123456789-1", active: true },
      { id: 2, provider: "Yandex Metrica", trackingId: "87654321", active: false },
      { id: 3, provider: "Facebook Pixel", trackingId: "123456789101112", active: true },
    ];
  });
  
  const [telegramConfig, setTelegramConfig] = useState(() => {
    const stored = localStorage.getItem("telegramConfig");
    return stored ? JSON.parse(stored) : { botToken: "", chatId: "" };
  });
  
  const [whatsappConfig, setWhatsappConfig] = useState(() => {
    const stored = localStorage.getItem("whatsappConfig");
    return stored ? JSON.parse(stored) : { phoneNumber: "", apiKey: "" };
  });
  
  useEffect(() => {
    localStorage.setItem("webhookUrl", webhookUrl);
  }, [webhookUrl]);
  
  useEffect(() => {
    localStorage.setItem("trackingPixels", JSON.stringify(pixels));
  }, [pixels]);
  
  useEffect(() => {
    localStorage.setItem("telegramConfig", JSON.stringify(telegramConfig));
  }, [telegramConfig]);
  
  useEffect(() => {
    localStorage.setItem("whatsappConfig", JSON.stringify(whatsappConfig));
  }, [whatsappConfig]);

  const webhookForm = useForm({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      url: webhookUrl,
    },
  });
  
  const pixelForm = useForm({
    resolver: zodResolver(pixelSchema),
    defaultValues: {
      provider: "",
      trackingId: "",
      active: true,
    },
  });
  
  const telegramForm = useForm({
    resolver: zodResolver(telegramSchema),
    defaultValues: {
      botToken: telegramConfig.botToken,
      chatId: telegramConfig.chatId,
    },
  });
  
  const whatsappForm = useForm({
    resolver: zodResolver(whatsappSchema),
    defaultValues: {
      phoneNumber: whatsappConfig.phoneNumber,
      apiKey: whatsappConfig.apiKey,
    },
  });

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
  
  const handlePixelSubmit = (data) => {
    const newPixel = {
      id: pixels.length ? Math.max(...pixels.map(p => p.id)) + 1 : 1,
      ...data,
    };
    setPixels([...pixels, newPixel]);
    pixelForm.reset({
      provider: "",
      trackingId: "",
      active: true,
    });
    toast.success(language === 'en' ? "Tracking pixel added successfully" : "Пиксель отслеживания успешно добавлен");
  };
  
  const handlePixelToggle = (id, active) => {
    const updatedPixels = pixels.map(pixel => 
      pixel.id === id ? { ...pixel, active } : pixel
    );
    setPixels(updatedPixels);
    toast.success(
      active 
        ? (language === 'en' ? "Tracking pixel activated" : "Пиксель отслеживания активирован") 
        : (language === 'en' ? "Tracking pixel deactivated" : "Пиксель отслеживания деактивирован")
    );
  };
  
  const handlePixelDelete = (id) => {
    setPixels(pixels.filter(pixel => pixel.id !== id));
    toast.success(language === 'en' ? "Tracking pixel deleted" : "Пиксель отслеживания удален");
  };
  
  const handleTelegramSubmit = (data) => {
    setTelegramConfig(data);
    toast.success(language === 'en' ? "Telegram integration saved" : "Интеграция с Telegram сохранена");
  };
  
  const handleTestTelegram = async () => {
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      toast.error(language === 'en' ? "Please enter bot token and chat ID first" : "Сначала введите токен бота и ID чата");
      return;
    }
    
    toast.success(language === 'en' ? "Telegram integration test sent" : "Тест интеграции с Telegram отправлен");
    // In a real app, here you would make API call to send a test message
  };
  
  const handleWhatsappSubmit = (data) => {
    setWhatsappConfig(data);
    toast.success(language === 'en' ? "WhatsApp integration saved" : "Интеграция с WhatsApp сохранена");
  };
  
  const handleTestWhatsapp = async () => {
    if (!whatsappConfig.phoneNumber || !whatsappConfig.apiKey) {
      toast.error(language === 'en' ? "Please enter phone number and API key first" : "Сначала введите номер телефона и API ключ");
      return;
    }
    
    toast.success(language === 'en' ? "WhatsApp integration test sent" : "Тест интеграции с WhatsApp отправлен");
    // In a real app, here you would make API call to send a test message
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pixels">
        <TabsList>
          <TabsTrigger value="pixels">{language === 'en' ? "Tracking Pixels" : "Пиксели отслеживания"}</TabsTrigger>
          <TabsTrigger value="webhooks">{language === 'en' ? "Webhooks" : "Вебхуки"}</TabsTrigger>
          <TabsTrigger value="telegram">{language === 'en' ? "Telegram Integration" : "Интеграция с Telegram"}</TabsTrigger>
          <TabsTrigger value="whatsapp">{language === 'en' ? "WhatsApp Integration" : "Интеграция с WhatsApp"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pixels" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Add Tracking Pixel" : "Добавить пиксель отслеживания"}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? "Add analytics and tracking pixels to your website" 
                  : "Добавьте пиксели аналитики и отслеживания на ваш сайт"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...pixelForm}>
                <form onSubmit={pixelForm.handleSubmit(handlePixelSubmit)} className="space-y-4">
                  <FormField
                    control={pixelForm.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? "Provider" : "Провайдер"}</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'en' ? "Select provider" : "Выберите провайдера"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Google Analytics">Google Analytics</SelectItem>
                              <SelectItem value="Yandex Metrica">Yandex Metrica</SelectItem>
                              <SelectItem value="Facebook Pixel">Facebook Pixel</SelectItem>
                              <SelectItem value="Google Tag Manager">Google Tag Manager</SelectItem>
                              <SelectItem value="HotJar">HotJar</SelectItem>
                              <SelectItem value="Custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pixelForm.control}
                    name="trackingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? "Tracking ID" : "ID отслеживания"}</FormLabel>
                        <FormControl>
                          <Input placeholder={language === 'en' ? "Enter tracking ID" : "Введите ID отслеживания"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pixelForm.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>
                            {language === 'en' ? "Active" : "Активен"}
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    {language === 'en' ? "Add Pixel" : "Добавить пиксель"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Tracking Pixels" : "Пиксели отслеживания"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pixels.length > 0 ? (
                  pixels.map((pixel) => (
                    <div 
                      key={pixel.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{pixel.provider}</p>
                        <p className="text-sm text-muted-foreground">{pixel.trackingId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-500">
                          {pixel.active 
                            ? (language === 'en' ? "Active" : "Активен") 
                            : (language === 'en' ? "Inactive" : "Неактивен")}
                        </Badge>
                        <Switch 
                          checked={pixel.active} 
                          onCheckedChange={(checked) => handlePixelToggle(pixel.id, checked)} 
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handlePixelDelete(pixel.id)}
                        >
                          {language === 'en' ? "Delete" : "Удалить"}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {language === 'en' ? "No tracking pixels added yet" : "Пиксели отслеживания еще не добавлены"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Webhooks Configuration" : "Настройка вебхуков"}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? "Set up webhooks to connect with other services" 
                  : "Настройте вебхуки для соединения с другими сервисами"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...webhookForm}>
                <form onSubmit={webhookForm.handleSubmit(handleWebhookSubmit)} className="space-y-4">
                  <FormField
                    control={webhookForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? "Webhook URL" : "URL вебхука"}</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/webhook" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {language === 'en' ? "Save Webhook" : "Сохранить вебхук"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleTestWebhook}>
                      {language === 'en' ? "Test Webhook" : "Тест вебхука"}
                    </Button>
                  </div>
                </form>
              </Form>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? "Sample Webhook Payload:" : "Пример полезной нагрузки вебхука:"}
                </h3>
                <div className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                  <pre>
{`{
  "event": "form_submission",
  "timestamp": "${new Date().toISOString()}",
  "data": {
    "name": "Example User",
    "email": "user@example.com",
    "message": "This is a sample message"
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="telegram" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Telegram Bot Integration" : "Интеграция с ботом Telegram"}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? "Connect a Telegram bot to receive inquiries directly in your Telegram chat" 
                  : "Подключите бота Telegram для получения запросов прямо в вашем чате Telegram"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {language === 'en' ? "Instructions" : "Инструкции"}
                </AlertTitle>
                <AlertDescription>
                  {language === 'en' 
                    ? "To set up Telegram integration: 1) Create a bot using @BotFather, 2) Get your bot token, 3) Start a chat with your bot, 4) Get your chat ID." 
                    : "Для настройки интеграции с Telegram: 1) Создайте бота с помощью @BotFather, 2) Получите токен бота, 3) Начните чат с вашим ботом, 4) Получите ID чата."}
                </AlertDescription>
              </Alert>
              
              <Form {...telegramForm}>
                <form onSubmit={telegramForm.handleSubmit(handleTelegramSubmit)} className="space-y-4">
                  <FormField
                    control={telegramForm.control}
                    name="botToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? "Bot Token" : "Токен бота"}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={language === 'en' ? "Enter your bot token" : "Введите токен бота"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={telegramForm.control}
                    name="chatId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? "Chat ID" : "ID чата"}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? "Enter your chat ID" : "Введите ID чата"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {language === 'en' ? "Save Settings" : "Сохранить настройки"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleTestTelegram}>
                      <Send className="mr-2 h-4 w-4" />
                      {language === 'en' ? "Send Test Message" : "Отправить тестовое сообщение"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "WhatsApp Integration" : "Интеграция с WhatsApp"}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? "Set up WhatsApp integration to receive inquiries via WhatsApp" 
                  : "Настройте интеграцию с WhatsApp для получения запросов через WhatsApp"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {language === 'en' ? "WhatsApp Business API" : "API WhatsApp Business"}
                </AlertTitle>
                <AlertDescription>
                  {language === 'en' 
                    ? "This integration requires a WhatsApp Business API account. You need to sign up for WhatsApp Business API through a solution provider like Twilio or MessageBird." 
                    : "Эта интеграция требует учетной записи WhatsApp Business API. Вам необходимо зарегистрироваться в WhatsApp Business API через поставщика решений, такого как Twilio или MessageBird."}
                </AlertDescription>
              </Alert>
              
              <Form {...whatsappForm}>
                <form onSubmit={whatsappForm.handleSubmit(handleWhatsappSubmit)} className="space-y-4">
                  <FormField
                    control={whatsappForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? "Phone Number" : "Номер телефона"}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'en' ? "Enter WhatsApp phone number" : "Введите номер телефона WhatsApp"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={whatsappForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'en' ? "API Key" : "API ключ"}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder={language === 'en' ? "Enter your API key" : "Введите API ключ"} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {language === 'en' ? "Save Settings" : "Сохранить настройки"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleTestWhatsapp}>
                      <Send className="mr-2 h-4 w-4" />
                      {language === 'en' ? "Send Test Message" : "Отправить тестовое сообщение"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
