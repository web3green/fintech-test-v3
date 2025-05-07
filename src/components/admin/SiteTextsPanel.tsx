import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Plus, Trash2, Loader2, ChevronDown, ChevronUp, Edit, Check, X } from 'lucide-react'
import { toast } from "sonner"
import { databaseService } from "@/services/databaseService"
import { useLanguage } from '@/contexts/LanguageContext'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define TextBlock interface locally
interface TextBlock {
    id?: string; // Assuming id might be optional or not always needed here
    key: string;
    value_en: string | null;
    value_ru: string | null;
    section?: string | null; // Allow section to be optional
    created_at?: string;
    updated_at?: string;
}

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
  const { language, reloadTexts } = useLanguage();
  const [servicesData, setServicesData] = useState<ServiceTexts[]>([]);
  const [sectionTexts, setSectionTexts] = useState<SectionTexts>({
      badge_en: '', badge_ru: '', title_en: '', title_ru: '', subtitle_en: '', subtitle_ru: ''
  });
  // State for the new Contact/Form tab
  const [contactFormTexts, setContactFormTexts] = useState<GeneralTextGroup[]>([]); 
  // State for the remaining Other texts
  const [generalTexts, setGeneralTexts] = useState<GeneralTextGroup[]>([]); 
  // State for the new About Us tab
  const [aboutUsTexts, setAboutUsTexts] = useState<GeneralTextGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [isSavingService, setIsSavingService] = useState<string | null>(null);
  const [isSavingGeneral, setIsSavingGeneral] = useState<string | null>(null);
  const [isSavingContact, setIsSavingContact] = useState<string | null>(null);
  const [isSavingAboutUs, setIsSavingAboutUs] = useState<string | null>(null);
  const [isSavingSingleText, setIsSavingSingleText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // State to track the currently selected general/other text section for editing
  const [selectedOtherSection, setSelectedOtherSection] = useState<string | null>(null);
  // State to track the currently selected contact/form text section for editing
  const [selectedContactSection, setSelectedContactSection] = useState<string | null>(null);
  // State to track the currently selected About Us section for editing
  const [selectedAboutUsSection, setSelectedAboutUsSection] = useState<string | null>(null);
  const [otherSearchTerm, setOtherSearchTerm] = useState('');
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [aboutUsSearchTerm, setAboutUsSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');

  // States for saving status of text groups
  const [isSavingGroup, setIsSavingGroup] = useState<{ [key: string]: boolean }>({});

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
        const contactRelatedTexts: TextBlock[] = []; // New array for contact texts
        const aboutUsRelatedTexts: TextBlock[] = []; // New array for About Us texts
        const otherTexts: TextBlock[] = [];

        // Define prefixes/sections for contact-related texts
        const contactPrefixes = ['contact.', 'footer.']; 
        const contactSections = ['ContactForm', 'GetInTouch', 'ContactInfo', 'FooterContacts', 'ConsultationPanel', 'GetInTouchBanner', 'ContactCards', 'FooterInfo', 'GetInTouchHeader']; 

        // Define prefixes/sections for About Us related texts
        const aboutUsKeyPrefixes = ['about.', 'aboutus.', 'whychooseus.', 'companystats.', 'team.', 'mission.', 'values.', 'hero.', 'ourexpertise.', 'cta.']; // Added 'ourexpertise.', 'cta.'
        const aboutUsSectionNames = ['AboutUs', 'AboutHero', 'WhyChooseUs', 'CompanyStats', 'TeamSection', 'MissionVision', 'CoreValues', 'AboutPage', 'OurExpertiseWhyChooseUs', 'AboutIntro', 'AboutExpertise', 'AboutWhyChooseUs', 'AboutCTA']; // Added specific section names user might use or we generate

        allTexts.forEach(item => {
            const key = item.key || '';
            const section = item.section || '';
            
            if (key.startsWith('services.')) {
                serviceRelatedTexts.push(item);
                // ---- START MANUAL CHANGE 1 ----
                // Если это один из общих ключей секции услуг, также добавим его в otherTexts
                // чтобы он был виден и редактируем во вкладке "Остальные тексты"
                if (['services.badge', 'services.title', 'services.subtitle'].includes(key)) {
                    // Создаем копию и принудительно ставим section, чтобы он точно попал в нужную группу
                    otherTexts.push({...item, section: 'other_general_services_header'}); 
                }
                // ---- END MANUAL CHANGE 1 ----
            } else if (contactPrefixes.some(prefix => key.startsWith(prefix)) || contactSections.includes(section)) {
                contactRelatedTexts.push(item);
            } else if (aboutUsKeyPrefixes.some(prefix => key.startsWith(prefix)) || aboutUsSectionNames.includes(section)) {
                aboutUsRelatedTexts.push(item);
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

        // --- Process Contact/Form Texts ---
        const groupedContact = contactRelatedTexts.reduce<Record<string, TextBlock[]>>((acc, item) => {
             // Assign more specific section names for better grouping in the admin UI
             let sectionKey = item.section || 'contact_other'; // Default
             const key = item.key || '';

             if (!item.section) { // Only assign if section is not already set in DB
                if (key.startsWith('contact.form.') || key.startsWith('contact.service.')) {
                    sectionKey = 'ContactFormInputs';
                } else if (key.startsWith('contact.consultation.')) {
                    sectionKey = 'ConsultationPanel';
                } else if (key.startsWith('contact.instant.')) {
                    sectionKey = 'GetInTouchBanner';
                } else if (key.startsWith('contact.telegram.') || key.startsWith('contact.whatsapp.') || key.startsWith('contact.email.')) {
                    sectionKey = 'ContactCards';
                } else if (key.startsWith('footer.')) {
                    sectionKey = 'FooterInfo';
                } else if (key === 'contact.title' || key === 'contact.subtitle' || key === 'contact.cta.text') {
                     sectionKey = 'GetInTouchHeader'; // Group main title/subtitle/CTA
                }
             }
            
            if (!acc[sectionKey]) { acc[sectionKey] = []; }
            acc[sectionKey].push({ ...item, section: sectionKey }); // Ensure item has the calculated section
            return acc;
        }, {});
        const formattedContactFormTexts = Object.entries(groupedContact).map(([section, texts]) => ({
            section,
            texts: texts.sort((a, b) => a.key.localeCompare(b.key)),
        }));
        setContactFormTexts(formattedContactFormTexts);
        if (formattedContactFormTexts.length > 0 && !selectedContactSection) { // Ensure not to override
             setSelectedContactSection(formattedContactFormTexts[0].section);
        }

        // --- Process About Us Texts ---
        const groupedAboutUs = aboutUsRelatedTexts.reduce<Record<string, TextBlock[]>>((acc, item) => {
            let sectionKey = item.section || 'AboutGeneral'; // Default if no specific section
            const key = item.key || '';

            // Try to derive a more specific section from key if item.section is generic or missing
            // This logic prioritizes more specific key patterns.
            if (!item.section || item.section === 'other' || item.section === 'AboutUs' || item.section === 'AboutGeneral' || aboutUsKeyPrefixes.some(p => key.startsWith(p))) {
                if (key.startsWith('about.intro.') || key.startsWith('aboutus.intro.')) sectionKey = 'AboutIntro';
                else if (key.startsWith('hero.about.') || key.startsWith('about.hero.')) sectionKey = 'AboutHero'; // For hero section specifically within About Us context
                else if (key.startsWith('about.expertise.') || key.startsWith('ourexpertise.about.')) sectionKey = 'AboutExpertise';
                else if (key.startsWith('about.whychooseus.') || key.startsWith('whychooseus.about.')) sectionKey = 'AboutWhyChooseUs';
                else if (key.startsWith('about.cta.') || key.startsWith('cta.about.')) sectionKey = 'AboutCTA';
                else if (key.startsWith('about.team.') || key.startsWith('team.about.')) sectionKey = 'AboutTeam';
                else if (key.startsWith('about.mission.') || key.startsWith('mission.about.')) sectionKey = 'AboutMission';
                else if (key.startsWith('about.values.') || key.startsWith('values.about.')) sectionKey = 'AboutValues';
                else if (key.startsWith('companystats.') || key.startsWith('about.stats.')) sectionKey = 'AboutCompanyStats';
                // If item.section was already one of the specific names, it would be preserved unless a more specific key pattern matches.
                // If item.section from DB is specific (e.g., 'AboutIntro'), and no key pattern above matches more specifically, that DB section name is used.
            }
           
           if (!acc[sectionKey]) { acc[sectionKey] = []; }
           acc[sectionKey].push({ ...item, section: sectionKey }); 
           return acc;
       }, {});
       const formattedAboutUsTexts = Object.entries(groupedAboutUs).map(([section, texts]) => ({
           section,
           texts: texts.sort((a, b) => a.key.localeCompare(b.key)),
       }));
       setAboutUsTexts(formattedAboutUsTexts);
       if (formattedAboutUsTexts.length > 0 && !selectedAboutUsSection) {
            setSelectedAboutUsSection(formattedAboutUsTexts[0].section);
       }

        // --- Process General (Other) Texts ---
        const groupedGeneral = otherTexts.reduce<Record<string, TextBlock[]>>((acc, item) => {
             const sectionKey = item.section || item.key?.split('.')[0] || 'other'; 
            if (!acc[sectionKey]) { acc[sectionKey] = []; }
            // Проверяем, нет ли уже текста с таким же ключом в этой секции
            if (!acc[sectionKey].some(existingText => existingText.key === item.key)) {
                acc[sectionKey].push(item);
            }
            return acc;
        }, {});
        const formattedGeneral = Object.entries(groupedGeneral).map(([section, texts]) => ({
            section,
            texts: texts.sort((a, b) => a.key.localeCompare(b.key)),
        }));
        setGeneralTexts(formattedGeneral);
        // Set the initially selected other section 
        if (formattedGeneral.length > 0 && !selectedOtherSection) { // Ensure not to override if already set
             setSelectedOtherSection(formattedGeneral[0].section);
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

  const handleSaveSectionTexts = async () => {
      setIsSavingSection(true);
      setError(null);
      try {
          await Promise.all([
              databaseService.upsertSiteText('services.badge', sectionTexts.badge_en, sectionTexts.badge_ru || sectionTexts.badge_en, 'ServicesHeader'),
              databaseService.upsertSiteText('services.title', sectionTexts.title_en, sectionTexts.title_ru || sectionTexts.title_en, 'ServicesHeader'),
              databaseService.upsertSiteText('services.subtitle', sectionTexts.subtitle_en, sectionTexts.subtitle_ru || sectionTexts.subtitle_en, 'ServicesHeader'),
          ]);
          await reloadTexts();
          toast.success(language === 'en' ? 'Service section header saved successfully!' : 'Заголовок секции услуг успешно сохранен!');
      } catch (err: any) {
          console.error('Error saving section texts:', err);
          const message = err.message || 'Failed to save service section header.';
          setError(message);
          toast.error(message);
      } finally {
          setIsSavingSection(false);
      }
  };

  const handleSaveService = async (serviceId: string) => { 
      const service = servicesData.find(s => s.id === serviceId);
      if (!service) return;
      
      setIsSavingService(serviceId);
      setError(null);
      try {
          await Promise.all([
              databaseService.upsertSiteText(`services.${serviceId}.title`, service.title_en, service.title_ru || service.title_en, 'ServicesItem'),
              databaseService.upsertSiteText(`services.${serviceId}.short`, service.short_en, service.short_ru || service.short_en, 'ServicesItem'),
              databaseService.upsertSiteText(`services.${serviceId}.details`, service.details_en, service.details_ru || service.details_en, 'ServicesItem'),
          ]);
          await reloadTexts();
          toast.success(`${language === 'en' ? 'Service' : 'Услуга'} '${service.title_en}' ${language === 'en' ? 'saved successfully!' : 'успешно сохранена!'}`);
      } catch (err: any) { 
          console.error(`Error saving service ${serviceId}:`, err);
          const message = err.message || `Failed to save service ${service.title_en}.`;
          setError(message);
          toast.error(message);
      } finally {
          setIsSavingService(null);
      }
   };

  // Adapt handleGeneralInputChange for different state targets
  const handleTextGroupInputChange = (
      targetState: 'general' | 'contact' | 'aboutus',
      section: string, 
      key: string, 
      lang: 'en' | 'ru', 
      value: string
  ) => {
      const setter = targetState === 'general' ? setGeneralTexts : 
                     targetState === 'contact' ? setContactFormTexts : 
                     setAboutUsTexts; // Added 'aboutus'
      setter(prevGroups => 
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

  // Adapt handleSaveGeneralGroup for different state targets
  const handleSaveTextGroup = async (targetState: 'general' | 'contact' | 'aboutus', section: string) => {
      const state = targetState === 'general' ? generalTexts : 
                    targetState === 'contact' ? contactFormTexts :
                    aboutUsTexts; // Added 'aboutus'
      const stateSetter = targetState === 'general' ? setIsSavingGeneral : 
                          targetState === 'contact' ? setIsSavingContact :
                          setIsSavingAboutUs; // Added 'aboutus'
      
      stateSetter(section);
      setError(null);
      const groupToSave = state.find(g => g.section === section);

      if (!groupToSave) {
          toast.error(language === 'en' ? `Group ${section} not found.` : `Группа ${section} не найдена.`);
          stateSetter(null);
          return;
      }

      try {
          const promises = groupToSave.texts.map(text => 
              databaseService.upsertSiteText(text.key, text.value_en || '', text.value_ru || '', text.section)
          );
          await Promise.all(promises);
          await reloadTexts();
          toast.success(`${language === 'en' ? 'Texts for group' : 'Тексты для группы'} '${section}' ${language === 'en' ? 'saved successfully!' : 'успешно сохранены!'}`);
      } catch (err: any) { 
          console.error(`Error saving texts for group ${section}:`, err);
          const message = err.message || `Failed to save texts for group ${section}.`;
          setError(message);
          toast.error(message);
      } finally {
          stateSetter(null);
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
      await reloadTexts();
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

  // Filtering logic
  const createFilteredList = (sourceTexts: GeneralTextGroup[], term: string): GeneralTextGroup[] => {
    console.log(`[createFilteredList] Term: "${term}", Source groups:`, sourceTexts.length);
    if (!term.trim()) {
      console.log('[createFilteredList] Term is empty, returning all source texts.');
      return sourceTexts;
    }
    const lowerTerm = term.toLowerCase();
    const result = sourceTexts
      .map(group => {
        const originalGroupTextCount = group.texts.length;
        const sectionNameMatches = group.section && group.section.toLowerCase().includes(lowerTerm);
        const textsWithinGroupMatching = group.texts.filter(text =>
          (text.key && text.key.toLowerCase().includes(lowerTerm)) ||
          (text.value_en && text.value_en.toLowerCase().includes(lowerTerm)) ||
          (text.value_ru && text.value_ru.toLowerCase().includes(lowerTerm))
        );

        if (sectionNameMatches) {
          return group; 
        }
        if (textsWithinGroupMatching.length > 0) {
          return { ...group, texts: textsWithinGroupMatching }; 
        }
        return null; 
      })
      .filter(group => group !== null) as GeneralTextGroup[];
    console.log('[createFilteredList] Filtered result groups:', result.length, result);
    return result;
  };

  const filteredContactFormTexts = useMemo(() => {
    console.log('[useMemo] Filtering ContactFormTexts with term:', contactSearchTerm);
    return createFilteredList(contactFormTexts, contactSearchTerm);
  }, [contactFormTexts, contactSearchTerm]);

  const filteredAboutUsTexts = useMemo(() => {
    console.log('[useMemo] Filtering AboutUsTexts with term:', aboutUsSearchTerm);
    return createFilteredList(aboutUsTexts, aboutUsSearchTerm);
  }, [aboutUsTexts, aboutUsSearchTerm]);

  const filteredOtherGeneralTexts = useMemo(() => {
    console.log('[SiteTextsPanel] filteredOtherGeneralTexts useMemo - Source generalTexts:', generalTexts);
    console.log('[SiteTextsPanel] filteredOtherGeneralTexts useMemo - Current otherSearchTerm:', otherSearchTerm);
    return createFilteredList(generalTexts, otherSearchTerm);
  }, [generalTexts, otherSearchTerm]);

  const filteredServicesData = useMemo(() => {
    if (!serviceSearchTerm.trim()) return servicesData;
    const lowerTerm = serviceSearchTerm.toLowerCase();
    return servicesData.filter(service =>
      service.id.toLowerCase().includes(lowerTerm) ||
      service.title_en.toLowerCase().includes(lowerTerm) ||
      service.title_ru.toLowerCase().includes(lowerTerm) ||
      service.short_en.toLowerCase().includes(lowerTerm) ||
      service.short_ru.toLowerCase().includes(lowerTerm)
    );
  }, [servicesData, serviceSearchTerm]);

  // useEffects to manage selected section on search
  useEffect(() => {
    if (filteredContactFormTexts.length > 0) {
      if (!selectedContactSection || !filteredContactFormTexts.some(g => g.section === selectedContactSection)) {
        setSelectedContactSection(filteredContactFormTexts[0].section);
      }
    } else if (contactSearchTerm) { setSelectedContactSection(null); }
  }, [filteredContactFormTexts, selectedContactSection, contactSearchTerm]);

  useEffect(() => {
    if (filteredAboutUsTexts.length > 0) {
      if (!selectedAboutUsSection || !filteredAboutUsTexts.some(g => g.section === selectedAboutUsSection)) {
        setSelectedAboutUsSection(filteredAboutUsTexts[0].section);
      }
    } else if (aboutUsSearchTerm) { setSelectedAboutUsSection(null); }
  }, [filteredAboutUsTexts, selectedAboutUsSection, aboutUsSearchTerm]);

  // Clean up the useEffect for Other Texts tab selection
  useEffect(() => {
    // When the filtered list changes or search term changes
    if (filteredOtherGeneralTexts.length > 0) {
      if (!selectedOtherSection || !filteredOtherGeneralTexts.some(g => g.section === selectedOtherSection)) {
        // If no section is selected or the current selection is not in the filtered results
        console.log('[SiteTextsPanel] Auto-selecting section:', filteredOtherGeneralTexts[0].section);
        setSelectedOtherSection(filteredOtherGeneralTexts[0].section);
      }
    } else if (otherSearchTerm) {
      // If filtering resulted in no sections, clear the selection
      setSelectedOtherSection(null);
    }
  }, [filteredOtherGeneralTexts, otherSearchTerm]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center p-4">{error}</p>;
  }

  return (
    <Tabs defaultValue="services" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1"> {/* Adjusted to grid-cols-4 for medium screens and up, 2 for small */}
        <TabsTrigger value="services">{language === 'en' ? 'Services Texts' : 'Тексты Услуг'}</TabsTrigger>
        <TabsTrigger value="contact-form">{language === 'en' ? 'Contacts & Form' : 'Контакты и Форма'}</TabsTrigger>
        <TabsTrigger value="about-us">{language === 'en' ? 'About Us' : 'О Нас'}</TabsTrigger>
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

        <Input
          placeholder={language === 'en' ? 'Search services by ID, title, short description...' : 'Поиск услуг по ID, названию, краткому описанию...'}
          value={serviceSearchTerm}
          onChange={(e) => setServiceSearchTerm(e.target.value)}
          className="my-4"
        />

        {filteredServicesData.length === 0 && serviceSearchTerm && (
          <p className="text-center text-muted-foreground p-4">
            {language === 'en' ? `No services found matching "${serviceSearchTerm}".` : `Услуги, соответствующие "${serviceSearchTerm}", не найдены.`}
          </p>
        )}

        {filteredServicesData.map((service) => (
          <Collapsible key={service.id} className="border rounded-lg">
            <CollapsibleTrigger className="w-full p-4 bg-muted/50 hover:bg-muted/80 flex justify-between items-center text-left">
              {service.id.replace(/-/g, ' ')}
            </CollapsibleTrigger>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </Collapsible>
        ))}
      </TabsContent>

      <TabsContent value="contact-form" className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit Contact & Form Texts' : 'Редактировать тексты Контактов и Формы'}</CardTitle>
                 <CardDescription>
                     {language === 'en' ? 'Manage content related to contact information and consultation forms.' : 'Управляйте контентом, связанным с контактной информацией и формами консультации.'}
                 </CardDescription>
             </CardHeader>
        </Card>

      <Input 
          placeholder="Search in Contacts & Form..."
          value={contactSearchTerm}
          onChange={(e) => setContactSearchTerm(e.target.value)}
        className="mb-4"
      />

        {/* Horizontal Navigation Buttons for Contact Sections */} 
        {filteredContactFormTexts.length > 0 && (
          <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-md">
             {filteredContactFormTexts.map((group) => (
                <Button
                 key={group.section}
                 variant={selectedContactSection === group.section ? 'default' : 'ghost'}
                 size="sm"
                 onClick={() => setSelectedContactSection(group.section)}
                 className="capitalize"
                >
                 {group.section.replace(/[-_]/g, ' ')}
                </Button>
             ))}
          </div>
        )}

        {filteredContactFormTexts.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground p-4">
              {contactSearchTerm 
                ? (language === 'en' ? 'No texts found matching your search.' : 'Тексты, соответствующие вашему поиску, не найдены.') 
                : (language === 'en' ? 'No contact or form related texts found.' : 'Тексты для контактов и форм не найдены.')}
            </p>
        )}

        {/* Render the selected contact section's content */} 
        {filteredContactFormTexts.find(group => group.section === selectedContactSection)?.texts.map((text) => (
            <div key={text.key} className="space-y-2 border rounded-lg p-4 shadow-sm">
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
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                         <label className="block text-sm font-medium mb-1">Value (EN)</label>
                         <Textarea
                            value={text.value_en || ''}
                            onChange={(e) => handleTextGroupInputChange('contact', selectedContactSection!, text.key, 'en', e.target.value)}
                            rows={3}
                            placeholder={`Enter value for ${text.key} in English...`}
                         />
                    </div>
                    <div className="flex-1">
                         <label className="block text-sm font-medium mb-1">Value (RU)</label>
                         <Textarea
                            value={text.value_ru || ''}
                            onChange={(e) => handleTextGroupInputChange('contact', selectedContactSection!, text.key, 'ru', e.target.value)}
                            rows={3}
                            placeholder={`Введите значение для ${text.key} на русском...`}
                         />
                    </div>
                 </div>
            </div>
        ))}
        {/* Save All Button for the Selected Contact Section */} 
        {selectedContactSection && contactFormTexts.find(group => group.section === selectedContactSection) && (
           <div className="flex justify-end pt-4 border-t mt-4">
                <Button 
                    onClick={() => handleSaveTextGroup('contact', selectedContactSection)} 
                    disabled={isSavingContact === selectedContactSection}
                >
                     {isSavingContact === selectedContactSection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                     {language === 'en' ? 'Save All' : 'Сохранить все'} {selectedContactSection.replace(/[-_]/g, ' ')} {language === 'en' ? 'Texts' : 'Тексты'}
                </Button>
              </div>
        )}
      </TabsContent>

      <TabsContent value="about-us" className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit "About Us" Page Texts' : 'Редактировать тексты страницы "О Нас"'}</CardTitle>
                 <CardDescription>
                     {language === 'en' ? 'Manage content related to the About Us page, including intros, stats, team, mission, etc.' : 'Управляйте контентом, связанным со страницей "О Нас", включая вступления, статистику, команду, миссию и т.д.'}
                 </CardDescription>
             </CardHeader>
        </Card>

        <Input 
          placeholder={language === 'en' ? 'Search in "About Us" sections...' : 'Поиск в разделах "О Нас"...'}
          value={aboutUsSearchTerm}
          onChange={(e) => setAboutUsSearchTerm(e.target.value)}
          className="mb-4"
        />

        {/* Horizontal Navigation Buttons for About Us Sub-Sections */} 
        {filteredAboutUsTexts.length > 0 && (
          <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-md">
             {filteredAboutUsTexts.map((group) => (
                <Button
                 key={group.section}
                 variant={selectedAboutUsSection === group.section ? 'default' : 'ghost'}
                 size="sm"
                 onClick={() => setSelectedAboutUsSection(group.section)}
                 className="capitalize"
                >
                 {group.section.replace(/[-_]/g, ' ').replace(/([A-Z])/g, ' $1').trim()} {/* For better display of camelCase/PascalCase sections */}
                </Button>
             ))}
          </div>
        )}

        {filteredAboutUsTexts.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground p-4">
              {aboutUsSearchTerm 
                ? (language === 'en' ? 'No texts found matching your search.' : 'Тексты, соответствующие вашему поиску, не найдены.') 
                : (language === 'en' ? 'No "About Us" related texts found.' : 'Тексты для раздела "О Нас" не найдены.')}
            </p>
        )}

        {/* Render the selected About Us sub-section's content */} 
        {filteredAboutUsTexts.find(group => group.section === selectedAboutUsSection)?.texts.map((text) => (
            <div key={text.key} className="space-y-2 border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-base flex-grow mr-4">{text.key}</h4>
                    <Button
                         variant="outline" 
                         size="sm"
                         onClick={() => handleSaveSingleText(text)} // Uses existing single save
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
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                         <label className="block text-sm font-medium mb-1">Value (EN)</label>
                         <Textarea
                            value={text.value_en || ''}
                            onChange={(e) => handleTextGroupInputChange('aboutus', selectedAboutUsSection!, text.key, 'en', e.target.value)}
                            rows={3}
                            placeholder={`Enter value for ${text.key} in English...`}
                         />
                    </div>
                    <div className="flex-1">
                         <label className="block text-sm font-medium mb-1">Value (RU)</label>
                         <Textarea
                            value={text.value_ru || ''}
                            onChange={(e) => handleTextGroupInputChange('aboutus', selectedAboutUsSection!, text.key, 'ru', e.target.value)}
                            rows={3}
                            placeholder={`Введите значение для ${text.key} на русском...`}
                         />
                    </div>
                 </div>
            </div>
        ))}
        {/* Save All Button for the Selected About Us Sub-Section */} 
        {selectedAboutUsSection && aboutUsTexts.find(group => group.section === selectedAboutUsSection) && (
           <div className="flex justify-end pt-4 border-t mt-4">
                <Button 
                    onClick={() => handleSaveTextGroup('aboutus', selectedAboutUsSection)} 
                    disabled={isSavingAboutUs === selectedAboutUsSection}
                >
                     {isSavingAboutUs === selectedAboutUsSection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                     {language === 'en' ? 'Save All' : 'Сохранить все'} {selectedAboutUsSection.replace(/[-_]/g, ' ').replace(/([A-Z])/g, ' $1').trim()} {language === 'en' ? 'Texts' : 'Тексты'}
                </Button>
              </div>
        )}
      </TabsContent>

      <TabsContent value="other" className="space-y-6">
         <Card>
            <CardHeader>
                <CardTitle>{language === 'en' ? 'Edit Other Site Texts' : 'Редактировать Остальные Тексты Сайта'}</CardTitle>
                 <CardDescription>
                     {language === 'en' ? 'Manage miscellaneous text content not covered in other sections.' : 'Управляйте прочим текстовым контентом, не вошедшим в другие разделы.'}
                 </CardDescription>
             </CardHeader>
        </Card>

        {/* Search Input for Other Texts */}
        <div className="px-1 py-2"> {/* Added padding similar to other controls if needed */}
          <Input
            placeholder={language === 'en' ? 'Search in Other Texts (key, EN, RU, section)...' : 'Поиск по Остальным Текстам (ключ, EN, RU, секция)...'}
            value={otherSearchTerm}
            onChange={(e) => setOtherSearchTerm(e.target.value)}
            className="w-full md:max-w-lg"
          />
        </div>

        {/* Horizontal Navigation Buttons for Other Sections */} 
        {filteredOtherGeneralTexts.length > 0 && (
          <div className="flex flex-wrap gap-2 p-1 bg-muted rounded-md mb-4">
             {/* Create simple buttons that use direct onClick without complex state management */}
             {filteredOtherGeneralTexts.map((group) => {
                const isActive = selectedOtherSection === group.section;
                return (
                  <button
                    key={group.section}
                    className={`px-3 py-1.5 text-sm rounded font-medium capitalize ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background text-foreground hover:bg-secondary'
                    }`}
                    onClick={() => {
                      console.log('[SiteTextsPanel] Button clicked for section:', group.section);
                      // No dependencies, directly set the state
                      setSelectedOtherSection(group.section);
                    }}
                  >
                    {group.section.replace(/[-_]/g, ' ')}
                  </button>
                );
             })}
          </div>
        )}

        {/* Debug info to help diagnose issues */}
        <div className="text-xs text-muted-foreground mb-4 border-b pb-2">
          <p>Selected section: <strong>{selectedOtherSection || 'none'}</strong></p>
          <p>Available sections: {filteredOtherGeneralTexts.length}</p>
        </div>
        
        {/* Message when no texts are available or search yields no results */}
        {!isLoading && filteredOtherGeneralTexts.length === 0 && (
            <p className="text-center text-muted-foreground p-4">
              {otherSearchTerm 
                ? (language === 'en' ? 'No texts found matching your search.' : 'Тексты, соответствующие вашему поиску, не найдены.') 
                : (language === 'en' ? 'No other site texts found.' : 'Остальные тексты сайта не найдены.')}
            </p>
        )}
        
        {/* Render the selected other section's content - using filteredGeneralTexts */} 
        {filteredOtherGeneralTexts.find(group => group.section === selectedOtherSection)?.texts.map((text) => (
            <div key={text.key} className="space-y-2 border rounded-lg p-4 shadow-sm">
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
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                         <label className="block text-sm font-medium mb-1">Value (EN)</label>
                         <Textarea
                            value={text.value_en || ''}
                            onChange={(e) => handleTextGroupInputChange('general', selectedOtherSection!, text.key, 'en', e.target.value)}
                            rows={3}
                            placeholder={`Enter value for ${text.key} in English...`}
                         />
                      </div>
                    <div className="flex-1">
                         <label className="block text-sm font-medium mb-1">Value (RU)</label>
                         <Textarea
                            value={text.value_ru || ''}
                            onChange={(e) => handleTextGroupInputChange('general', selectedOtherSection!, text.key, 'ru', e.target.value)}
                            rows={3}
                            placeholder={`Введите значение для ${text.key} на русском...`}
                         />
                    </div>
                 </div>
            </div>
        ))}
        {/* Save All Button for the Selected Other Section */} 
        {selectedOtherSection && generalTexts.find(group => group.section === selectedOtherSection) && (
           <div className="flex justify-end pt-4 border-t mt-4">
                <Button 
                    onClick={() => handleSaveTextGroup('general', selectedOtherSection)} 
                    disabled={isSavingGeneral === selectedOtherSection}
                >
                     {isSavingGeneral === selectedOtherSection && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                     {language === 'en' ? 'Save All' : 'Сохранить все'} {selectedOtherSection.replace(/[-_]/g, ' ')} {language === 'en' ? 'Texts' : 'Тексты'}
                </Button>
              </div>
        )}
            </TabsContent>
      </Tabs>
  )
} 