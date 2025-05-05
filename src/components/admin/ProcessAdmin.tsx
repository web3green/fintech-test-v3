import React, { useState, useEffect, useCallback } from 'react';
import { databaseService } from '@/services/databaseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

// Define a type for a single process step's state
type ProcessStepState = {
    titleEn: string;
    titleRu: string;
    descriptionEn: string;
    descriptionRu: string;
};

export function ProcessAdmin() {
    // Section Title and Description
    const [sectionTitleEn, setSectionTitleEn] = useState('');
    const [sectionTitleRu, setSectionTitleRu] = useState('');
    const [sectionDescEn, setSectionDescEn] = useState('');
    const [sectionDescRu, setSectionDescRu] = useState('');

    // Process Steps (assuming 4 steps)
    const [step1, setStep1] = useState<ProcessStepState>({ titleEn: '', titleRu: '', descriptionEn: '', descriptionRu: '' });
    const [step2, setStep2] = useState<ProcessStepState>({ titleEn: '', titleRu: '', descriptionEn: '', descriptionRu: '' });
    const [step3, setStep3] = useState<ProcessStepState>({ titleEn: '', titleRu: '', descriptionEn: '', descriptionRu: '' });
    const [step4, setStep4] = useState<ProcessStepState>({ titleEn: '', titleRu: '', descriptionEn: '', descriptionRu: '' });

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
            const data = await databaseService.getSiteTextsByPrefix('process_');
            const dataMap = data.reduce((acc, item) => {
                acc[item.key] = { value_en: item.value_en, value_ru: item.value_ru };
                return acc;
            }, {} as Record<string, { value_en: string; value_ru: string | null }>);

            // Section Texts
            setSectionTitleEn(dataMap['process_section_title']?.value_en || '');
            setSectionTitleRu(dataMap['process_section_title']?.value_ru || '');
            setSectionDescEn(dataMap['process_section_description']?.value_en || '');
            setSectionDescRu(dataMap['process_section_description']?.value_ru || '');

            // Steps Data
            const stepsData: ProcessStepState[] = [step1, step2, step3, step4];
            const stepSetters = [setStep1, setStep2, setStep3, setStep4];

            for (let i = 0; i < 4; i++) {
                stepSetters[i]({
                    titleEn: dataMap[`process_step${i + 1}_title`]?.value_en || '',
                    titleRu: dataMap[`process_step${i + 1}_title`]?.value_ru || '',
                    descriptionEn: dataMap[`process_step${i + 1}_description`]?.value_en || '',
                    descriptionRu: dataMap[`process_step${i + 1}_description`]?.value_ru || '',
                });
            }

        } catch (err) {
            setError('Failed to load Process section data.');
            console.error(err);
        } finally {
            setIsFetching(false);
        }
    }, []); // Removed step states from dependencies as they are updated inside

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStepChange = (
        stepIndex: 1 | 2 | 3 | 4,
        field: keyof ProcessStepState,
        value: string
    ) => {
        const setter = stepIndex === 1 ? setStep1 : stepIndex === 2 ? setStep2 : stepIndex === 3 ? setStep3 : setStep4;
        setter(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Basic validation
            if (!sectionTitleEn || !step1.titleEn || !step2.titleEn || !step3.titleEn || !step4.titleEn) {
                throw new Error('Section Title and English titles for all process steps are required.');
            }

            // Prepare data for upsert
            const upserts = [
                // Section texts
                databaseService.upsertSiteText('process_section_title', sectionTitleEn, sectionTitleRu || sectionTitleEn, 'Process'),
                databaseService.upsertSiteText('process_section_description', sectionDescEn, sectionDescRu || sectionDescEn, 'Process'),
            ];

            // Add steps texts
            const stepsData = [step1, step2, step3, step4];
            stepsData.forEach((step, index) => {
                const stepNum = index + 1;
                upserts.push(
                    databaseService.upsertSiteText(`process_step${stepNum}_title`, step.titleEn, step.titleRu || step.titleEn, 'Process'),
                    databaseService.upsertSiteText(`process_step${stepNum}_description`, step.descriptionEn, step.descriptionRu || step.descriptionEn, 'Process')
                );
            });

            await Promise.all(upserts);

            await reloadTexts(); // Reload texts after successful save

            setSuccess('Process section updated successfully!');
            setError(null);
        } catch (err) {
            console.error('Error saving Process section:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-fintech-blue" /></div>;
    }

    // Helper to render inputs for a process step
    const renderProcessStepInputs = (step: ProcessStepState, stepIndex: 1 | 2 | 3 | 4) => (
        <div key={stepIndex} className="space-y-4 p-4 border rounded-md bg-muted/40">
            <h4 className="font-medium text-md">Step {stepIndex}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`step${stepIndex}TitleEn`}>Title (English)</Label>
                    <Input id={`step${stepIndex}TitleEn`} value={step.titleEn} onChange={(e) => handleStepChange(stepIndex, 'titleEn', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`step${stepIndex}TitleRu`}>Title (Russian)</Label>
                    <Input id={`step${stepIndex}TitleRu`} value={step.titleRu} onChange={(e) => handleStepChange(stepIndex, 'titleRu', e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                     <Label htmlFor={`step${stepIndex}DescEn`}>Description (English)</Label>
                     <Textarea id={`step${stepIndex}DescEn`} value={step.descriptionEn} onChange={(e) => handleStepChange(stepIndex, 'descriptionEn', e.target.value)} rows={3} />
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor={`step${stepIndex}DescRu`}>Description (Russian)</Label>
                     <Textarea id={`step${stepIndex}DescRu`} value={step.descriptionRu} onChange={(e) => handleStepChange(stepIndex, 'descriptionRu', e.target.value)} rows={3} />
                 </div>
             </div>
        </div>
    );

    return (
        <div className="space-y-6 p-4 border rounded-md bg-card shadow">
            <h3 className="text-lg font-medium">Process Section (How It Works)</h3>
            
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
                    <Label htmlFor="processSectionTitleEn">Section Title (English)</Label>
                    <Input id="processSectionTitleEn" value={sectionTitleEn} onChange={(e) => setSectionTitleEn(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="processSectionTitleRu">Section Title (Russian)</Label>
                    <Input id="processSectionTitleRu" value={sectionTitleRu} onChange={(e) => setSectionTitleRu(e.target.value)} />
                </div>
            </div>
            {/* Section Description Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                     <Label htmlFor="processSectionDescEn">Section Description (English)</Label>
                     <Textarea id="processSectionDescEn" value={sectionDescEn} onChange={(e) => setSectionDescEn(e.target.value)} rows={3}/>
                 </div>
                 <div className="space-y-2">
                     <Label htmlFor="processSectionDescRu">Section Description (Russian)</Label>
                     <Textarea id="processSectionDescRu" value={sectionDescRu} onChange={(e) => setSectionDescRu(e.target.value)} rows={3}/>
                 </div>
             </div>

            <div className="space-y-6 mt-4 pt-4 border-t">
                 {renderProcessStepInputs(step1, 1)}
                 {renderProcessStepInputs(step2, 2)}
                 {renderProcessStepInputs(step3, 3)}
                 {renderProcessStepInputs(step4, 4)}
            </div>


            <Button onClick={handleSave} disabled={loading || isFetching}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Process Section
            </Button>
        </div>
    );
} 