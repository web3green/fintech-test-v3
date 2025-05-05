import React, { useState, useEffect, useCallback } from 'react';
import { databaseService } from '@/services/databaseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

export function AboutUsAdmin() {
    const [titleEn, setTitleEn] = useState('');
    const [titleRu, setTitleRu] = useState('');
    const [textEn, setTextEn] = useState('');
    const [textRu, setTextRu] = useState('');
    const [stat1Num, setStat1Num] = useState('');
    const [stat1LabelEn, setStat1LabelEn] = useState('');
    const [stat1LabelRu, setStat1LabelRu] = useState('');
    const [stat2Num, setStat2Num] = useState('');
    const [stat2LabelEn, setStat2LabelEn] = useState('');
    const [stat2LabelRu, setStat2LabelRu] = useState('');
    const [stat3Num, setStat3Num] = useState('');
    const [stat3LabelEn, setStat3LabelEn] = useState('');
    const [stat3LabelRu, setStat3LabelRu] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    const { reloadTexts } = useLanguage();

    const fetchData = useCallback(async () => {
        setIsFetching(true);
        try {
            const data = await databaseService.getSiteTextsByPrefix('about_');
            const dataMap = data.reduce((acc, item) => {
                acc[item.key] = { value_en: item.value_en, value_ru: item.value_ru };
                return acc;
            }, {} as Record<string, { value_en: string; value_ru: string | null }>);

            setTitleEn(dataMap['about_title']?.value_en || '');
            setTitleRu(dataMap['about_title']?.value_ru || '');
            setTextEn(dataMap['about_text']?.value_en || '');
            setTextRu(dataMap['about_text']?.value_ru || '');
            setStat1Num(dataMap['about_stat1_num']?.value_en || '');
            setStat1LabelEn(dataMap['about_stat1_label']?.value_en || '');
            setStat1LabelRu(dataMap['about_stat1_label']?.value_ru || '');
            setStat2Num(dataMap['about_stat2_num']?.value_en || '');
            setStat2LabelEn(dataMap['about_stat2_label']?.value_en || '');
            setStat2LabelRu(dataMap['about_stat2_label']?.value_ru || '');
            setStat3Num(dataMap['about_stat3_num']?.value_en || '');
            setStat3LabelEn(dataMap['about_stat3_label']?.value_en || '');
            setStat3LabelRu(dataMap['about_stat3_label']?.value_ru || '');

        } catch (err) {
            setError('Failed to load About Us data.');
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const titleEnInput = titleEn;
        const titleRuInput = titleRu;
        const textEnInput = textEn;
        const textRuInput = textRu;
        const stat1NumInput = stat1Num;
        const stat1LabelEnInput = stat1LabelEn;
        const stat1LabelRuInput = stat1LabelRu;
        const stat2NumInput = stat2Num;
        const stat2LabelEnInput = stat2LabelEn;
        const stat2LabelRuInput = stat2LabelRu;
        const stat3NumInput = stat3Num;
        const stat3LabelEnInput = stat3LabelEn;
        const stat3LabelRuInput = stat3LabelRu;

        try {
            if (!titleEnInput || !textEnInput || !stat1NumInput || !stat1LabelEnInput || 
                !stat2NumInput || !stat2LabelEnInput || !stat3NumInput || !stat3LabelEnInput) {
                throw new Error('English fields (Title, Text) and all Stat fields (Number, English Label) are required.');
            }

            const titleRu = titleRuInput || titleEnInput;
            const textRu = textRuInput || textEnInput;
            const stat1LabelRu = stat1LabelRuInput || stat1LabelEnInput;
            const stat2LabelRu = stat2LabelRuInput || stat2LabelEnInput;
            const stat3LabelRu = stat3LabelRuInput || stat3LabelEnInput;

            await Promise.all([
                databaseService.upsertSiteText('about_title', titleEnInput, titleRu, 'AboutUs'),
                databaseService.upsertSiteText('about_text', textEnInput, textRu, 'AboutUs'),
                databaseService.upsertSiteText('about_stat1_num', stat1NumInput, stat1NumInput, 'AboutUs'),
                databaseService.upsertSiteText('about_stat1_label', stat1LabelEnInput, stat1LabelRu, 'AboutUs'),
                databaseService.upsertSiteText('about_stat2_num', stat2NumInput, stat2NumInput, 'AboutUs'),
                databaseService.upsertSiteText('about_stat2_label', stat2LabelEnInput, stat2LabelRu, 'AboutUs'),
                databaseService.upsertSiteText('about_stat3_num', stat3NumInput, stat3NumInput, 'AboutUs'),
                databaseService.upsertSiteText('about_stat3_label', stat3LabelEnInput, stat3LabelRu, 'AboutUs')
            ]);

            await reloadTexts();

            setSuccess('About Us section updated successfully!');
            setError(null);
        } catch (err) {
            console.error('Error saving About Us section:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-fintech-blue" /></div>;
    }

    return (
        <div className="space-y-6 p-4 border rounded-md bg-card shadow">
            <h3 className="text-lg font-medium">About Us Section</h3>
            
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="aboutTitleEn">Title (English)</Label>
                    <Input id="aboutTitleEn" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="aboutTitleRu">Title (Russian)</Label>
                    <Input id="aboutTitleRu" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="aboutTextEn">Text (English)</Label>
                    <Textarea id="aboutTextEn" value={textEn} onChange={(e) => setTextEn(e.target.value)} rows={6} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="aboutTextRu">Text (Russian)</Label>
                    <Textarea id="aboutTextRu" value={textRu} onChange={(e) => setTextRu(e.target.value)} rows={6} />
                </div>
            </div>

            <div className="space-y-4 mt-4 pt-4 border-t">
                <h4 className="text-md font-medium">Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="stat1Num">Stat 1 - Number</Label>
                        <Input id="stat1Num" value={stat1Num} onChange={(e) => setStat1Num(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stat1LabelEn">Stat 1 - Label (English)</Label>
                        <Input id="stat1LabelEn" value={stat1LabelEn} onChange={(e) => setStat1LabelEn(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stat1LabelRu">Stat 1 - Label (Russian)</Label>
                        <Input id="stat1LabelRu" value={stat1LabelRu} onChange={(e) => setStat1LabelRu(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="stat2Num">Stat 2 - Number</Label>
                        <Input id="stat2Num" value={stat2Num} onChange={(e) => setStat2Num(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stat2LabelEn">Stat 2 - Label (English)</Label>
                        <Input id="stat2LabelEn" value={stat2LabelEn} onChange={(e) => setStat2LabelEn(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stat2LabelRu">Stat 2 - Label (Russian)</Label>
                        <Input id="stat2LabelRu" value={stat2LabelRu} onChange={(e) => setStat2LabelRu(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="stat3Num">Stat 3 - Number</Label>
                        <Input id="stat3Num" value={stat3Num} onChange={(e) => setStat3Num(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stat3LabelEn">Stat 3 - Label (English)</Label>
                        <Input id="stat3LabelEn" value={stat3LabelEn} onChange={(e) => setStat3LabelEn(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stat3LabelRu">Stat 3 - Label (Russian)</Label>
                        <Input id="stat3LabelRu" value={stat3LabelRu} onChange={(e) => setStat3LabelRu(e.target.value)} />
                    </div>
                </div>
            </div>

            <Button onClick={handleSave} disabled={loading || isFetching}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save About Us Section
            </Button>
        </div>
    );
} 