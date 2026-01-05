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
  Video,
  Play,
  Link as LinkIcon,
  Columns,
} from 'lucide-react'
import { BlogContentBlock, uploadBlogImage, CustomFont, DEFAULT_FONTS } from '@/lib/blog'
import { useToast } from '@/hooks/use-toast'

interface BlogContentEditorProps {
  content: BlogContentBlock[]
  onChange: (content: BlogContentBlock[]) => void
  customFonts?: CustomFont[]
  disabled?: boolean
}

const generateBlockId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Helper to extract YouTube video ID from various URL formats
const extractYouTubeId = (url: string): string => {
  if (!url) return ''
  // Already a video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
  // Standard YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return url // Return as-is if not recognized
}

export function BlogContentEditor({ content, onChange, customFonts = [], disabled = false }: BlogContentEditorProps) {
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
    } else if (type === 'video') {
      newBlock.props = { size: 'large', alignment: 'center', aspectRatio: '16:9', caption: '', ...props }
    } else if (type === 'embed') {
      newBlock.props = { size: 'large', alignment: 'center', aspectRatio: '16:9', embedType: 'youtube', ...props }
    } else if (type === 'columns') {
      newBlock.props = { columnCount: 2, columnGap: 'medium', verticalAlign: 'top', ...props }
      newBlock.children = [[], []]  // Start with 2 empty columns
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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-primary/70">Font:</Label>
                <Select
                  value={block.props?.fontFamily || 'inherit'}
                  onValueChange={(value) => updateBlockProps(block.id, { fontFamily: value })}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-40 border-secondary">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_FONTS.map((font) => (
                      <SelectItem key={font.name} value={font.value}>
                        {font.name}
                      </SelectItem>
                    ))}
                    {customFonts.map((font) => (
                      <SelectItem key={font.name} value={font.fontFamily}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Write your paragraph here... Use **bold**, ~italic~, {{green text}}, [[&quot;url&quot;: link text]]"
                rows={4}
                className="border-secondary focus:border-green resize-none"
                style={block.props?.fontFamily ? { fontFamily: block.props.fontFamily } : undefined}
                disabled={disabled}
              />
            </div>
          )}

          {block.type === 'heading' && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
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
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-primary/70">Font:</Label>
                  <Select
                    value={block.props?.fontFamily || 'inherit'}
                    onValueChange={(value) => updateBlockProps(block.id, { fontFamily: value })}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-40 border-secondary">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_FONTS.map((font) => (
                        <SelectItem key={font.name} value={font.value}>
                          {font.name}
                        </SelectItem>
                      ))}
                      {customFonts.map((font) => (
                        <SelectItem key={font.name} value={font.fontFamily}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Heading text..."
                className="border-secondary focus:border-green text-lg font-semibold"
                style={block.props?.fontFamily ? { fontFamily: block.props.fontFamily } : undefined}
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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-primary/70">Font:</Label>
                <Select
                  value={block.props?.fontFamily || 'inherit'}
                  onValueChange={(value) => updateBlockProps(block.id, { fontFamily: value })}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-40 border-secondary">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_FONTS.map((font) => (
                      <SelectItem key={font.name} value={font.value}>
                        {font.name}
                      </SelectItem>
                    ))}
                    {customFonts.map((font) => (
                      <SelectItem key={font.name} value={font.fontFamily}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                placeholder="Enter quote text..."
                rows={3}
                className="border-secondary focus:border-green italic resize-none"
                style={block.props?.fontFamily ? { fontFamily: block.props.fontFamily } : undefined}
                disabled={disabled}
              />
            </div>
          )}

          {block.type === 'video' && (
            <div className="space-y-3">
              {block.content ? (
                <div className="relative">
                  <video
                    src={block.content}
                    controls
                    className="w-full max-h-64 rounded-lg bg-gray-900"
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
                      <Video className="h-8 w-8 text-primary/30 mx-auto mb-2" />
                      <Label htmlFor={`video-${block.id}`} className="cursor-pointer">
                        <span className="text-primary hover:text-green">Click to upload video</span>
                        <Input
                          id={`video-${block.id}`}
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(block.id, file)
                          }}
                          className="hidden"
                          disabled={disabled}
                        />
                      </Label>
                      <p className="text-xs text-primary/60 mt-1">MP4, WebM up to 50MB</p>
                    </>
                  )}
                </div>
              )}

              {/* Video Controls */}
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
                  <Label className="text-sm text-primary/70">Aspect:</Label>
                  <Select
                    value={block.props?.aspectRatio || '16:9'}
                    onValueChange={(value) => updateBlockProps(block.id, { aspectRatio: value as '16:9' | '4:3' | '1:1' })}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-24 border-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9</SelectItem>
                      <SelectItem value="4:3">4:3</SelectItem>
                      <SelectItem value="1:1">1:1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Input
                value={block.props?.caption || ''}
                onChange={(e) => updateBlockProps(block.id, { caption: e.target.value })}
                placeholder="Video caption (optional)"
                className="border-secondary focus:border-green text-sm"
                disabled={disabled}
              />
            </div>
          )}

          {block.type === 'embed' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-sm text-primary/70">Type:</Label>
                <Select
                  value={block.props?.embedType || 'youtube'}
                  onValueChange={(value) => updateBlockProps(block.id, { embedType: value as 'youtube' | 'vimeo' | 'twitter' | 'custom' })}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-32 border-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-primary/70">
                  {block.props?.embedType === 'youtube' && 'YouTube URL or Video ID'}
                  {block.props?.embedType === 'vimeo' && 'Vimeo URL or Video ID'}
                  {block.props?.embedType === 'twitter' && 'Tweet URL'}
                  {block.props?.embedType === 'custom' && 'Embed URL'}
                </Label>
                <Input
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder={
                    block.props?.embedType === 'youtube' ? 'https://youtube.com/watch?v=... or video ID' :
                    block.props?.embedType === 'vimeo' ? 'https://vimeo.com/... or video ID' :
                    block.props?.embedType === 'twitter' ? 'https://twitter.com/user/status/...' :
                    'https://...'
                  }
                  className="border-secondary focus:border-green mt-1"
                  disabled={disabled}
                />
              </div>

              {/* Embed Preview */}
              {block.content && block.props?.embedType === 'youtube' && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(block.content)}`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}

              {/* Embed Controls */}
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
                placeholder="Embed caption (optional)"
                className="border-secondary focus:border-green text-sm"
                disabled={disabled}
              />
            </div>
          )}

          {block.type === 'columns' && (
            <div className="space-y-4">
              {/* Column Controls */}
              <div className="flex flex-wrap gap-3 pb-3 border-b border-secondary">
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-primary/70">Columns:</Label>
                  <Select
                    value={String(block.props?.columnCount || 2)}
                    onValueChange={(value) => {
                      const count = parseInt(value) as 2 | 3
                      const currentChildren = block.children || [[], []]
                      let newChildren = [...currentChildren]
                      
                      if (count === 3 && newChildren.length < 3) {
                        newChildren.push([])
                      } else if (count === 2 && newChildren.length > 2) {
                        newChildren = newChildren.slice(0, 2)
                      }
                      
                      onChange(content.map(b => 
                        b.id === block.id 
                          ? { ...b, props: { ...b.props, columnCount: count }, children: newChildren }
                          : b
                      ))
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-20 border-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-primary/70">Gap:</Label>
                  <Select
                    value={block.props?.columnGap || 'medium'}
                    onValueChange={(value) => updateBlockProps(block.id, { columnGap: value as 'small' | 'medium' | 'large' })}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-24 border-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-primary/70">Align:</Label>
                  <Select
                    value={block.props?.verticalAlign || 'top'}
                    onValueChange={(value) => updateBlockProps(block.id, { verticalAlign: value as 'top' | 'center' | 'bottom' })}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-24 border-secondary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Column Content Editors */}
              <div className={`grid gap-4 ${block.props?.columnCount === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {(block.children || [[], []]).map((columnBlocks, colIndex) => (
                  <div key={colIndex} className="border border-secondary/50 rounded-lg p-3 bg-secondary/10">
                    <div className="text-xs font-medium text-primary/60 mb-2">Column {colIndex + 1}</div>
                    <Textarea
                      value={columnBlocks[0]?.content || ''}
                      onChange={(e) => {
                        const newChildren = [...(block.children || [[], []])]
                        if (!newChildren[colIndex]) newChildren[colIndex] = []
                        if (newChildren[colIndex].length === 0) {
                          newChildren[colIndex] = [{
                            id: generateBlockId(),
                            type: 'paragraph',
                            content: e.target.value,
                          }]
                        } else {
                          newChildren[colIndex][0] = { ...newChildren[colIndex][0], content: e.target.value }
                        }
                        onChange(content.map(b => 
                          b.id === block.id ? { ...b, children: newChildren } : b
                        ))
                      }}
                      placeholder={`Column ${colIndex + 1} content...

Use formatting:
**bold** ~italic~ {{green}}`}
                      rows={6}
                      className="border-secondary focus:border-green resize-none text-sm"
                      disabled={disabled}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-primary/50">Tip: Each column supports text formatting. For images, use separate Image blocks above or below.</p>
            </div>
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('video')}
          disabled={disabled}
          className="border-secondary bg-transparent"
        >
          <Video className="h-4 w-4 mr-1" />
          Video
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('embed')}
          disabled={disabled}
          className="border-secondary bg-transparent"
        >
          <Play className="h-4 w-4 mr-1" />
          Embed
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addBlock('columns')}
          disabled={disabled}
          className="border-secondary bg-transparent"
        >
          <Columns className="h-4 w-4 mr-1" />
          Columns
        </Button>
      </div>
    </div>
  )
}
