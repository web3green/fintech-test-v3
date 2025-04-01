import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Search, Pencil, Save, Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useSiteTexts, TextBlock } from '@/services/siteTextsService';

// Функция для очистки HTML-разметки
const stripHtml = (html: string): string => {
  // Создаем временный div для преобразования HTML в текст
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Функция для проверки, содержит ли строка HTML-теги
const containsHtmlTags = (str: string): boolean => {
  return /<\/?[a-z][\s\S]*>/i.test(str);
};

export const SiteTextsPanel = () => {
  const { language } = useLanguage();
  const { texts, addText, updateText, deleteText } = useSiteTexts();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingText, setEditingText] = useState<TextBlock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // Фильтрация текстов по поисковому запросу
  const filteredTexts = texts.filter(text => {
    const searchLower = searchQuery.toLowerCase();
    return (
      text.key.toLowerCase().includes(searchLower) ||
      text.section.toLowerCase().includes(searchLower) ||
      text.content.en.toLowerCase().includes(searchLower) ||
      text.content.ru.toLowerCase().includes(searchLower)
    );
  });

  // Группировка текстов по секциям
  const groupedTexts = filteredTexts.reduce((acc, text) => {
    if (!acc[text.section]) {
      acc[text.section] = [];
    }
    acc[text.section].push(text);
    return acc;
  }, {} as Record<string, TextBlock[]>);

  const handleAddNew = () => {
    setIsAddMode(true);
    setEditingText({
      id: '',
      key: '',
      section: '',
      content: {
        en: '',
        ru: ''
      }
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (text: TextBlock) => {
    setIsAddMode(false);
    setEditingText(text);
    setIsDialogOpen(true);
  };

  const handleDelete = (text: TextBlock) => {
    if (window.confirm(language === 'en' 
      ? `Are you sure you want to delete the text with key "${text.key}"?`
      : `Вы уверены, что хотите удалить текст с ключом "${text.key}"?`)) {
      deleteText(text.id);
      toast.success(
        language === 'en' 
          ? 'Text deleted successfully' 
          : 'Текст успешно удален'
      );
    }
  };

  const handleSave = () => {
    if (!editingText) return;

    // Очищаем HTML-разметку перед сохранением
    const cleanedText = {
      ...editingText,
      content: {
        en: containsHtmlTags(editingText.content.en) ? stripHtml(editingText.content.en) : editingText.content.en,
        ru: containsHtmlTags(editingText.content.ru) ? stripHtml(editingText.content.ru) : editingText.content.ru
      }
    };

    if (isAddMode) {
      // Генерируем уникальный ID для нового текста
      const newText = {
        ...cleanedText,
        id: cleanedText.key.toLowerCase().replace(/\s+/g, '-')
      };
      addText(newText);
      toast.success(
        language === 'en' 
          ? 'Text added successfully' 
          : 'Текст успешно добавлен'
      );
    } else {
      updateText(cleanedText.id, cleanedText);
      toast.success(
        language === 'en' 
          ? 'Text updated successfully' 
          : 'Текст успешно обновлен'
      );
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'Site Texts Management' : 'Управление текстами сайта'}
        </h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Add New Text' : 'Добавить новый текст'}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder={language === 'en' ? "Search texts..." : "Поиск текстов..."}
          className="pl-10 pr-4 py-2 w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {Object.entries(groupedTexts).map(([section, sectionTexts]) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle>{section}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? 'Key' : 'Ключ'}</TableHead>
                  <TableHead>{language === 'en' ? 'Content' : 'Содержание'}</TableHead>
                  <TableHead className="w-[150px]">{language === 'en' ? 'Actions' : 'Действия'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionTexts.map((text) => (
                  <TableRow key={text.id}>
                    <TableCell className="font-medium">{text.key}</TableCell>
                    <TableCell>
                      <div className="max-w-[400px] truncate">
                        {language === 'en' ? text.content.en : text.content.ru}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(text)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(text)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isAddMode
                ? language === 'en' ? 'Add New Text' : 'Добавить новый текст'
                : language === 'en' ? 'Edit Text' : 'Редактировать текст'}
            </DialogTitle>
          </DialogHeader>

          {editingText && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>{language === 'en' ? 'Section' : 'Раздел'}</Label>
                  <Input 
                    value={editingText.section} 
                    onChange={(e) => setEditingText({
                      ...editingText,
                      section: e.target.value
                    })}
                    disabled={!isAddMode}
                  />
                </div>
                <div className="flex-1">
                  <Label>{language === 'en' ? 'Key' : 'Ключ'}</Label>
                  <Input 
                    value={editingText.key}
                    onChange={(e) => setEditingText({
                      ...editingText,
                      key: e.target.value
                    })}
                    disabled={!isAddMode}
                  />
                </div>
              </div>

              <Tabs defaultValue="english">
                <TabsList className="mb-4">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="russian">Russian</TabsTrigger>
                </TabsList>

                <TabsContent value="english" className="space-y-4">
                  <div>
                    <Label>Content (English)</Label>
                    <RichTextEditor
                      value={editingText.content.en}
                      onChange={(value) => setEditingText({
                        ...editingText,
                        content: { ...editingText.content, en: value }
                      })}
                      placeholder="Enter English text..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="russian" className="space-y-4">
                  <div>
                    <Label>Content (Russian)</Label>
                    <RichTextEditor
                      value={editingText.content.ru}
                      onChange={(value) => setEditingText({
                        ...editingText,
                        content: { ...editingText.content, ru: value }
                      })}
                      placeholder="Введите текст на русском..."
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {language === 'en' ? 'Cancel' : 'Отмена'}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {isAddMode
                    ? language === 'en' ? 'Add Text' : 'Добавить текст'
                    : language === 'en' ? 'Save Changes' : 'Сохранить изменения'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 