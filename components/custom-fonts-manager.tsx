"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Link as LinkIcon, Type } from 'lucide-react'
import { CustomFont } from '@/lib/blog'
import { useToast } from '@/hooks/use-toast'

interface CustomFontsManagerProps {
  fonts: CustomFont[]
  onChange: (fonts: CustomFont[]) => void
  disabled?: boolean
}

export function CustomFontsManager({ fonts, onChange, disabled = false }: CustomFontsManagerProps) {
  const { toast } = useToast()
  const [newFont, setNewFont] = useState<CustomFont>({
    name: '',
    importUrl: '',
    fontFamily: '',
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const extractFontInfoFromUrl = (url: string) => {
    // Try to extract font name from Google Fonts URL
    // Example: https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap
    const familyMatch = url.match(/family=([^:&]+)/)
    if (familyMatch) {
      const fontName = familyMatch[1].replace(/\+/g, ' ')
      return {
        name: fontName,
        fontFamily: `'${fontName}', sans-serif`,
      }
    }
    return null
  }

  const handleUrlChange = (url: string) => {
    setNewFont(prev => ({ ...prev, importUrl: url }))
    
    // Auto-fill name and fontFamily if we can extract from URL
    const extracted = extractFontInfoFromUrl(url)
    if (extracted && !newFont.name) {
      setNewFont(prev => ({
        ...prev,
        importUrl: url,
        name: extracted.name,
        fontFamily: extracted.fontFamily,
      }))
    }
  }

  const addFont = () => {
    if (!newFont.name || !newFont.importUrl || !newFont.fontFamily) {
      toast({
        title: "Missing fields",
        description: "Please fill in all font fields",
        variant: "destructive",
      })
      return
    }

    // Check for duplicates
    if (fonts.some(f => f.name === newFont.name)) {
      toast({
        title: "Font already exists",
        description: `A font named "${newFont.name}" is already added`,
        variant: "destructive",
      })
      return
    }

    onChange([...fonts, newFont])
    setNewFont({ name: '', importUrl: '', fontFamily: '' })
    setShowAddForm(false)
    toast({
      title: "Font added",
      description: `"${newFont.name}" has been added to your fonts`,
    })
  }

  const removeFont = (fontName: string) => {
    onChange(fonts.filter(f => f.name !== fontName))
    toast({
      title: "Font removed",
      description: `"${fontName}" has been removed`,
    })
  }

  return (
    <Card className="border-secondary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-primary flex items-center gap-2">
              <Type className="h-5 w-5" />
              Custom Fonts
            </CardTitle>
            <CardDescription className="text-primary/60">
              Import fonts from Google Fonts or other sources
            </CardDescription>
          </div>
          {!showAddForm && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              disabled={disabled}
              className="border-secondary bg-transparent"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Font
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Fonts */}
        {fonts.length > 0 ? (
          <div className="space-y-2">
            {fonts.map((font) => (
              <div
                key={font.name}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
              >
                <div>
                  <p className="font-medium text-primary" style={{ fontFamily: font.fontFamily }}>
                    {font.name}
                  </p>
                  <p className="text-xs text-primary/60 truncate max-w-xs">
                    {font.fontFamily}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFont(font.name)}
                  disabled={disabled}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          !showAddForm && (
            <p className="text-sm text-primary/60 text-center py-4">
              No custom fonts added yet. Add one from Google Fonts!
            </p>
          )
        )}

        {/* Add Font Form */}
        {showAddForm && (
          <div className="space-y-3 p-4 border border-secondary rounded-lg">
            <div>
              <Label className="text-sm text-primary">Google Fonts URL *</Label>
              <div className="relative mt-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                <Input
                  value={newFont.importUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
                  className="pl-10 border-secondary focus:border-green text-sm"
                  disabled={disabled}
                />
              </div>
              <p className="text-xs text-primary/60 mt-1">
                Paste the @import URL from Google Fonts. Name and font-family will auto-fill.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-primary">Font Name *</Label>
                <Input
                  value={newFont.name}
                  onChange={(e) => setNewFont(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Playfair Display"
                  className="border-secondary focus:border-green text-sm mt-1"
                  disabled={disabled}
                />
              </div>
              <div>
                <Label className="text-sm text-primary">CSS font-family *</Label>
                <Input
                  value={newFont.fontFamily}
                  onChange={(e) => setNewFont(prev => ({ ...prev, fontFamily: e.target.value }))}
                  placeholder="'Playfair Display', serif"
                  className="border-secondary focus:border-green text-sm mt-1"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddForm(false)
                  setNewFont({ name: '', importUrl: '', fontFamily: '' })
                }}
                disabled={disabled}
                className="border-secondary bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={addFont}
                disabled={disabled || !newFont.name || !newFont.importUrl || !newFont.fontFamily}
                className="bg-green hover:bg-green/90 text-white"
              >
                Add Font
              </Button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-primary/50 space-y-1">
          <p><strong>How to add a Google Font:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Go to <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="text-green hover:underline">fonts.google.com</a></li>
            <li>Select a font and click "Get font" → "Get embed code"</li>
            <li>Copy the URL from the @import statement</li>
            <li>Paste it above and the fields will auto-fill</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
