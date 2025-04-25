import React, { useState, useEffect } from 'react';
import chatbotResponsesData from '@/data/chatbotResponses.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Use Textarea for longer responses
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ChatbotResponseEntry {
  key: string;
  content: {
    en: string;
    ru: string;
  };
}

export const ChatbotResponsesPanel: React.FC = () => {
  // Load initial data directly from JSON import
  const [responses, setResponses] = useState<ChatbotResponseEntry[]>(chatbotResponsesData);
  const [editingResponses, setEditingResponses] = useState<Record<string, ChatbotResponseEntry["content"]>>({});

  const handleResponseChange = (key: string, field: 'en' | 'ru', value: string) => {
    setEditingResponses(prev => {
      const currentContent = prev[key] || responses.find(r => r.key === key)?.content;
      return {
        ...prev,
        [key]: {
          ...currentContent,
          [field]: value,
        },
      };
    });
  };

  const handleSaveChanges = (key: string) => {
    const updatedContent = editingResponses[key];
    if (!updatedContent) return;

    setResponses(prev => 
      prev.map(response => 
        response.key === key ? { ...response, content: updatedContent } : response
      )
    );
    
    // Clear editing state for this key
    setEditingResponses(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
    toast.success(`Response for "${key}" updated in memory. Download JSON to save permanently.`);
  };

  const handleDownloadJson = () => {
    const jsonString = JSON.stringify(responses, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chatbotResponses.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.info('JSON file generated. Replace the existing file in src/data/ and redeploy.');
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Edit Chatbot Responses</h2>
        <Button onClick={handleDownloadJson}>
          <Download className="mr-2 h-4 w-4" />
          Generate & Download Updated JSON
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Edit the responses below. Changes are temporary until you download the JSON file, replace the existing \`src/data/chatbotResponses.json\`, commit, and redeploy the application.
      </p>

      <div className="space-y-4">
        {responses.map((response) => (
          <Card key={response.key}>
            <CardHeader>
               <CardTitle className="flex justify-between items-center">
                 <span>{response.key}</span>
                 {editingResponses[response.key] && (
                   <Button
                     size="sm"
                     onClick={() => handleSaveChanges(response.key)}
                   >
                     <Save className="mr-2 h-4 w-4" />
                     Update in Memory
                   </Button>
                 )}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor={`${response.key}-en`} className="text-sm font-medium text-muted-foreground">English</label>
                <Textarea
                  id={`${response.key}-en`}
                  value={editingResponses[response.key]?.en ?? response.content.en}
                  onChange={(e) => handleResponseChange(response.key, 'en', e.target.value)}
                  placeholder="English Response"
                  rows={3} // Use Textarea for potentially longer responses
                />
              </div>
              <div>
                 <label htmlFor={`${response.key}-ru`} className="text-sm font-medium text-muted-foreground">Russian</label>
                <Textarea
                  id={`${response.key}-ru`}
                  value={editingResponses[response.key]?.ru ?? response.content.ru}
                  onChange={(e) => handleResponseChange(response.key, 'ru', e.target.value)}
                  placeholder="Russian Response"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 