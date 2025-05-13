import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Facebook, Instagram, Linkedin, X, Globe, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { databaseService } from '@/services/databaseService';

interface DisplaySocialLink {
  platform: string;
  url: string;
  iconName: string | null;
  displayName: string;
}

const PLATFORMS = [
  { dbName: 'facebook', displayName: 'Facebook', iconName: 'facebook' },
  { dbName: 'twitter', displayName: 'Twitter', iconName: 'twitter' },
  { dbName: 'instagram', displayName: 'Instagram', iconName: 'instagram' },
  { dbName: 'telegram', displayName: 'Telegram', iconName: 'telegram' },
  { dbName: 'linkedin', displayName: 'LinkedIn', iconName: 'linkedin' },
];

export function SocialLinksPanel() {
  const { language } = useLanguage();
  const [displayLinks, setDisplayLinks] = useState<DisplaySocialLink[]>([]);
  const [editingLink, setEditingLink] = useState<{ platform: string, url: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[SocialLinksPanel] Компонент инициализирован, загружаем социальные ссылки');
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[SocialLinksPanel] Запрос к базе данных для получения социальных ссылок');
      const fetchedDbLinks = await databaseService.getSocialLinks();
      console.log('[SocialLinksPanel] Получены ссылки:', fetchedDbLinks);
      
      const fetchedUrlMap = new Map<string, string>();
      fetchedDbLinks.forEach(link => {
          fetchedUrlMap.set(link.platform.toLowerCase(), link.url);
      });

      const linksToDisplay = PLATFORMS.map(p => ({
        platform: p.dbName,
        url: fetchedUrlMap.get(p.dbName) || '',
        iconName: p.iconName,
        displayName: p.displayName,
      }));
      
      console.log('[SocialLinksPanel] Подготовленные ссылки для отображения:', linksToDisplay);
      setDisplayLinks(linksToDisplay);
    } catch (error) {
        console.error("[SocialLinksPanel] Ошибка загрузки социальных ссылок:", error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка при загрузке ссылок');
        toast.error(language === 'en' ? 'Failed to load social links' : 'Не удалось загрузить социальные ссылки');
        // Создаем пустые заглушки для всех платформ
        setDisplayLinks(PLATFORMS.map(p => ({ 
            platform: p.dbName, 
            url: '', 
            iconName: p.iconName, 
            displayName: p.displayName 
        })));
    } finally {
        setIsLoading(false);
    }
  };

  const handleEditClick = (platform: string, url: string) => {
    setEditingLink({ platform, url });
    setError(null);
  };

  const handleSaveClick = async () => {
    if (!editingLink) return;
    setIsSaving(true);
    setError(null);
    
    try {
        const platformConfig = PLATFORMS.find(p => p.dbName === editingLink.platform);
        console.log(`[SocialLinksPanel] Сохраняем ссылку для ${editingLink.platform}: ${editingLink.url}`);
        
        // Проверка URL на правильность формата
        let url = editingLink.url.trim();
        if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
            url = 'https://' + url;
        }
        
        await databaseService.updateSocialLink(
            editingLink.platform, 
            url, 
            platformConfig?.iconName
    );
    
        // Обновляем отображение
        setDisplayLinks(prevLinks => 
          prevLinks.map(link => 
            link.platform === editingLink.platform ? { ...link, url: url } : link
          )
        );
        
    setEditingLink(null);
        setLastSaved(new Date());
        
    toast.success(language === 'en' 
      ? "Social link updated successfully" 
      : "Ссылка на социальную сеть успешно обновлена");

    } catch (error) {
        console.error("[SocialLinksPanel] Ошибка сохранения социальной ссылки:", error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка при сохранении');
        toast.error(language === 'en' ? 'Failed to save social link' : 'Не удалось сохранить социальную ссылку');
    } finally {
        setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setEditingLink(null);
    setError(null);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingLink) return;
    setEditingLink({ ...editingLink, url: e.target.value });
  };

  const renderSocialIcon = (iconName: string | null) => {
    if (!iconName) return <Globe className="h-5 w-5" />;
    
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <X className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'telegram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z" />
          </svg>
        );
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
          <CardTitle>{language === 'en' ? "Social Links" : "Социальные ссылки"}</CardTitle>
          <CardDescription>
            {language === 'en' 
              ? "Manage your social media links that appear in the website footer. Links will only be displayed on the site if a URL is provided." 
              : "Управление ссылками на социальные сети, которые отображаются в футере сайта. Ссылки будут отображаться на сайте только если для них указан URL."}
          </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadSocialLinks} 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">{language === 'en' ? 'Refresh' : 'Обновить'}</span>
            </Button>
          </div>
          {lastSaved && (
            <div className="text-xs text-muted-foreground mt-1">
              {language === 'en' ? 'Last saved:' : 'Последнее сохранение:'} {lastSaved.toLocaleTimeString()}
            </div>
          )}
          {error && (
            <div className="text-sm text-red-500 mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-md">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-fintech-blue" />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? "Platform" : "Платформа"}</TableHead>
                <TableHead>{language === 'en' ? "URL" : "URL"}</TableHead>
                <TableHead>{language === 'en' ? "Actions" : "Действия"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {displayLinks.map((link) => (
                  <TableRow key={link.platform}>
                  <TableCell className="flex items-center gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                        {renderSocialIcon(link.iconName)}
                    </div>
                      <span>{link.displayName}</span>
                  </TableCell>
                  <TableCell className="w-full">
                      {editingLink && editingLink.platform === link.platform ? (
                      <Input 
                        value={editingLink.url}
                        onChange={handleUrlChange}
                        className="w-full"
                          disabled={isSaving}
                        placeholder={language === 'en' ? 'Enter URL (e.g. https://facebook.com/yourpage)' : 'Введите URL (например, https://facebook.com/yourpage)'}
                      />
                    ) : (
                        <span className="block truncate" title={link.url}>{link.url || '-'}</span>
                    )}
                  </TableCell>
                  <TableCell>
                      {editingLink && editingLink.platform === link.platform ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={handleSaveClick}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          {language === 'en' ? "Save" : "Сохранить"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleCancelClick}
                            disabled={isSaving}
                        >
                          {language === 'en' ? "Cancel" : "Отмена"}
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                          onClick={() => handleEditClick(link.platform, link.url)}
                          disabled={editingLink !== null}
                      >
                        {language === 'en' ? "Edit" : "Изменить"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
