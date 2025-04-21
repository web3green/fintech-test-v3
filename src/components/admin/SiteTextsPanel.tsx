import React, { useState, useEffect } from 'react'
import { TextBlock, useSiteTexts } from '@/services/siteTextsService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Alert } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Plus, Trash2 } from 'lucide-react'

export const SiteTextsPanel: React.FC = () => {
  const { texts, addText, updateText, deleteText, syncWithDatabase } = useSiteTexts()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newText, setNewText] = useState<TextBlock>({
    key: '',
    section: 'default',
    content: { en: '', ru: '' }
  })
  const [editingTexts, setEditingTexts] = useState<Record<string, TextBlock>>({})

  useEffect(() => {
    const initializeTexts = async () => {
      try {
        setLoading(true)
        await syncWithDatabase()
      } catch (err) {
        setError('Failed to load texts from database')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    initializeTexts()
  }, [])

  // Группируем тексты по разделам
  const groupedTexts = texts.reduce((acc, text) => {
    if (!acc[text.section]) {
      acc[text.section] = []
    }
    acc[text.section].push(text)
    return acc
  }, {} as Record<string, TextBlock[]>)

  const handleAddText = async () => {
    try {
      setError(null)
      await addText(newText)
      setNewText({
        key: '',
        section: 'default',
        content: { en: '', ru: '' }
      })
    } catch (err) {
      setError('Failed to add text')
      console.error(err)
    }
  }

  const handleUpdateText = async (key: string) => {
    try {
      setError(null)
      const updatedText = editingTexts[key]
      if (updatedText) {
        await updateText(key, updatedText)
        setEditingTexts(prev => {
          const newState = { ...prev }
          delete newState[key]
          return newState
        })
      }
    } catch (err) {
      setError('Failed to update text')
      console.error(err)
    }
  }

  const handleDeleteText = async (key: string) => {
    try {
      setError(null)
      await deleteText(key)
    } catch (err) {
      setError('Failed to delete text')
      console.error(err)
    }
  }

  const handleTextChange = (key: string, field: 'en' | 'ru', value: string) => {
    setEditingTexts(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        key,
        content: {
          ...prev[key]?.content,
          [field]: value
        }
      }
    }))
  }

  if (loading) {
    return <div className="flex justify-center p-4"><Spinner /></div>
  }

  return (
    <div className="space-y-4 p-4">
      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Key"
              value={newText.key}
              onChange={(e) => setNewText({ ...newText, key: e.target.value })}
            />
            <Input
              placeholder="Section"
              value={newText.section}
              onChange={(e) => setNewText({ ...newText, section: e.target.value })}
            />
          </div>
          <Input
            placeholder="English Text"
            value={newText.content.en}
            onChange={(e) => setNewText({
              ...newText,
              content: { ...newText.content, en: e.target.value }
            })}
          />
          <Input
            placeholder="Russian Text"
            value={newText.content.ru}
            onChange={(e) => setNewText({
              ...newText,
              content: { ...newText.content, ru: e.target.value }
            })}
          />
          <Button onClick={handleAddText} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Text
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue={Object.keys(groupedTexts)[0]}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.keys(groupedTexts).map((section) => (
            <TabsTrigger key={section} value={section}>
              {section}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedTexts).map(([section, sectionTexts]) => (
          <TabsContent key={section} value={section}>
            <div className="space-y-4">
              {sectionTexts.map((text) => (
                <Card key={text.key}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{text.key}</span>
                      <div className="space-x-2">
                        {editingTexts[text.key] && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateText(text.key)}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteText(text.key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Input
                      value={editingTexts[text.key]?.content.en || text.content.en}
                      onChange={(e) => handleTextChange(text.key, 'en', e.target.value)}
                      placeholder="English Text"
                    />
                    <Input
                      value={editingTexts[text.key]?.content.ru || text.content.ru}
                      onChange={(e) => handleTextChange(text.key, 'ru', e.target.value)}
                      placeholder="Russian Text"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 