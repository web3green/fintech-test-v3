import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, useForm as useReactHookForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, Mail, MessageSquare, ExternalLink, Loader2, Settings, X as XIcon, PlusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { databaseService } from "@/services/databaseService";

interface ContactRequest {
  id: string | number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: string;
}

const requestSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(1, { message: "Message cannot be empty" }),
  status: z.enum(["new", "in-progress", "resolved", "rejected", "unanswered"]).default("unanswered"),
  phone: z.string().optional(),
  service: z.string().optional(),
});

// Schema for the new email input field
const newEmailSchema = z.object({
  newEmail: z.string().email({ message: "Please enter a valid email address." })
});

export const RequestsPanel = () => {
  const { language } = useLanguage();
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // State for notification emails list and management
  const [notificationEmails, setNotificationEmails] = useState<string[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(true);
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [isDeletingEmail, setIsDeletingEmail] = useState<string | null>(null); // Store email being deleted for loader

  // Form for request details/status update
  const requestForm = useReactHookForm({
    resolver: zodResolver(requestSchema),
  });

  // Form for adding a new notification email
  const newEmailForm = useReactHookForm<z.infer<typeof newEmailSchema>>({
      resolver: zodResolver(newEmailSchema),
      defaultValues: { newEmail: "" },
  });
  
  useEffect(() => {
    loadRequests();
    loadNotificationEmails(); // Load email list on mount
  }, []);

  const loadRequests = async () => {
    setLoadingRequests(true);
    setRequestsError(null);
    console.log('[RequestsPanel] Loading requests...');
    try {
      const data = await databaseService.getContactRequests();
      console.log('[RequestsPanel] Data received:', data);
      if (!Array.isArray(data)) {
         console.error('[RequestsPanel] Received non-array data:', data);
         throw new Error('Received invalid data structure for requests.');
      }
      setRequests(data as ContactRequest[]);
    } catch (err: any) {
      console.error('[RequestsPanel] Error loading requests:', err);
      setRequestsError(err.message || 'Failed to load requests');
      toast.error('Failed to load requests');
    } finally {
      setLoadingRequests(false);
      console.log('[RequestsPanel] Loading finished.');
    }
  };

  const loadNotificationEmails = async () => {
      setIsLoadingEmails(true);
      try {
          const emails = await databaseService.getNotificationEmails();
          setNotificationEmails(emails);
      } catch (error) {
          toast.error(language === 'en' ? 'Failed to load notification emails' : 'Не удалось загрузить email-адреса для уведомлений');
          console.error("Error loading notification emails:", error);
      } finally {
          setIsLoadingEmails(false);
      }
  };

  // Function to add a new notification email
  const handleAddEmail = async (values: z.infer<typeof newEmailSchema>) => {
      setIsAddingEmail(true);
      const emailToAdd = values.newEmail;
      try {
          await databaseService.addNotificationEmail(emailToAdd);
          setNotificationEmails(prev => [...prev, emailToAdd]); // Add to local list
          newEmailForm.reset(); // Clear input field
          toast.success(language === 'en' ? `Email ${emailToAdd} added successfully` : `Email ${emailToAdd} успешно добавлен`);
      } catch (error: any) {
          toast.error(error.message || (language === 'en' ? 'Failed to add email' : 'Не удалось добавить email'));
          console.error("Error adding notification email:", error);
      } finally {
          setIsAddingEmail(false);
      }
  };

  // Function to delete a notification email
  const handleDeleteEmail = async (emailToDelete: string) => {
      setIsDeletingEmail(emailToDelete); // Show loader on the specific badge
      try {
          await databaseService.deleteNotificationEmail(emailToDelete);
          setNotificationEmails(prev => prev.filter(email => email !== emailToDelete)); // Remove from local list
          toast.success(language === 'en' ? `Email ${emailToDelete} deleted successfully` : `Email ${emailToDelete} успешно удален`);
      } catch (error) {
          toast.error(language === 'en' ? 'Failed to delete email' : 'Не удалось удалить email');
          console.error("Error deleting notification email:", error);
      } finally {
          setIsDeletingEmail(null); // Hide loader
      }
  };
  
  const handleViewRequest = (request: ContactRequest) => {
    setSelectedRequest(request);
    requestForm.reset({
      name: request.name,
      email: request.email,
      message: request.message,
      status: request.status,
      phone: request.phone || '',
      service: request.service || '',
    });
    setIsDialogOpen(true);
  };
  
  const handleRequestStatusSubmit = async (data: z.infer<typeof requestSchema>) => {
    if (!selectedRequest) return;

    setIsUpdatingStatus(true);
    try {
      await databaseService.updateContactRequestStatus(selectedRequest.id, data.status);
      
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === selectedRequest.id 
            ? { ...req, status: data.status, updated_at: new Date().toISOString() }
            : req
        )
      );
      
      toast.success(language === 'en' ? "Request status updated successfully" : "Статус заявки успешно обновлен");
      setIsDialogOpen(false);
      setSelectedRequest(null);
    } catch (err: any) {
      console.error('Error updating request status:', err);
      toast.error(err.message || 'Failed to update request status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    let variant: "default" | "warning" | "success" | "destructive" | "secondary" = "secondary";
    let label;
    
    switch (status) {
      case "new":
      case "unanswered":
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
  
  const handleSendEmail = () => {
    if (!selectedRequest) return;
    
    const subject = language === 'en' ? "Response to your inquiry" : "Ответ на ваш запрос";
    const body = language === 'en' 
      ? `Dear ${selectedRequest.name},\n\nThank you for contacting us.\n\n`
      : `Уважаемый(ая) ${selectedRequest.name},\n\nБлагодарим вас за обращение к нам.\n\n`;
    
    window.open(`mailto:${selectedRequest.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (loadingRequests) {
    return <div className="flex justify-center p-4"><Loader2 className="h-8 w-8 animate-spin text-fintech-blue" /></div>
  }

  if (requestsError) {
     return (
        <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Requests</AlertTitle>
            <AlertDescription>{requestsError}</AlertDescription>
        </Alert>
      );
  }

  return (
    <div className="space-y-6">

      {/* Card for Notification Email Settings - Updated */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" /> 
            {language === 'en' ? 'Notifications Settings' : 'Настройки уведомлений'}
          </CardTitle>
           <CardDescription>
            {language === 'en' ? 'Manage email addresses that receive notifications for new requests.' : 'Управление email-адресами для получения уведомлений о новых заявках.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {isLoadingEmails ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
           ) : (
             <> 
                {/* Display list of current emails */}
                <div className="space-y-2">
                    <label className="text-sm font-medium"> 
                      {language === 'en' ? 'Current Emails:' : 'Текущие адреса:'}
                    </label>
                    {notificationEmails.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {notificationEmails.map((email) => (
                                <Badge key={email} variant="secondary" className="flex items-center gap-1 pl-2 pr-1">
                                    <span>{email}</span>
                                    <Button 
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDeleteEmail(email)}
                                        disabled={isDeletingEmail === email}
                                        aria-label={`Remove ${email}`}
                                    >
                                        {isDeletingEmail === email ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <XIcon className="h-3 w-3" />
                                        )}
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {language === 'en' ? 'No notification emails added yet.' : 'Email-адреса для уведомлений еще не добавлены.'}
                        </p>
                    )}
                </div>

                {/* Form to add new email - ONLY FormProvider */}
                <FormProvider {...newEmailForm}>
                  <form onSubmit={newEmailForm.handleSubmit(handleAddEmail)} className="flex items-end gap-4 pt-4 border-t">
                    <FormField
                      control={newEmailForm.control}
                      name="newEmail"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel className="sr-only">
                            {language === 'en' ? 'New Notification Email' : 'Новый Email для уведомлений'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={language === 'en' ? 'Enter new email address' : 'Введите новый email'} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isAddingEmail}>
                       {isAddingEmail ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />} 
                       {language === 'en' ? 'Add Email' : 'Добавить Email'}
                    </Button>
                  </form>
                </FormProvider>
             </> 
           )}
        </CardContent>
      </Card>

      {/* Card for Customer Requests Table */}
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
                  <TableHead>{language === 'en' ? "Date Received" : "Дата получения"}</TableHead>
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
                      <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
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
      
      {/* Dialog for Viewing/Updating Request */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{language === 'en' ? 'Request Details' : 'Детали заявки'}</DialogTitle>
          </DialogHeader>
          <FormProvider {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(handleRequestStatusSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={requestForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? 'Name' : 'Имя'}</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={requestForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? 'Email' : 'Email'}</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                  control={requestForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? 'Phone' : 'Телефон'}</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={requestForm.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? 'Service Requested' : 'Запрошенная услуга'}</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={requestForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? 'Message' : 'Сообщение'}</FormLabel>
                      <FormControl>
                        <Textarea {...field} readOnly rows={5} className="bg-muted/50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={requestForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'en' ? 'Status' : 'Статус'}</FormLabel>
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
                           <SelectItem value="unanswered">{language === 'en' ? "Unanswered" : "Без ответа"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center pt-4 border-t">
                   <Button type="button" variant="outline" onClick={handleSendEmail}>
                     <Mail className="mr-2 h-4 w-4"/>
                      {language === 'en' ? 'Reply via Email' : 'Ответить по Email'}
                   </Button>
                   <Button type="submit" disabled={isUpdatingStatus}>
                     {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     {language === 'en' ? 'Update Status' : 'Обновить статус'}
                   </Button>
                </div>
              </form>
            </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};
