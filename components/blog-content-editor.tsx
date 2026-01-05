"use client"

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Upload,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { BlogContentBlock, uploadBlogImage } from '@/lib/blog'
import { useToast } from '@/hooks/use-toast'

interface BlogContentEditorProps {
  content: BlogContentBlock[]
  onChange: (content: BlogContentBlock[]) => void
  disabled?: boolean
}

const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function BlogContentEditor({ content, onChange, disabled = false }: BlogContentEditorProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null)

  const addBlock = (type: BlogContentBlock['type'], props?: BlogContentBlock['props']) => {
    const newBlock: BlogContentBlock = {
      id: generateBlockId(),
      type,
      content: '',
      props: props || {},
    }

    if (type === 'heading') {
      newBlock.props = { level: 2, ...props }
    } else if (type === 'image') {
      newBlock.props = { size: 'large', alignment: 'center', caption: '', ...props }
    } else if (type === 'code') {
      newBlock.props = { language: 'javascript', ...props }
    }

    onChange([...content, newBlock])
  }

  const updateBlock = (id: string, updates: Partial<BlogContentBlock>) => {
    onChange(
      content.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    )
  }

  const updateBlockProps = (id: string, props: Partial<BlogContentBlock['props']>) => {
    onChange(
      content.map(block =>
        block.id === id ? { ...block, props: { ...block.props, ...props } } : block
      )
    )
  }

  const removeBlock = (id: string) => {
    onChange(content.filter(block => block.id !== id))
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newContent = [...content]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= content.length) return
    
    const [removed] = newContent.splice(index, 1)
    newContent.splice(newIndex, 0, removed)
    onChange(newContent)
  }

  const handleImageUpload = async (blockId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadingBlockId(blockId)
      const imageUrl = await uploadBlogImage(file)
      updateBlock(blockId, { content: imageUrl })
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingBlockId(null)
    }
  }

  const renderBlockEditor = (block: BlogContentBlock, index: number) => {
    const isUploading = uploadingBlockId === block.id

    return (
      <Card key={block.id} className="border-secondary mb-4">
        <CardContent className="p-4">
          {/* Block Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-primary/40 cursor-move" />
              <span className="text-sm font-medium text-primary capitalize">
                {block.type === 'heading' ? `Heading ${block.props?.level || 2}` : block.type}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0 || disabled}
                className="h-8 w-8 p-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveBlock(index, 'down')}
                disabled={index === content.length - 1 || disabled}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(block.id)}
                disabled={disabled}
                className="h-8 w-8 p-0 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>

          {/* Block Content */}
          {block.type === 'paragraph' && (
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Write your paragraph here... Use **bold**, ~italic~, {{green text}}, [[&quot;url&quot;: link text]]"
              rows={4}
              className="border-secondary focus:border-green resize-none"
              disabled={disabled}
            />
          )}

          {block.type === 'heading' && (
            <div className="space-y-2">
              <Select
                value={String(block.props?.level || 2)}
                onValueChange={(value) => updateBlockProps(block.id, { level: parseInt(value) as 1 | 2 | 3 })}
                disabled={disabled}
              >
                <SelectTrigger className="w-32 border-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Heading 1</SelectItem>
                  <SelectItem value="2">Heading 2</SelectItem>
                  <SelectItem value="3">Heading 3</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Heading text..."
                className="border-secondary focus:border-green text-lg font-semibold"
                disabled={disabled}
              />
            </div>
          )}

          {block.type === 'image' && (
            <div className="space-y-3">
              {block.content ? (
                <div className="relative">
                  <img
                    src={block.content}
                    alt="Content"
                    className="w-full max-h-64 object-contain rounded-lg bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateBlock(block.id, { content: '' })}
                    disabled={disabled}
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-secondary rounded-lg p-6 text-center">
                  {isUploading ? (
                    <div className="text-primary/60">Uploading...</div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-primary/30 mx-auto mb-2" />
                      <Label htmlFor={`image-${block.id}`} className="cursor-pointer">
                        <span className="text-primary hover:text-green">Click to upload image</span>
                        <Input
                          id={`image-${block.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(block.id, file)
                          }}
                          className="hidden"
                          disabled={disabled}
                        />
                      </Label>
                      <p className="text-xs text-primary/60 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              )}

              {/* Image Controls */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-primary/70">Size:</Label>
                  <Select
                    value={block.props?.size || 'large'}
                    onValueChange={(value) => updateBlockProps(block.id, { size: value as 'small' | 'medium' | 'large' | 'full' })}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-28 border-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-primary/70">Align:</Label>
                  <Select
                    value={block.props?.alignment || 'center'}
                    onValueChange={(value) => updateBlockProps(block.id, { alignment: value as 'left' | 'center' | 'right' })}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-28 border-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Input
                value={block.props?.caption || ''}
                onChange={(e) => updateBlockProps(block.id, { caption: e.target.value })}
                placeholder="Image caption (optional)"
                className="border-secondary focus:border-green text-sm"
                disabled={disabled}
              />
            </div>
          )}

          {block.type === 'code' && (
            <div className="space-y-2">
              <Select
                value={block.props?.language || 'javascript'}
                onValueChange={(value) => updateBlockProps(block.id, { language: value })}
                disabled={disabled}
              >
                <SelectTrigger className="w-40 border-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="bash">Bash</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="// Your code here..."
                rows={6}
                className="border-secondary focus:border-green font-mono text-sm resize-none"
                disabled={disabled}
              />
            </div>
          )}

          {block.type === 'quote' && (
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Enter quote text..."
              rows={3}
              className="border-secondary focus:border-green italic resize-none"
              disabled={disabled}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Content Blocks */}
      {content.map((block, index) => renderBlockEditor(block, index))}

      {/* Add Block Buttons */}
      <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed border-secondary rounded-lg">
        <span className="text-sm text-primary/60 mr-2">Add block:</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('paragraph')}
          disabled={disabled}
          className="border-secondary bg-transparent"
        >
          <Type className="h-4 w-4 mr-1" />
          Paragraph
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('heading', { level: 2 })}
          disabled={disabled}
          className="border-secondary bg-transparent"
        >
          <Heading2 className="h-4 w-4 mr-1" />
          Heading
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('image')}
          disabled={disabled}
          className="border-secondary bg-transparent"
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          Image
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('code')}
          disabled={disabled}
          className="border-secondary bg-transparent"
        >
          <Code className="h-4 w-4 mr-1" />
          Code
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('quote')}
          disabled={disabled}
          className="border-secondary bg-transparent"
        >
          <Quote className="h-4 w-4 mr-1" />
          Quote
        </Button>
      </div>
    </div>
  )
}
