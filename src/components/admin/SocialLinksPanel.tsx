
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Facebook, Instagram, Linkedin, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string;
};

export function SocialLinksPanel() {
  const { language } = useLanguage();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [editingLink, setEditingLink] = useState<{ id: number, url: string } | null>(null);

  useEffect(() => {
    // Get social links from localStorage if available
    const storedLinks = localStorage.getItem('socialLinks');
    if (storedLinks) {
      setSocialLinks(JSON.parse(storedLinks));
    } else {
      // Default social links
      const defaultLinks = [
        { id: 1, platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
        { id: 2, platform: 'Twitter', url: 'https://x.com', icon: 'twitter' },
        { id: 3, platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
        { id: 4, platform: 'Telegram', url: 'https://t.me/fintechassist', icon: 'telegram' },
        { id: 5, platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' }
      ];
      setSocialLinks(defaultLinks);
      localStorage.setItem('socialLinks', JSON.stringify(defaultLinks));
    }
  }, []);

  const handleEditClick = (id: number, url: string) => {
    setEditingLink({ id, url });
  };

  const handleSaveClick = () => {
    if (!editingLink) return;

    const updatedLinks = socialLinks.map(link => 
      link.id === editingLink.id ? { ...link, url: editingLink.url } : link
    );
    
    setSocialLinks(updatedLinks);
    localStorage.setItem('socialLinks', JSON.stringify(updatedLinks));
    setEditingLink(null);
    
    toast.success(language === 'en' 
      ? "Social link updated successfully" 
      : "Ссылка на социальную сеть успешно обновлена");
  };

  const handleCancelClick = () => {
    setEditingLink(null);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingLink) return;
    setEditingLink({ ...editingLink, url: e.target.value });
  };

  // Function to render the appropriate icon
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
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
          <CardTitle>{language === 'en' ? "Social Links" : "Социальные ссылки"}</CardTitle>
          <CardDescription>
            {language === 'en' 
              ? "Manage your social media links that appear in the website footer" 
              : "Управление ссылками на социальные сети, которые отображаются в футере сайта"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? "Platform" : "Платформа"}</TableHead>
                <TableHead>{language === 'en' ? "URL" : "URL"}</TableHead>
                <TableHead>{language === 'en' ? "Actions" : "Действия"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="flex items-center gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                      {renderSocialIcon(link.platform)}
                    </div>
                    <span>{link.platform}</span>
                  </TableCell>
                  <TableCell className="w-full">
                    {editingLink && editingLink.id === link.id ? (
                      <Input 
                        value={editingLink.url}
                        onChange={handleUrlChange}
                        className="w-full"
                      />
                    ) : (
                      link.url
                    )}
                  </TableCell>
                  <TableCell>
                    {editingLink && editingLink.id === link.id ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={handleSaveClick}
                        >
                          {language === 'en' ? "Save" : "Сохранить"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleCancelClick}
                        >
                          {language === 'en' ? "Cancel" : "Отмена"}
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditClick(link.id, link.url)}
                      >
                        {language === 'en' ? "Edit" : "Изменить"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
