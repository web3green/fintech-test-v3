import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Plus, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from "sonner"
import { databaseService } from "@/services/databaseService"
import { useLanguage } from '@/contexts/LanguageContext'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TextBlock } from '@/services/siteTextsService'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Keep this for service-specific structure
interface ServiceTexts {
  id: string;
  title_en: string;
  title_ru: string;
  short_en: string;
  short_ru: string;
  details_en: string;
  details_ru: string;
}

// Keep this for section-level service texts
interface SectionTexts {
    badge_en: string;
    badge_ru: string;
    title_en: string;
    title_ru: string;
    subtitle_en: string;
    subtitle_ru: string;
}

// Type for general texts grouped by section
interface GeneralTextGroup {
    section: string;
    texts: TextBlock[];
}

export const SiteTextsPanel: React.FC = () => {
  const { language } = useLanguage();
  const [servicesData, setServicesData] = useState<ServiceTexts[]>([]);
  const [sectionTexts, setSectionTexts] = useState<SectionTexts>({
      badge_en: '', badge_ru: '', title_en: '', title_ru: '', subtitle_en: '', subtitle_ru: ''
  });
  const [generalTexts, setGeneralTexts] = useState<GeneralTextGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [isSavingService, setIsSavingService] = useState<string | null>(null);
  const [isSavingGeneral, setIsSavingGeneral] = useState<string | null>(null);
  const [isSavingSingleText, setIsSavingSingleText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // State to track the currently selected general text section for editing
  const [selectedGeneralSection, setSelectedGeneralSection] = useState<string | null>(null); 

  useEffect(() => {
    loadAllTexts();
  }, []);

  const loadAllTexts = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const allTexts = await databaseService.getAllSiteTexts();
        console.log('[SiteTextsPanel] All texts received:', allTexts);

        const serviceRelatedTexts: TextBlock[] = [];
        const otherTexts: TextBlock[] = [];

        allTexts.forEach(item => {
            if (item.key?.startsWith('services.')) {
                serviceRelatedTexts.push(item);
            } else {
                otherTexts.push(item);
            }
        });

        // --- Process Service Texts ---
        const serviceKeys = ['services.badge', 'services.title', 'services.subtitle'];
        const sectionData = serviceRelatedTexts.filter(t => serviceKeys.includes(t.key));
        const individualServiceData = serviceRelatedTexts.filter(t => !serviceKeys.includes(t.key));
        const badgeData = sectionData.find(t => t.key === 'services.badge');
        const titleData = sectionData.find(t => t.key === 'services.title');
        const subtitleData = sectionData.find(t => t.key === 'services.subtitle');
        setSectionTexts({
              badge_en: badgeData?.value_en ?? '',
              badge_ru: badgeData?.value_ru ?? '',
              title_en: titleData?.value_en ?? '',
              title_ru: titleData?.value_ru ?? '',
              subtitle_en: subtitleData?.value_en ?? '',
              subtitle_ru: subtitleData?.value_ru ?? '',
        });
        const groupedServices = individualServiceData.reduce<Record<string, Partial<ServiceTexts>>>((acc, item) => {
          if (!item || typeof item.key !== 'string' || !item.key) { return acc; }
          const keyParts = item.key.split('.');
          if (keyParts.length !== 3 || keyParts[0] !== 'services') { return acc; }
          const serviceId = keyParts[1];
          const fieldType = keyParts[2];
          if (!acc[serviceId]) acc[serviceId] = { id: serviceId };
          if (fieldType === 'title') { acc[serviceId]!.title_en = item.value_en ?? ''; acc[serviceId]!.title_ru = item.value_ru ?? ''; }
          else if (fieldType === 'short') { acc[serviceId]!.short_en = item.value_en ?? ''; acc[serviceId]!.short_ru = item.value_ru ?? ''; }
          else if (fieldType === 'details') { acc[serviceId]!.details_en = item.value_en ?? ''; acc[serviceId]!.details_ru = item.value_ru ?? ''; }
          return acc;
        }, {});
        const formattedServices = Object.values(groupedServices).map(service => ({
          id: service.id!, 
          title_en: service.title_en ?? '',
          title_ru: service.title_ru ?? '',
          short_en: service.short_en ?? '',
          short_ru: service.short_ru ?? '',
          details_en: service.details_en || '<p></p>',
          details_ru: service.details_ru || '<p></p>',
        }));
        setServicesData(formattedServices);

        // --- Process General Texts ---
        const groupedGeneral = otherTexts.reduce<Record<string, TextBlock[]>>((acc, item) => {
             const sectionKey = item.section || item.key?.split('.')[0] || 'other'; 
            if (!acc[sectionKey]) { acc[sectionKey] = []; }
            acc[sectionKey].push(item);
            return acc;
        }, {});
        const formattedGeneral = Object.entries(groupedGeneral).map(([section, texts]) => ({
            section,
            texts: texts.sort((a, b) => a.key.localeCompare(b.key)),
        }));
        setGeneralTexts(formattedGeneral);
        // Set the initially selected section to the first one, if available
        if (formattedGeneral.length > 0) {
            setSelectedGeneralSection(formattedGeneral[0].section);
        }

    } catch (err: any) { 
      console.error('Error loading texts:', err);
      const message = err.message || 'Failed to load texts.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionInputChange = (field: keyof SectionTexts, value: string) => {
      setSectionTexts(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceInputChange = (serviceId: string, field: keyof ServiceTexts, value: string) => {
    setServicesData(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, [field]: value } : service
      )
    );
  };

  const handleDetailsChange = (serviceId: string, lang: 'en' | 'ru', newContent: string) => {
    const field = lang === 'en' ? 'details_en' : 'details_ru';
    setServicesData(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, [field]: newContent } : service
      )
    );
  };

  const handleSaveSectionTexts = async () => { /* ... */ };
  const handleSaveService = async (serviceId: string) => { /* ... */ };

  const handleGeneralInputChange = (section: string, key: string, lang: 'en' | 'ru', value: string) => {
      setGeneralTexts(prevGroups => 
          prevGroups.map(group => 
              group.section === section
                  ? { 
                      ...group, 
                      texts: group.texts.map(text => 
                          text.key === key 
                              ? { ...text, [lang === 'en' ? 'value_en' : 'value_ru']: value }
                              : text
                      )
                    }
                  : group
          )
      );
  };

  const handleSaveGeneralGroup = async (section: string) => {
      setIsSavingGeneral(section);
      setError(null);
      const groupToSave = generalTexts.find(g => g.section === section);

      if (!groupToSave) {
          toast.error(language === 'en' ? `Group ${section} not found.` : `Группа ${section} не найдена.`);
          setIsSavingGeneral(null);
          return;
      }

      try {
          const promises = groupToSave.texts.map(text => 
              databaseService.upsertSiteText(text.key, text.value_en || '', text.value_ru || '', text.section)
          );
          await Promise.all(promises);
          toast.success(`${language === 'en' ? 'Texts for group' : 'Тексты для группы'} '${section}' ${language === 'en' ? 'saved successfully!' : 'успешно сохранены!'}`);
      } catch (err: any) { 
          console.error(`Error saving general texts for group ${section}:`, err);
          const message = err.message || `Failed to save texts for group ${section}.`;
          setError(message);
          toast.error(message);
      } finally {
          setIsSavingGeneral(null);
      }
  };

  const handleSaveSingleText = async (text: TextBlock) => {
    if (!text || !text.key) {
      toast.error('Invalid text data provided.');
      return;
    }
    const keyToSave = text.key;
    setIsSavingSingleText(keyToSave);
    setError(null);
    try {
      await databaseService.upsertSiteText(
        keyToSave, 
        text.value_en || '', 
        text.value_ru || '', 
        text.section
      );
      toast.success(`${language === 'en' ? 'Text' : 'Текст'} '${keyToSave}' ${language === 'en' ? 'saved successfully!' : 'успешно сохранен!'}`);
    } catch (err: any) { 
      console.error(`Error saving single text ${keyToSave}:`, err);
      const message = err.message || `Failed to save text ${keyToSave}.`;
      setError(message);
      toast.error(message);
    } finally {
      setIsSavingSingleText(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center p-4">{error}</p>;
  }

  return (
    <Tabs defaultValue="services" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="services">{language === 'en' ? 'Services Texts' : 'Тексты Услуг'}</TabsTrigger>
        <TabsTrigger value="other">{language === 'en' ? 'Other Texts' : 'Остальные Тексты'}</TabsTrigger>
        </TabsList>

      <TabsContent value="services" className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit Service Section Content' : 'Редактировать контент секции Услуги'}</CardTitle>
                <CardDescription>
                    {language === 'en' ? 'Manage the header and individual service details.' : 'Управляйте заголовком и деталями отдельных услуг.'}
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Service Section Header' : 'Заголовок секции Услуги'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Badge (EN)</label>
                        <Input value={sectionTexts.badge_en} onChange={(e) => handleSectionInputChange('badge_en', e.target.value)} placeholder="e.g., Our Services" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Badge (RU)</label>
                        <Input value={sectionTexts.badge_ru} onChange={(e) => handleSectionInputChange('badge_ru', e.target.value)} placeholder="напр., Наши Услуги" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title (EN)</label>
                        <Input value={sectionTexts.title_en} onChange={(e) => handleSectionInputChange('title_en', e.target.value)} placeholder="e.g., Our Services" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Title (RU)</label>
                        <Input value={sectionTexts.title_ru} onChange={(e) => handleSectionInputChange('title_ru', e.target.value)} placeholder="напр., Наши Услуги" />
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Subtitle (EN)</label>
                        <Textarea value={sectionTexts.subtitle_en} onChange={(e) => handleSectionInputChange('subtitle_en', e.target.value)} placeholder="Enter subtitle in English..." rows={3} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Subtitle (RU)</label>
                        <Textarea value={sectionTexts.subtitle_ru} onChange={(e) => handleSectionInputChange('subtitle_ru', e.target.value)} placeholder="Введите подзаголовок на русском..." rows={3} />
                    </div>
                 </div>
                 <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSaveSectionTexts} disabled={isSavingSection}> 
                        {isSavingSection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                        {language === 'en' ? 'Save Section Texts' : 'Сохранить тексты секции'}
                    </Button>
                 </div>
            </CardContent>
        </Card>

        {servicesData.map((service) => (
          <Card key={service.id}>
             <CardHeader>
                <CardTitle className="capitalize">{service.id.replace(/-/g, ' ')}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (EN)</label>
                    <Input value={service.title_en} onChange={(e) => handleServiceInputChange(service.id, 'title_en', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (RU)</label>
                    <Input value={service.title_ru} onChange={(e) => handleServiceInputChange(service.id, 'title_ru', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Short Description (EN)</label>
                    <Input value={service.short_en} onChange={(e) => handleServiceInputChange(service.id, 'short_en', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Short Description (RU)</label>
                    <Input value={service.short_ru} onChange={(e) => handleServiceInputChange(service.id, 'short_ru', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Details (EN)</label>
                  <RichTextEditor value={service.details_en} onChange={(newContent) => handleDetailsChange(service.id, 'en', newContent)} placeholder="Enter detailed English description..." />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Details (RU)</label>
                  <RichTextEditor value={service.details_ru} onChange={(newContent) => handleDetailsChange(service.id, 'ru', newContent)} placeholder="Введите детальное описание на русском..." />
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={() => handleSaveService(service.id)} disabled={isSavingService === service.id}> 
                        {isSavingService === service.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                         {language === 'en' ? 'Save This Service' : 'Сохранить эту услугу'}
                    </Button>
                 </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="other" className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit General Site Texts' : 'Редактировать общие тексты сайта'}</CardTitle>
                 <CardDescription>
                     {language === 'en' ? 'Manage other text content used across the website.' : 'Управляйте другим текстовым контентом, используемым на сайте.'}
                 </CardDescription>
             </CardHeader>
        </Card>

        {/* Horizontal Navigation Buttons for Sections */}
        {generalTexts.length > 0 && (
          <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-md">
             {generalTexts.map((group) => (
                            <Button
                 key={group.section}
                 variant={selectedGeneralSection === group.section ? 'default' : 'ghost'}
                              size="sm"
                 onClick={() => setSelectedGeneralSection(group.section)}
                 className="capitalize"
                            >
                 {group.section.replace(/-/g, ' ')}
                            </Button>
             ))}
          </div>
        )}

        {/* Content Area for the Selected Section */}
        {generalTexts.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground p-4">No general site texts found (excluding services.*).</p>
        )}

        {/* Find and render the selected section's content */}
        {generalTexts.find(group => group.section === selectedGeneralSection)?.texts.map((text) => (
            <div key={text.key} className="space-y-2 border rounded-lg p-4 shadow-sm">
                {/* Header with Key and Individual Save Button */}
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-base flex-grow mr-4">{text.key}</h4>
                          <Button
                        variant="outline" 
                            size="sm"
                        onClick={() => handleSaveSingleText(text)}
                        disabled={isSavingSingleText === text.key}
                        className="whitespace-nowrap"
                    >
                         {isSavingSingleText === text.key ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        <span className="ml-2 hidden sm:inline">{language === 'en' ? 'Save' : 'Сохранить'}</span>
                          </Button>
                        </div>
                {/* Horizontal Layout for Textareas */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Value (EN)</label>
                        <Textarea
                            value={text.value_en || ''}
                            onChange={(e) => handleGeneralInputChange(selectedGeneralSection!, text.key, 'en', e.target.value)} // Use selectedGeneralSection here
                            rows={3}
                            placeholder={`Enter value for ${text.key} in English...`}
                        />
                      </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Value (RU)</label>
                        <Textarea
                            value={text.value_ru || ''}
                            onChange={(e) => handleGeneralInputChange(selectedGeneralSection!, text.key, 'ru', e.target.value)} // Use selectedGeneralSection here
                            rows={3}
                            placeholder={`Введите значение для ${text.key} на русском...`}
                        />
                    </div>
                 </div>
            </div>
        ))}

        {/* Save All Button for the Selected Section */}
        {selectedGeneralSection && generalTexts.find(group => group.section === selectedGeneralSection) && (
           <div className="flex justify-end pt-4 border-t mt-4">
                <Button 
                    onClick={() => handleSaveGeneralGroup(selectedGeneralSection)}
                    disabled={isSavingGeneral === selectedGeneralSection}
                >
                     {isSavingGeneral === selectedGeneralSection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                     {language === 'en' ? 'Save All' : 'Сохранить все'} {selectedGeneralSection.replace(/-/g, ' ')} {language === 'en' ? 'Texts' : 'Тексты'}
                </Button>
              </div>
        )}
            </TabsContent>
      </Tabs>
  )
} 