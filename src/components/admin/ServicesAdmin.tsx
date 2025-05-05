import React, { useState, useEffect, useCallback } from 'react';
import { databaseService } from '@/services/databaseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

// Define a type for a single service item's state
type ServiceItemState = {
    icon: string;
    titleEn: string;
    titleRu: string;
    descriptionEn: string;
    descriptionRu: string;
};

export function ServicesAdmin() {
    // Section Title and Description
    const [sectionTitleEn, setSectionTitleEn] = useState('');
    const [sectionTitleRu, setSectionTitleRu] = useState('');
    const [sectionDescEn, setSectionDescEn] = useState('');
    const [sectionDescRu, setSectionDescRu] = useState('');

    // Service Items (assuming 3 items based on typical layout)
    const [item1, setItem1] = useState<ServiceItemState>({ icon: '', titleEn: '', titleRu: '', descriptionEn: '', descriptionRu: '' });
    const [item2, setItem2] = useState<ServiceItemState>({ icon: '', titleEn: '', titleRu: '', descriptionEn: '', descriptionRu: '' });
    const [item3, setItem3] = useState<ServiceItemState>({ icon: '', titleEn: '', titleRu: '', descriptionEn: '', descriptionRu: '' });

    // General Admin State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    const { reloadTexts } = useLanguage();

    const fetchData = useCallback(async () => {
        setIsFetching(true);
        setError(null);
        try {
            const data = await databaseService.getSiteTextsByPrefix('services_');
            const dataMap = data.reduce((acc, item) => {
                acc[item.key] = { value_en: item.value_en, value_ru: item.value_ru };
                return acc;
            }, {} as Record<string, { value_en: string; value_ru: string | null }>);

            // Section Texts
            setSectionTitleEn(dataMap['services_section_title']?.value_en || '');
            setSectionTitleRu(dataMap['services_section_title']?.value_ru || '');
            setSectionDescEn(dataMap['services_section_description']?.value_en || '');
            setSectionDescRu(dataMap['services_section_description']?.value_ru || '');

            // Item 1
            setItem1({
                icon: dataMap['services_item1_icon']?.value_en || '', // Icon stored in value_en
                titleEn: dataMap['services_item1_title']?.value_en || '',
                titleRu: dataMap['services_item1_title']?.value_ru || '',
                descriptionEn: dataMap['services_item1_description']?.value_en || '',
                descriptionRu: dataMap['services_item1_description']?.value_ru || '',
            });
            // Item 2
            setItem2({
                icon: dataMap['services_item2_icon']?.value_en || '',
                titleEn: dataMap['services_item2_title']?.value_en || '',
                titleRu: dataMap['services_item2_title']?.value_ru || '',
                descriptionEn: dataMap['services_item2_description']?.value_en || '',
                descriptionRu: dataMap['services_item2_description']?.value_ru || '',
            });
            // Item 3
            setItem3({
                icon: dataMap['services_item3_icon']?.value_en || '',
                titleEn: dataMap['services_item3_title']?.value_en || '',
                titleRu: dataMap['services_item3_title']?.value_ru || '',
                descriptionEn: dataMap['services_item3_description']?.value_en || '',
                descriptionRu: dataMap['services_item3_description']?.value_ru || '',
            });

        } catch (err) {
            setError('Failed to load Services section data.');
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleItemChange = (
        itemIndex: 1 | 2 | 3, 
        field: keyof ServiceItemState, 
        value: string
    ) => {
        const setter = itemIndex === 1 ? setItem1 : itemIndex === 2 ? setItem2 : setItem3;
        setter(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Basic validation (add more as needed)
            if (!sectionTitleEn || !item1.titleEn || !item2.titleEn || !item3.titleEn) {
                throw new Error('Section Title and English titles for all service items are required.');
            }

            // Prepare data for upsert, handling fallbacks
            const upserts = [
                // Section texts
                databaseService.upsertSiteText('services_section_title', sectionTitleEn, sectionTitleRu || sectionTitleEn, 'Services'),
                databaseService.upsertSiteText('services_section_description', sectionDescEn, sectionDescRu || sectionDescEn, 'Services'),
                // Item 1 texts
                databaseService.upsertSiteText('services_item1_icon', item1.icon, item1.icon, 'Services'), // Icon only needs EN
                databaseService.upsertSiteText('services_item1_title', item1.titleEn, item1.titleRu || item1.titleEn, 'Services'),
                databaseService.upsertSiteText('services_item1_description', item1.descriptionEn, item1.descriptionRu || item1.descriptionEn, 'Services'),
                // Item 2 texts
                databaseService.upsertSiteText('services_item2_icon', item2.icon, item2.icon, 'Services'),
                databaseService.upsertSiteText('services_item2_title', item2.titleEn, item2.titleRu || item2.titleEn, 'Services'),
                databaseService.upsertSiteText('services_item2_description', item2.descriptionEn, item2.descriptionRu || item2.descriptionEn, 'Services'),
                // Item 3 texts
                databaseService.upsertSiteText('services_item3_icon', item3.icon, item3.icon, 'Services'),
                databaseService.upsertSiteText('services_item3_title', item3.titleEn, item3.titleRu || item3.titleEn, 'Services'),
                databaseService.upsertSiteText('services_item3_description', item3.descriptionEn, item3.descriptionRu || item3.descriptionEn, 'Services'),
            ];

            await Promise.all(upserts);

            await reloadTexts(); // Reload texts after successful save

            setSuccess('Services section updated successfully!');
            setError(null);
        } catch (err) {
            console.error('Error saving Services section:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-fintech-blue" /></div>;
    }

    // Helper to render inputs for a service item
    const renderServiceItemInputs = (item: ServiceItemState, itemIndex: 1 | 2 | 3) => (
        <div key={itemIndex} className="space-y-4 p-4 border rounded-md bg-muted/40">
            <h4 className="font-medium text-md">Service Item {itemIndex}</h4>
             <div className="space-y-2">
                 <Label htmlFor={`item${itemIndex}Icon`}>Icon Name (e.g., 'briefcase', 'check-circle')</Label>
                 <Input 
                    id={`item${itemIndex}Icon`} 
                    value={item.icon} 
                    onChange={(e) => handleItemChange(itemIndex, 'icon', e.target.value)} 
                    placeholder="Icon name from lucide-react"
                 />
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`item${itemIndex}TitleEn`}>Title (English)</Label>
                    <Input id={`item${itemIndex}TitleEn`} value={item.titleEn} onChange={(e) => handleItemChange(itemIndex, 'titleEn', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`item${itemIndex}TitleRu`}>Title (Russian)</Label>
                    <Input id={`item${itemIndex}TitleRu`} value={item.titleRu} onChange={(e) => handleItemChange(itemIndex, 'titleRu', e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                     <Label htmlFor={`item${itemIndex}DescEn`}>Description (English)</Label>
                     <Textarea id={`item${itemIndex}DescEn`} value={item.descriptionEn} onChange={(e) => handleItemChange(itemIndex, 'descriptionEn', e.target.value)} rows={3} />
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor={`item${itemIndex}DescRu`}>Description (Russian)</Label>
                     <Textarea id={`item${itemIndex}DescRu`} value={item.descriptionRu} onChange={(e) => handleItemChange(itemIndex, 'descriptionRu', e.target.value)} rows={3} />
                 </div>
             </div>
        </div>
    );

    return (
        <div className="space-y-6 p-4 border rounded-md bg-card shadow">
            <h3 className="text-lg font-medium">Services Section</h3>
            
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert variant="default">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Section Title Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="servicesSectionTitleEn">Section Title (English)</Label>
                    <Input id="servicesSectionTitleEn" value={sectionTitleEn} onChange={(e) => setSectionTitleEn(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="servicesSectionTitleRu">Section Title (Russian)</Label>
                    <Input id="servicesSectionTitleRu" value={sectionTitleRu} onChange={(e) => setSectionTitleRu(e.target.value)} />
                </div>
            </div>
            {/* Section Description Fields */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="servicesSectionDescEn">Section Description (English)</Label>
                    <Textarea id="servicesSectionDescEn" value={sectionDescEn} onChange={(e) => setSectionDescEn(e.target.value)} rows={3}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="servicesSectionDescRu">Section Description (Russian)</Label>
                    <Textarea id="servicesSectionDescRu" value={sectionDescRu} onChange={(e) => setSectionDescRu(e.target.value)} rows={3}/>
                </div>
            </div>

            <div className="space-y-6 mt-4 pt-4 border-t">
                 {renderServiceItemInputs(item1, 1)}
                 {renderServiceItemInputs(item2, 2)}
                 {renderServiceItemInputs(item3, 3)}
            </div>


            <Button onClick={handleSave} disabled={loading || isFetching}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Services Section
            </Button>
        </div>
    );
} 