import React, { useState, useEffect } from 'react';
import { databaseService } from '@/services/databaseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

export function HeroSectionAdmin() {
  const [titleEn, setTitleEn] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [subtitleRu, setSubtitleRu] = useState('');
  const [buttonTextEn, setButtonTextEn] = useState('');
  const [buttonTextRu, setButtonTextRu] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const { reloadTexts } = useLanguage();

  useEffect(() => {
    const fetchHeroData = async () => {
      setIsFetching(true);
      try {
        const [titleData, subtitleData, buttonData] = await Promise.all([
          databaseService.getSiteText('hero_title'),
          databaseService.getSiteText('hero_subtitle'),
          databaseService.getSiteText('hero_button_text')
        ]);
        setTitleEn(titleData?.value_en || '');
        setTitleRu(titleData?.value_ru || '');
        setSubtitleEn(subtitleData?.value_en || '');
        setSubtitleRu(subtitleData?.value_ru || '');
        setButtonTextEn(buttonData?.value_en || '');
        setButtonTextRu(buttonData?.value_ru || '');
      } catch (err) {
        setError('Failed to load hero section data.');
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchHeroData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const titleEnInput = titleEn;
    const titleRuInput = titleRu;
    const subtitleEnInput = subtitleEn;
    const subtitleRuInput = subtitleRu;
    const buttonTextEnInput = buttonTextEn;
    const buttonTextRuInput = buttonTextRu;

    try {
      if (!titleEnInput || !subtitleEnInput || !buttonTextEnInput) {
        throw new Error('English fields (Title, Subtitle, Button Text) are required.');
      }
      
      const titleRu = titleRuInput || titleEnInput;
      const subtitleRu = subtitleRuInput || subtitleEnInput;
      const buttonTextRu = buttonTextRuInput || buttonTextEnInput;
      
      await Promise.all([
        databaseService.upsertSiteText('hero_title', titleEnInput, titleRu, 'Hero'),
        databaseService.upsertSiteText('hero_subtitle', subtitleEnInput, subtitleRu, 'Hero'),
        databaseService.upsertSiteText('hero_button_text', buttonTextEnInput, buttonTextRu, 'Hero')
      ]);

      await reloadTexts();

      setSuccess('Hero section updated successfully!');
      setError(null);
    } catch (err) {
      console.error('Error saving hero section:', err);
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
      <h3 className="text-lg font-medium">Hero Section</h3>
      
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
          <Label htmlFor="titleEn">Title (English)</Label>
          <Input id="titleEn" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="titleRu">Title (Russian)</Label>
          <Input id="titleRu" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subtitleEn">Subtitle (English)</Label>
          <Input id="subtitleEn" value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitleRu">Subtitle (Russian)</Label>
          <Input id="subtitleRu" value={subtitleRu} onChange={(e) => setSubtitleRu(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buttonTextEn">Button Text (English)</Label>
          <Input id="buttonTextEn" value={buttonTextEn} onChange={(e) => setButtonTextEn(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buttonTextRu">Button Text (Russian)</Label>
          <Input id="buttonTextRu" value={buttonTextRu} onChange={(e) => setButtonTextRu(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Save Hero Section
      </Button>
    </div>
  );
} 