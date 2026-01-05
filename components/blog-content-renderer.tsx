"use client"

import React from 'react'
import { BlogContentBlock, CustomFont } from '@/lib/blog'
import { parseTextWithFormatting } from '@/components/utils'

// Helper to extract embed ID from various URL formats
const extractEmbedId = (url: string, embedType: string): string => {
  if (!url) return ''
  
  if (embedType === 'youtube') {
    // Already a video ID (11 characters)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
    // Standard YouTube URL patterns
    const ytPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ]
    for (const pattern of ytPatterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
  }
  
  if (embedType === 'vimeo') {
    // Vimeo video ID
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    if (vimeoMatch) return vimeoMatch[1]
    // Already just a number
    if (/^\d+$/.test(url)) return url
  }
  
  return url
}

interface BlogContentRendererProps {
  content: BlogContentBlock[]
  customFonts?: CustomFont[]
  className?: string
}

export function BlogContentRenderer({ content, customFonts = [], className = '' }: BlogContentRendererProps) {
  const getImageSizeClass = (size?: string) => {
    switch (size) {
      case 'small':
        return 'max-w-xs'
      case 'medium':
        return 'max-w-md'
      case 'large':
        return 'max-w-2xl'
      case 'full':
        return 'w-full'
      default:
        return 'max-w-2xl'
    }
  }

  const getImageAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'left':
        return 'mr-auto'
      case 'right':
        return 'ml-auto'
      case 'center':
      default:
        return 'mx-auto'
    }
  }

  const renderBlock = (block: BlogContentBlock, index: number) => {
    const fontStyle = block.props?.fontFamily && block.props.fontFamily !== 'inherit'
      ? { fontFamily: block.props.fontFamily } 
      : undefined

    switch (block.type) {
      case 'paragraph':
        return (
          <p 
            key={block.id || index} 
            className="text-primary/80 leading-relaxed mb-4"
            style={fontStyle}
          >
            {parseTextWithFormatting(block.content)}
          </p>
        )

      case 'heading':
        const HeadingTag = `h${block.props?.level || 2}` as 'h1' | 'h2' | 'h3'
        const headingClasses = {
          h1: 'text-3xl font-bold text-primary mb-4 mt-8',
          h2: 'text-2xl font-semibold text-primary mb-3 mt-6',
          h3: 'text-xl font-semibold text-primary mb-2 mt-4',
        }
        return (
          <HeadingTag 
            key={block.id || index} 
            className={headingClasses[HeadingTag]}
            style={fontStyle}
          >
            {parseTextWithFormatting(block.content)}
          </HeadingTag>
        )

      case 'image':
        if (!block.content) return null
        return (
          <figure 
            key={block.id || index} 
            className={`my-6 ${getImageSizeClass(block.props?.size)} ${getImageAlignmentClass(block.props?.alignment)}`}
          >
            <img
              src={block.content}
              alt={block.props?.caption || 'Blog image'}
              className="w-full rounded-lg shadow-sm"
            />
            {block.props?.caption && (
              <figcaption className="text-center text-sm text-primary/60 mt-2 italic">
                {block.props.caption}
              </figcaption>
            )}
          </figure>
        )

      case 'code':
        return (
          <div key={block.id || index} className="my-4">
            {block.props?.language && (
              <div className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-t-lg">
                {block.props.language}
              </div>
            )}
            <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto font-mono text-sm ${block.props?.language ? 'rounded-b-lg' : 'rounded-lg'}`}>
              <code>{block.content}</code>
            </pre>
          </div>
        )

      case 'quote':
        return (
          <blockquote 
            key={block.id || index} 
            className="my-6 pl-4 border-l-4 border-green italic text-primary/70"
            style={fontStyle}
          >
            {parseTextWithFormatting(block.content)}
          </blockquote>
        )

      case 'video':
        if (!block.content) return null
        return (
          <figure 
            key={block.id || index} 
            className={`my-6 ${getImageSizeClass(block.props?.size)} ${getImageAlignmentClass(block.props?.alignment)}`}
          >
            <video
              src={block.content}
              controls
              className="w-full rounded-lg"
              style={{ aspectRatio: block.props?.aspectRatio?.replace(':', '/') || '16/9' }}
            />
            {block.props?.caption && (
              <figcaption className="text-center text-sm text-primary/60 mt-2 italic">
                {block.props.caption}
              </figcaption>
            )}
          </figure>
        )

      case 'embed':
        if (!block.content) return null
        const embedId = extractEmbedId(block.content, block.props?.embedType || 'youtube')
        return (
          <figure 
            key={block.id || index} 
            className={`my-6 ${getImageSizeClass(block.props?.size)} ${getImageAlignmentClass(block.props?.alignment)}`}
          >
            <div 
              className="rounded-lg overflow-hidden bg-gray-900"
              style={{ aspectRatio: block.props?.aspectRatio?.replace(':', '/') || '16/9' }}
            >
              {block.props?.embedType === 'youtube' && (
                <iframe
                  src={`https://www.youtube.com/embed/${embedId}`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              )}
              {block.props?.embedType === 'vimeo' && (
                <iframe
                  src={`https://player.vimeo.com/video/${embedId}`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              )}
              {(block.props?.embedType === 'custom' || !block.props?.embedType) && (
                <iframe
                  src={block.content}
                  className="w-full h-full"
                  allowFullScreen
                />
              )}
            </div>
            {block.props?.caption && (
              <figcaption className="text-center text-sm text-primary/60 mt-2 italic">
                {block.props.caption}
              </figcaption>
            )}
          </figure>
        )

      case 'columns':
        const gapClass = {
          small: 'gap-4',
          medium: 'gap-6',
          large: 'gap-10',
        }[block.props?.columnGap || 'medium']
        
        const alignClass = {
          top: 'items-start',
          center: 'items-center',
          bottom: 'items-end',
        }[block.props?.verticalAlign || 'top']

        const colsClass = block.props?.columnCount === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
        
        return (
          <div 
            key={block.id || index} 
            className={`grid grid-cols-1 ${colsClass} ${gapClass} ${alignClass} my-6`}
          >
            {(block.children || []).map((columnBlocks, colIndex) => (
              <div key={colIndex}>
                {columnBlocks.map((childBlock, childIndex) => 
                  renderBlock(childBlock, childIndex)
                )}
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (!content || content.length === 0) {
    return (
      <div className={`text-primary/60 italic ${className}`}>
        No content yet...
      </div>
    )
  }

  return (
    <>
      {/* Inject custom font imports */}
      {customFonts.length > 0 && (
        <style>
          {customFonts.map((font) => `@import url('${font.importUrl}');`).join('\n')}
        </style>
      )}
      <div className={`blog-content ${className}`}>
        {content.map((block, index) => renderBlock(block, index))}
      </div>
    </>
  )
}
