import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, Send, Globe, Webhook } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TelegramService } from "@/services/telegramService";
import { WhatsAppService } from "@/services/whatsappService";

const webhookSchema = z.object({
  url: z.string().url({ message: "Invalid webhook URL" }),
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
  const telegramService = TelegramService.getInstance();
  const whatsappService = WhatsAppService.getInstance();
  
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem("webhookUrl") || "";
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
  
  const handleTelegramSubmit = async (data) => {
    try {
      telegramService.setConfig(data.botToken, data.chatId);
      setTelegramConfig(data);
      toast.success(language === 'en' ? "Telegram integration saved" : "Интеграция с Telegram сохранена");
    } catch (error) {
      toast.error(language === 'en' ? "Failed to save Telegram configuration" : "Не удалось сохранить настройки Telegram");
    }
  };
  
  const handleTestTelegram = async () => {
    try {
      await telegramService.testConnection();
      await telegramService.sendMessage(
        language === 'en' 
          ? "Test message from Fintech-Assist Admin Panel" 
          : "Тестовое сообщение из панели администратора Fintech-Assist"
      );
      toast.success(language === 'en' ? "Telegram integration test successful" : "Тест интеграции с Telegram успешен");
    } catch (error) {
      console.error("Telegram test error:", error);
      toast.error(
        language === 'en' 
          ? "Failed to test Telegram integration" 
          : "Не удалось протестировать интеграцию с Telegram"
      );
    }
  };
  
  const handleWhatsappSubmit = async (data) => {
    try {
      whatsappService.setConfig(data.phoneNumber, data.apiKey);
      setWhatsappConfig(data);
      toast.success(language === 'en' ? "WhatsApp integration saved" : "Интеграция с WhatsApp сохранена");
    } catch (error) {
      toast.error(language === 'en' ? "Failed to save WhatsApp configuration" : "Не удалось сохранить настройки WhatsApp");
    }
  };
  
  const handleTestWhatsapp = async () => {
    try {
      await whatsappService.testConnection();
      await whatsappService.sendMessage(
        language === 'en' 
          ? "Test message from Fintech-Assist Admin Panel" 
          : "Тестовое сообщение из панели администратора Fintech-Assist"
      );
      toast.success(language === 'en' ? "WhatsApp integration test successful" : "Тест интеграции с WhatsApp успешен");
    } catch (error) {
      console.error("WhatsApp test error:", error);
      toast.error(
        language === 'en' 
          ? "Failed to test WhatsApp integration" 
          : "Не удалось протестировать интеграцию с WhatsApp"
      );
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="webhooks">
        <TabsList>
          <TabsTrigger value="webhooks">{language === 'en' ? "Webhooks" : "Вебхуки"}</TabsTrigger>
          <TabsTrigger value="telegram">{language === 'en' ? "Telegram Integration" : "Интеграция с Telegram"}</TabsTrigger>
          <TabsTrigger value="whatsapp">{language === 'en' ? "WhatsApp Integration" : "Интеграция с WhatsApp"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="webhooks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Webhook Configuration" : "Настройка вебхуков"}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? "Configure webhooks to receive notifications about important events" 
                  : "Настройте вебхуки для получения уведомлений о важных событиях"}
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
                          <Input placeholder="https://your-webhook-url.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">
                      {language === 'en' ? "Save" : "Сохранить"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleTestWebhook}>
                      {language === 'en' ? "Test Webhook" : "Тестировать вебхук"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telegram" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'en' ? "Telegram Integration" : "Интеграция с Telegram"}</CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? "Configure Telegram bot to receive notifications" 
                  : "Настройте Telegram бота для получения уведомлений"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{language === 'en' ? "Instructions" : "Инструкции"}</AlertTitle>
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
                          <Input placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz" {...field} />
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
                          <Input placeholder="-1001234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">
                      {language === 'en' ? "Save" : "Сохранить"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleTestTelegram}>
                      {language === 'en' ? "Test Telegram" : "Тестировать Telegram"}
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
                  ? "Configure WhatsApp to receive notifications" 
                  : "Настройте WhatsApp для получения уведомлений"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{language === 'en' ? "WhatsApp Business API" : "API WhatsApp Business"}</AlertTitle>
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
                          <Input placeholder="+1234567890" {...field} />
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
                          <Input type="password" placeholder="your-api-key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit">
                      {language === 'en' ? "Save" : "Сохранить"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleTestWhatsapp}>
                      {language === 'en' ? "Test WhatsApp" : "Тестировать WhatsApp"}
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
