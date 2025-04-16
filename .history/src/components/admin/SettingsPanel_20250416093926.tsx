import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getAdminCredentials, updateAdminPassword } from '@/services/adminService';
import { Loader2 } from 'lucide-react';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { 
    message: "Current password is required" 
  }),
  newPassword: z.string().min(6, { 
    message: "Password must be at least 6 characters long" 
  }),
  confirmPassword: z.string().min(1, { 
    message: "Confirm password is required" 
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const SettingsPanel: React.FC = () => {
  const { language } = useLanguage();
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Загружаем данные администратора
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        const result = await getAdminCredentials();
        if (result.success && result.data) {
          setAdminData(result.data);
        } else {
          toast.error(language === 'en' ? 'Failed to load admin data' : 'Не удалось загрузить данные администратора');
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast.error(language === 'en' ? 'An error occurred' : 'Произошла ошибка');
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [language]);

  // Функция для обработки смены пароля
  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    if (!adminData?.id) {
      toast.error(language === 'en' ? 'Admin ID not found' : 'ID администратора не найден');
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateAdminPassword(
        adminData.id,
        data.currentPassword,
        data.newPassword
      );

      if (result.success) {
        toast.success(language === 'en' ? 'Password updated successfully' : 'Пароль успешно обновлен');
        form.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(language === 'en' 
          ? `Failed to update password: ${result.error}` 
          : `Не удалось обновить пароль: ${result.error}`);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(language === 'en' ? 'An error occurred' : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Admin Account' : 'Учетная запись администратора'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Manage your admin account settings' 
              : 'Управление настройками учетной записи администратора'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : adminData ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>{language === 'en' ? 'Username' : 'Имя пользователя'}</Label>
                <div className="rounded-md border px-3 py-2 bg-muted/50">
                  {adminData.username}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label>{language === 'en' ? 'Last Login' : 'Последний вход'}</Label>
                <div className="rounded-md border px-3 py-2 bg-muted/50">
                  {adminData.lastLogin 
                    ? new Date(adminData.lastLogin).toLocaleString() 
                    : language === 'en' ? 'Never' : 'Никогда'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {language === 'en' ? 'No admin data found' : 'Данные администратора не найдены'}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Change Password' : 'Сменить пароль'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Change your admin account password' 
              : 'Изменение пароля учетной записи администратора'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Current Password' : 'Текущий пароль'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={language === 'en' ? 'Enter current password' : 'Введите текущий пароль'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'New Password' : 'Новый пароль'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={language === 'en' ? 'Enter new password' : 'Введите новый пароль'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {language === 'en' 
                        ? 'Password must be at least 6 characters long' 
                        : 'Пароль должен содержать не менее 6 символов'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Confirm Password' : 'Подтвердите пароль'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={language === 'en' ? 'Confirm new password' : 'Подтвердите новый пароль'} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full mt-2" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === 'en' ? 'Processing...' : 'Обработка...'}
                  </>
                ) : (
                  language === 'en' ? 'Change Password' : 'Сменить пароль'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}; 