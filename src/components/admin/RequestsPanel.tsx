
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, Mail, MessageSquare, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const requestSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  status: z.enum(["new", "in-progress", "resolved", "rejected"]).default("new"),
});

export const RequestsPanel = () => {
  const { language } = useLanguage();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [telegramConfigured, setTelegramConfigured] = useState(false);
  const [whatsappConfigured, setWhatsappConfigured] = useState(false);
  
  const [requests, setRequests] = useState(() => {
    const savedRequests = localStorage.getItem("requests");
    return savedRequests ? JSON.parse(savedRequests) : [
      { id: 1, name: "David Wilson", email: "david@example.com", message: "I'd like to know more about your investment services", status: "new", date: "2023-05-12" },
      { id: 2, name: "Lisa Anderson", email: "lisa@example.com", message: "Having trouble with the mobile app login", status: "in-progress", date: "2023-05-11" },
      { id: 3, name: "Robert Johnson", email: "robert@example.com", message: "Interested in a consultation about retirement planning", status: "resolved", date: "2023-05-10" },
      { id: 4, name: "Jennifer Brown", email: "jennifer@example.com", message: "Need help with account verification", status: "rejected", date: "2023-05-09" },
    ];
  });
  
  useEffect(() => {
    localStorage.setItem("requests", JSON.stringify(requests));
  }, [requests]);
  
  useEffect(() => {
    // Check if Telegram is configured
    const telegramConfig = localStorage.getItem("telegramConfig");
    if (telegramConfig) {
      const config = JSON.parse(telegramConfig);
      setTelegramConfigured(config.botToken && config.chatId);
    }
    
    // Check if WhatsApp is configured
    const whatsappConfig = localStorage.getItem("whatsappConfig");
    if (whatsappConfig) {
      const config = JSON.parse(whatsappConfig);
      setWhatsappConfigured(config.phoneNumber && config.apiKey);
    }
  }, []);
  
  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      status: "new",
    },
  });
  
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setSelectedRequestId(request.id);
    requestForm.reset({
      name: request.name,
      email: request.email,
      message: request.message,
      status: request.status,
    });
    setIsDialogOpen(true);
  };
  
  const handleRequestSubmit = (data) => {
    if (selectedRequestId) {
      const updatedRequests = requests.map(request => 
        request.id === selectedRequestId 
          ? { ...request, ...data }
          : request
      );
      setRequests(updatedRequests);
      toast.success(language === 'en' ? "Request updated successfully" : "Заявка успешно обновлена");
    }
    
    setIsDialogOpen(false);
  };
  
  const getStatusBadge = (status) => {
    let variant;
    let label;
    
    switch (status) {
      case "new":
        variant = "default";
        label = language === 'en' ? "New" : "Новая";
        break;
      case "in-progress":
        variant = "warning";
        label = language === 'en' ? "In Progress" : "В обработке";
        break;
      case "resolved":
        variant = "success";
        label = language === 'en' ? "Resolved" : "Решена";
        break;
      case "rejected":
        variant = "destructive";
        label = language === 'en' ? "Rejected" : "Отклонена";
        break;
      default:
        variant = "secondary";
        label = status;
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };
  
  const handleForwardToTelegram = () => {
    if (!selectedRequest) return;
    
    // In a real app, this would make an API call to your Telegram bot
    toast.success(language === 'en' ? "Request forwarded to Telegram" : "Заявка переадресована в Telegram");
  };
  
  const handleForwardToWhatsapp = () => {
    if (!selectedRequest) return;
    
    // In a real app, this would make an API call to WhatsApp API
    toast.success(language === 'en' ? "Request forwarded to WhatsApp" : "Заявка переадресована в WhatsApp");
  };
  
  const handleSendEmail = () => {
    if (!selectedRequest) return;
    
    // Open default email client with pre-filled information
    const subject = language === 'en' ? "Response to your inquiry" : "Ответ на ваш запрос";
    const body = language === 'en' 
      ? `Dear ${selectedRequest.name},\n\nThank you for contacting us.\n\n`
      : `Уважаемый(ая) ${selectedRequest.name},\n\nБлагодарим вас за обращение к нам.\n\n`;
    
    window.open(`mailto:${selectedRequest.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="space-y-6">
      {!telegramConfigured && !whatsappConfigured && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'en' ? "Messaging integrations not configured" : "Интеграции сообщений не настроены"}
          </AlertTitle>
          <AlertDescription>
            {language === 'en' 
              ? "Configure Telegram or WhatsApp integration in the Webhooks section to forward requests." 
              : "Настройте интеграцию с Telegram или WhatsApp в разделе Вебхуки для переадресации заявок."}
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? "Customer Requests" : "Заявки клиентов"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? "Name" : "Имя"}</TableHead>
                  <TableHead>{language === 'en' ? "Email" : "Email"}</TableHead>
                  <TableHead>{language === 'en' ? "Date" : "Дата"}</TableHead>
                  <TableHead>{language === 'en' ? "Status" : "Статус"}</TableHead>
                  <TableHead>{language === 'en' ? "Actions" : "Действия"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewRequest(request)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {language === 'en' ? "View" : "Просмотр"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      {language === 'en' ? "No requests found" : "Заявки не найдены"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' ? "Request Details" : "Детали заявки"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(handleRequestSubmit)} className="space-y-4">
              <FormField
                control={requestForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? "Name" : "Имя"}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={requestForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? "Email" : "Email"}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={requestForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? "Message" : "Сообщение"}</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={requestForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? "Status" : "Статус"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'en' ? "Select status" : "Выберите статус"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">{language === 'en' ? "New" : "Новая"}</SelectItem>
                        <SelectItem value="in-progress">{language === 'en' ? "In Progress" : "В обработке"}</SelectItem>
                        <SelectItem value="resolved">{language === 'en' ? "Resolved" : "Решена"}</SelectItem>
                        <SelectItem value="rejected">{language === 'en' ? "Rejected" : "Отклонена"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <Button type="submit">
                    {language === 'en' ? "Update Request" : "Обновить заявку"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleSendEmail}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {language === 'en' ? "Email" : "Email"}
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={!telegramConfigured}
                    onClick={handleForwardToTelegram}
                    className="flex-1 mr-2"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {language === 'en' ? "To Telegram" : "В Telegram"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={!whatsappConfigured}
                    onClick={handleForwardToWhatsapp}
                    className="flex-1"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {language === 'en' ? "To WhatsApp" : "В WhatsApp"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
