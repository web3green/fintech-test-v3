import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { databaseService } from "@/services/databaseService";
import { useLanguage } from '@/contexts/LanguageContext';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { TextBlock } from '@/services/siteTextsService';

interface ServiceTexts {
  id: string;
  title_en: string;
  title_ru: string;
  short_en: string;
  short_ru: string;
  details_en: string;
  details_ru: string;
}

// Interface for section-level texts
interface SectionTexts {
    badge_en: string;
    badge_ru: string;
    title_en: string;
    title_ru: string;
    subtitle_en: string;
    subtitle_ru: string;
}

export const SiteTextsPanel = () => {
  const { language } = useLanguage();
  const [servicesData, setServicesData] = useState<ServiceTexts[]>([]);
  const [sectionTexts, setSectionTexts] = useState<SectionTexts>({
      badge_en: '', badge_ru: '', title_en: '', title_ru: '', subtitle_en: '', subtitle_ru: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSection, setIsSavingSection] = useState(false); // Saving state for section texts
  const [isSavingService, setIsSavingService] = useState<string | null>(null); // Saving state for individual services
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllTexts();
  }, []);

  const loadAllTexts = async () => {
    setIsLoading(true);
    setError(null);
    try {
        // Fetch section texts
        const badgePromise = databaseService.getSiteText('services.badge');
        const titlePromise = databaseService.getSiteText('services.title');
        const subtitlePromise = databaseService.getSiteText('services.subtitle');
        // Fetch individual service texts
        const servicesPromise = databaseService.getSiteTextsByPrefix('services.');

        const [badgeData, titleData, subtitleData, rawServices] = await Promise.all([
            badgePromise, titlePromise, subtitlePromise, servicesPromise
        ]);

        console.log('[ServicesTextPanel] Raw service texts received:', rawServices);

        // Group service texts by service ID
        const grouped = rawServices.reduce<Record<string, Partial<ServiceTexts>>>((acc, item) => {
          // More robust check before accessing item.key
          if (!item || typeof item.key !== 'string' || !item.key) { 
              console.warn('[ServicesTextPanel] Skipping item with invalid or missing key:', item);
              return acc; // Skip this item
          }
          
          // Now it should be safe to split
          const keyParts = item.key.split('.');

          // Check structure AFTER splitting
          if (keyParts.length !== 3 || keyParts[0] !== 'services') {
               if (item.key.startsWith('services.')) {
                  console.log(`[ServicesTextPanel] Skipping item with valid prefix but incorrect parts: ${item.key}`, item);
               }
              return acc; 
          }

          const serviceId = keyParts[1];
          const fieldType = keyParts[2];

          if (!acc[serviceId]) {
            acc[serviceId] = { id: serviceId };
          }
          
          // Read from value_en and value_ru
          if (fieldType === 'title') {
            acc[serviceId]!.title_en = item.value_en ?? '';
            acc[serviceId]!.title_ru = item.value_ru ?? '';
          } else if (fieldType === 'short') {
            acc[serviceId]!.short_en = item.value_en ?? '';
            acc[serviceId]!.short_ru = item.value_ru ?? '';
          } else if (fieldType === 'details') {
            acc[serviceId]!.details_en = item.value_en ?? '';
            acc[serviceId]!.details_ru = item.value_ru ?? '';
          }

          return acc;
        }, {});

        const formattedServices = Object.values(grouped).map(service => ({
          id: service.id!,
          title_en: service.title_en ?? '',
          title_ru: service.title_ru ?? '',
          short_en: service.short_en ?? '',
          short_ru: service.short_ru ?? '',
          details_en: service.details_en || '<p></p>',
          details_ru: service.details_ru || '<p></p>',
        }));

        // Also update setting section texts using value_en/value_ru
        setSectionTexts({
              badge_en: badgeData?.value_en ?? '',
              badge_ru: badgeData?.value_ru ?? '',
              title_en: titleData?.value_en ?? '',
              title_ru: titleData?.value_ru ?? '',
              subtitle_en: subtitleData?.value_en ?? '',
              subtitle_ru: subtitleData?.value_ru ?? '',
        });

        setServicesData(formattedServices);
    } catch (err) {
      console.error('Error loading texts:', err);
      setError(language === 'en' ? 'Failed to load texts.' : 'Не удалось загрузить тексты.');
      toast.error(language === 'en' ? 'Failed to load texts.' : 'Не удалось загрузить тексты.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle changes for section texts
  const handleSectionInputChange = (field: keyof SectionTexts, value: string) => {
      setSectionTexts(prev => ({ ...prev, [field]: value }));
  };

  // Handle input changes for simple service text fields
  const handleServiceInputChange = (serviceId: string, field: keyof ServiceTexts, value: string) => {
    setServicesData(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, [field]: value } : service
      )
    );
  };

  // Handle content changes from Tiptap editor
  const handleDetailsChange = (serviceId: string, lang: 'en' | 'ru', newContent: string) => {
    const field = lang === 'en' ? 'details_en' : 'details_ru';
    setServicesData(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, [field]: newContent } : service
      )
    );
  };

  // Save changes for the main section texts
  const handleSaveSectionTexts = async () => {
      setIsSavingSection(true);
      setError(null);
      try {
          const badgePromise = databaseService.upsertSiteText('services.badge', sectionTexts.badge_en, sectionTexts.badge_ru, 'services');
          const titlePromise = databaseService.upsertSiteText('services.title', sectionTexts.title_en, sectionTexts.title_ru, 'services');
          const subtitlePromise = databaseService.upsertSiteText('services.subtitle', sectionTexts.subtitle_en, sectionTexts.subtitle_ru, 'services');

          await Promise.all([badgePromise, titlePromise, subtitlePromise]);

          toast.success(language === 'en' ? 'Section texts saved successfully!' : 'Тексты секции успешно сохранены!');
      } catch (err) {
          console.error('Error saving section texts:', err);
          setError(language === 'en' ? 'Failed to save section texts.' : 'Не удалось сохранить тексты секции.');
          toast.error(language === 'en' ? 'Failed to save section texts.' : 'Не удалось сохранить тексты секции.');
      } finally {
          setIsSavingSection(false);
      }
  };


  // Save changes for a specific service
  const handleSaveService = async (serviceId: string) => {
    setIsSavingService(serviceId); // Use specific state for service saving
    setError(null);
    const serviceToSave = servicesData.find(s => s.id === serviceId);

    if (!serviceToSave) {
      toast.error(language === 'en' ? 'Service not found.' : 'Услуга не найдена.');
      setIsSavingService(null);
      return;
    }

    try {
      const titleKey = `services.${serviceId}.title`;
      console.log(`[ServicesTextPanel] Saving ${titleKey}: EN='${serviceToSave.title_en}', RU='${serviceToSave.title_ru}'`);
      const titlePromise = databaseService.upsertSiteText(titleKey, serviceToSave.title_en, serviceToSave.title_ru, 'services');

      const shortKey = `services.${serviceId}.short`;
      console.log(`[ServicesTextPanel] Saving ${shortKey}: EN='${serviceToSave.short_en}', RU='${serviceToSave.short_ru}'`);
      const shortPromise = databaseService.upsertSiteText(shortKey, serviceToSave.short_en, serviceToSave.short_ru, 'services');

      const detailsKey = `services.${serviceId}.details`;
      console.log(`[ServicesTextPanel] Saving ${detailsKey}: EN='${serviceToSave.details_en}', RU='${serviceToSave.details_ru}'`);
      const detailsPromise = databaseService.upsertSiteText(detailsKey, serviceToSave.details_en, serviceToSave.details_ru, 'services');

      await Promise.all([titlePromise, shortPromise, detailsPromise]);

      toast.success(`${language === 'en' ? 'Service' : 'Услуга'} '${serviceToSave.id}' ${language === 'en' ? 'saved successfully!' : 'успешно сохранена!'}`);
    } catch (err) {
      console.error(`Error saving service ${serviceId}:`, err);
      setError(language === 'en' ? `Failed to save service ${serviceId}.` : `Не удалось сохранить услугу ${serviceId}.`);
      toast.error(language === 'en' ? `Failed to save service ${serviceId}.` : `Не удалось сохранить услугу ${serviceId}.`);
    } finally {
      setIsSavingService(null); // Use specific state for service saving
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (error && !isLoading) { // Show error only if not loading
    return <p className="text-red-500 text-center p-4">{error}</p>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
        {/* Card for Section Texts */}
        <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit Section Header' : 'Редактировать заголовок секции'}</CardTitle>
                <CardDescription>
                    {language === 'en' ? 'Manage the main title, subtitle, and badge for the "Our Services" section.' : 'Управляйте основным заголовком, подзаголовком и значком для секции "Наши услуги".'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Badge (EN)</label>
                        <Input
                            value={sectionTexts.badge_en}
                            onChange={(e) => handleSectionInputChange('badge_en', e.target.value)}
                            placeholder="e.g., Our Services"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Badge (RU)</label>
                        <Input
                            value={sectionTexts.badge_ru}
                            onChange={(e) => handleSectionInputChange('badge_ru', e.target.value)}
                            placeholder="напр., Наши Услуги"
                        />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title (EN)</label>
                        <Input
                            value={sectionTexts.title_en}
                            onChange={(e) => handleSectionInputChange('title_en', e.target.value)}
                             placeholder="e.g., Our Services"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Title (RU)</label>
                        <Input
                            value={sectionTexts.title_ru}
                            onChange={(e) => handleSectionInputChange('title_ru', e.target.value)}
                            placeholder="напр., Наши Услуги"
                        />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Subtitle (EN)</label>
                        <Textarea // Use Textarea for potentially longer subtitles
                            value={sectionTexts.subtitle_en}
                            onChange={(e) => handleSectionInputChange('subtitle_en', e.target.value)}
                            placeholder="Enter subtitle in English..."
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Subtitle (RU)</label>
                        <Textarea
                            value={sectionTexts.subtitle_ru}
                            onChange={(e) => handleSectionInputChange('subtitle_ru', e.target.value)}
                             placeholder="Введите подзаголовок на русском..."
                            rows={3}
                        />
                    </div>
                </div>
                 <div className="flex justify-end pt-4 border-t">
                    <Button
                        onClick={handleSaveSectionTexts}
                        disabled={isSavingSection}
                    >
                        {isSavingSection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {language === 'en' ? 'Save Section Texts' : 'Сохранить тексты секции'}
                    </Button>
                </div>
            </CardContent>
        </Card>

       {/* Divider or Header for Individual Services */}
        <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit Individual Services' : 'Редактировать отдельные услуги'}</CardTitle>
                <CardDescription>
                    {language === 'en' ? 'Manage titles, short descriptions, and detailed descriptions for each service.' : 'Управляйте заголовками, краткими описаниями и детальными описаниями для каждой услуги.'}
                </CardDescription>
             </CardHeader>
        </Card>

      {servicesData.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground p-4">No individual service texts found starting with 'services.*.field' key structure.</p>
      )}

      {servicesData.map((service) => (
        <Card key={service.id}>
          <CardHeader>
            <CardTitle className="capitalize">{service.id.replace(/-/g, ' ')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title (EN)</label>
                <Input
                  value={service.title_en}
                  onChange={(e) => handleServiceInputChange(service.id, 'title_en', e.target.value)}
                />
              </div>
               <div>
                <label className="block text-sm font-medium mb-1">Title (RU)</label>
                <Input
                  value={service.title_ru}
                  onChange={(e) => handleServiceInputChange(service.id, 'title_ru', e.target.value)}
                />
              </div>
            </div>

             {/* Short Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Short Description (EN)</label>
                 <Input
                  value={service.short_en}
                  onChange={(e) => handleServiceInputChange(service.id, 'short_en', e.target.value)}
                />
              </div>
               <div>
                <label className="block text-sm font-medium mb-1">Short Description (RU)</label>
                 <Input
                  value={service.short_ru}
                  onChange={(e) => handleServiceInputChange(service.id, 'short_ru', e.target.value)}
                />
              </div>
            </div>

            {/* Details (Tiptap Editors) */}
            <div className="space-y-3">
              <label className="block text-sm font-medium">Details (EN)</label>
              <RichTextEditor
                value={service.details_en}
                onChange={(newContent) => handleDetailsChange(service.id, 'en', newContent)}
                placeholder="Enter detailed English description..."
              />
            </div>
            <div className="space-y-3">
               <label className="block text-sm font-medium">Details (RU)</label>
              <RichTextEditor
                value={service.details_ru}
                onChange={(newContent) => handleDetailsChange(service.id, 'ru', newContent)}
                placeholder="Введите детальное описание на русском..."
              />
            </div>

            {/* Save Button for Individual Service */}
            <div className="flex justify-end pt-4 border-t">
                <Button
                    onClick={() => handleSaveService(service.id)}
                    disabled={isSavingService === service.id} // Use specific state
                >
                    {isSavingService === service.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     {language === 'en' ? 'Save This Service' : 'Сохранить эту услугу'}
                </Button>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 