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
import { supabase } from '@/lib/supabase';
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
  const [currentUser, setCurrentUser] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Fetch current user data
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching current user:', error);
        toast.error(language === 'en' ? 'Failed to load user data' : 'Не удалось загрузить данные пользователя');
      } else {
        setCurrentUser(user);
        // Maybe set adminData based on user if needed, or remove adminData state
        setAdminData({ username: user?.email, id: user?.id }); // Example: adapting old state
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [language]);

  // Function to handle password change using Supabase Auth
  const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
    if (!currentUser?.id) {
      toast.error(language === 'en' ? 'User not found' : 'Пользователь не найден');
      return;
    }

    // IMPORTANT: Supabase requires the user to be recently signed in to update password.
    // Usually, you re-authenticate the user first (e.g., ask for current password again)
    // or rely on the existing session if it's fresh. 
    // Updating password directly might fail if the session is old.
    // Supabase update password function needs only the NEW password.
    // Verification of the CURRENT password needs to be done separately if required by your logic.
    
    setIsLoading(true); // Use a separate loading state for password update if preferred
    const { error } = await supabase.auth.updateUser({ password: data.newPassword });
    setIsLoading(false);

    if (error) {
        console.error('Error updating password:', error);
        // Provide more specific error messages if possible
        let errorMessage = language === 'en' ? 'Failed to update password' : 'Не удалось обновить пароль';
        if (error.message.includes('requires recent login')) {
           errorMessage = language === 'en' ? 'Password update requires recent login. Please sign out and sign in again.' : 'Для обновления пароля требуется недавний вход. Пожалуйста, выйдите и войдите снова.';
        } else if (error.message.includes('same password')) {
           errorMessage = language === 'en' ? 'New password cannot be the same as the old password.' : 'Новый пароль не может совпадать со старым.';
        }
        toast.error(`${errorMessage}: ${error.message}`);
    } else {
        toast.success(language === 'en' ? 'Password updated successfully' : 'Пароль успешно обновлен');
        form.reset(); // Reset form on success
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
          ) : currentUser ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>{language === 'en' ? 'Email' : 'Email'}</Label>
                <div className="rounded-md border px-3 py-2 bg-muted/50">
                  {currentUser.email}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label>{language === 'en' ? 'Last Sign In' : 'Последний вход'}</Label>
                <div className="rounded-md border px-3 py-2 bg-muted/50">
                  {currentUser.last_sign_in_at 
                    ? new Date(currentUser.last_sign_in_at).toLocaleString() 
                    : language === 'en' ? 'Not available' : 'Недоступно'}
                </div>
              </div>

              <div className="space-y-1">
                <Label>{language === 'en' ? 'Created At' : 'Дата создания'}</Label>
                <div className="rounded-md border px-3 py-2 bg-muted/50">
                  {currentUser.created_at 
                    ? new Date(currentUser.created_at).toLocaleString() 
                    : language === 'en' ? 'Not available' : 'Недоступно'}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {language === 'en' ? 'User data not found' : 'Данные пользователя не найдены'}
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
              ? 'Change your admin account password. You might need to re-login recently.' 
              : 'Изменение пароля учетной записи администратора. Может потребоваться недавний вход.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <FormLabel>{language === 'en' ? 'Confirm New Password' : 'Подтвердите новый пароль'}</FormLabel>
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
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {language === 'en' ? 'Updating...' : 'Обновление...'}</>
                  : language === 'en' ? 'Update Password' : 'Обновить пароль'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}; 