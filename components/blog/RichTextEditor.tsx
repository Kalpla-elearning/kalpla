'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  TableCellsIcon,
  MinusIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  PlayIcon,
  DocumentIcon,
  PaintBrushIcon,
  SwatchIcon,
  AcademicCapIcon,
  ChatBubbleLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing...',
  className = ''
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontSize, setShowFontSize] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Text Formatting
  const formatText = (command: string) => {
    execCommand(command)
  }

  const formatHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`)
  }

  const setFontSize = (size: string) => {
    execCommand('fontSize', size)
    setShowFontSize(false)
  }

  const setTextColor = (color: string) => {
    execCommand('foreColor', color)
    setShowColorPicker(false)
  }

  const setHighlightColor = (color: string) => {
    execCommand('hiliteColor', color)
    setShowColorPicker(false)
  }

  // Lists
  const formatList = (ordered: boolean) => {
    execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList')
  }

  const insertChecklist = () => {
    const listItem = '<li style="list-style-type: none;"><input type="checkbox" style="margin-right: 8px;">Checklist item</li>'
    execCommand('insertHTML', listItem)
  }

  // Links & Media
  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      const target = confirm('Open in new tab?') ? '_blank' : '_self'
      const link = `<a href="${url}" target="${target}" rel="noopener noreferrer">${url}</a>`
      execCommand('insertHTML', link)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      const alt = prompt('Enter alt text (optional):') || ''
      const img = `<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;">`
      execCommand('insertHTML', img)
    }
  }

  const insertVideo = () => {
    const url = prompt('Enter YouTube/Vimeo URL:')
    if (url) {
      let embedUrl = url
      if (url.includes('youtube.com/watch')) {
        const videoId = url.split('v=')[1]?.split('&')[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (url.includes('vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1]
        embedUrl = `https://player.vimeo.com/video/${videoId}`
      }
      
      const video = `<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 1rem 0;">
        <iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" frameborder="0" allowfullscreen></iframe>
      </div>`
      execCommand('insertHTML', video)
    }
  }

  const insertFile = () => {
    const url = prompt('Enter file URL:')
    if (url) {
      const fileName = prompt('Enter file name:') || 'Download File'
      const file = `<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin: 1rem 0; background: #f9fafb;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <DocumentIcon style="width: 24px; height: 24px; color: #6b7280;" />
          <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${fileName}</a>
        </div>
      </div>`
      execCommand('insertHTML', file)
    }
  }

  // Layout Blocks
  const insertQuote = () => {
    execCommand('formatBlock', 'blockquote')
  }

  const insertCode = () => {
    execCommand('formatBlock', 'pre')
  }

  const insertTable = () => {
    const rows = prompt('Enter number of rows (default: 3):') || '3'
    const cols = prompt('Enter number of columns (default: 3):') || '3'
    
    let table = '<table style="border-collapse: collapse; width: 100%; margin: 1rem 0;">'
    for (let i = 0; i < parseInt(rows); i++) {
      table += '<tr>'
      for (let j = 0; j < parseInt(cols); j++) {
        const isHeader = i === 0
        const tag = isHeader ? 'th' : 'td'
        table += `<${tag} style="border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; ${isHeader ? 'background-color: #f3f4f6; font-weight: bold;' : ''}">${isHeader ? `Header ${j + 1}` : `Cell ${i + 1}-${j + 1}`}</${tag}>`
      }
      table += '</tr>'
    }
    table += '</table>'
    execCommand('insertHTML', table)
  }

  const insertDivider = () => {
    execCommand('insertHTML', '<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0;">')
  }

  const insertCallout = (type: 'info' | 'warning' | 'success' | 'tip') => {
    const icons = {
      info: InformationCircleIcon,
      warning: ExclamationTriangleIcon,
      success: CheckCircleIcon,
      tip: ChatBubbleLeftRightIcon
    }
    const colors = {
      info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
      warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
      success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
      tip: { bg: '#f3e8ff', border: '#8b5cf6', text: '#5b21b6' }
    }
    
    const callout = `<div style="border-left: 4px solid ${colors[type].border}; background-color: ${colors[type].bg}; padding: 1rem; margin: 1rem 0; border-radius: 0 8px 8px 0;">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span style="color: ${colors[type].text}; font-weight: 600; text-transform: capitalize;">${type}</span>
      </div>
      <div style="color: ${colors[type].text};">
        Your ${type} content here...
      </div>
    </div>`
    execCommand('insertHTML', callout)
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  const Button = ({ 
    onClick, 
    children, 
    title, 
    isActive = false,
    className = ''
  }: { 
    onClick: () => void
    children: React.ReactNode
    title: string
    isActive?: boolean
    className?: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-primary-100 text-primary-600' : 'text-gray-600'
      } ${className}`}
    >
      {children}
    </button>
  )

  const IconButton = ({ 
    onClick, 
    icon: Icon, 
    title, 
    isActive = false 
  }: { 
    onClick: () => void
    icon: any
    title: string
    isActive?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-primary-100 text-primary-600' : 'text-gray-600'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )

  const DropdownButton = ({ 
    onClick, 
    children, 
    title,
    isOpen = false
  }: { 
    onClick: () => void
    children: React.ReactNode
    title: string
    isOpen?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition-colors text-gray-600 flex items-center gap-1 ${
        isOpen ? 'bg-primary-100 text-primary-600' : ''
      }`}
    >
      {children}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-3 bg-gray-50 rounded-t-lg">
        <div className="flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <IconButton
              onClick={() => formatText('bold')}
              icon={BoldIcon}
              title="Bold"
            />
            <IconButton
              onClick={() => formatText('italic')}
              icon={ItalicIcon}
              title="Italic"
            />
            <IconButton
              onClick={() => formatText('underline')}
              icon={UnderlineIcon}
              title="Underline"
            />
            <Button
              onClick={() => formatText('strikeThrough')}
              title="Strikethrough"
            >
              S
            </Button>
          </div>

          {/* Headings */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <DropdownButton
              onClick={() => setShowFontSize(!showFontSize)}
              title="Font Size"
              isOpen={showFontSize}
            >
              <AcademicCapIcon className="h-4 w-4" />
              Size
            </DropdownButton>
            {showFontSize && (
              <div className="absolute mt-10 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
                {['1', '2', '3', '4', '5', '6', '7'].map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <DropdownButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Text Color"
              isOpen={showColorPicker}
            >
              <SwatchIcon className="h-4 w-4" />
              Color
            </DropdownButton>
            {showColorPicker && (
              <div className="absolute mt-10 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
                <div className="grid grid-cols-6 gap-1">
                  {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#ffc0cb', '#a52a2a'].map(color => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t">
                  <div className="grid grid-cols-6 gap-1">
                    {['#ffeb3b', '#ffcdd2', '#c8e6c9', '#bbdefb', '#f3e5f5', '#fff3e0'].map(color => (
                      <button
                        key={color}
                        onClick={() => setHighlightColor(color)}
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: color }}
                        title={`Highlight ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Headings */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <Button
              onClick={() => formatHeading(1)}
              title="Heading 1"
            >
              H1
            </Button>
            <Button
              onClick={() => formatHeading(2)}
              title="Heading 2"
            >
              H2
            </Button>
            <Button
              onClick={() => formatHeading(3)}
              title="Heading 3"
            >
              H3
            </Button>
          </div>

          {/* Lists */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <IconButton
              onClick={() => formatList(false)}
              icon={ListBulletIcon}
              title="Bullet List"
            />
            <Button
              onClick={() => formatList(true)}
              title="Numbered List"
            >
              1.
            </Button>
            <IconButton
              onClick={insertChecklist}
              icon={CheckIcon}
              title="Checklist"
            />
          </div>

          {/* Media & Links */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <IconButton
              onClick={insertLink}
              icon={LinkIcon}
              title="Insert Link"
            />
            <IconButton
              onClick={insertImage}
              icon={PhotoIcon}
              title="Insert Image"
            />
            <IconButton
              onClick={insertVideo}
              icon={PlayIcon}
              title="Insert Video"
            />
            <IconButton
              onClick={insertFile}
              icon={DocumentIcon}
              title="Insert File"
            />
          </div>

          {/* Layout Blocks */}
          <div className="flex">
            <IconButton
              onClick={insertQuote}
              icon={ChatBubbleLeftIcon}
              title="Quote"
            />
            <IconButton
              onClick={insertCode}
              icon={CodeBracketIcon}
              title="Code Block"
            />
            <IconButton
              onClick={insertTable}
              icon={TableCellsIcon}
              title="Insert Table"
            />
            <IconButton
              onClick={insertDivider}
              icon={MinusIcon}
              title="Insert Divider"
            />
          </div>
        </div>

        {/* Callout Buttons */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-300">
          <Button
            onClick={() => insertCallout('info')}
            title="Info Callout"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Info
          </Button>
          <Button
            onClick={() => insertCallout('warning')}
            title="Warning Callout"
            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          >
            Warning
          </Button>
          <Button
            onClick={() => insertCallout('success')}
            title="Success Callout"
            className="bg-green-100 text-green-700 hover:bg-green-200"
          >
            Success
          </Button>
          <Button
            onClick={() => insertCallout('tip')}
            title="Tip Callout"
            className="bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            Tip
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[400px] p-4 focus:outline-none ${
          isFocused ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
        }`}
        style={{ minHeight: '400px' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Character Count */}
      <div className="border-t border-gray-300 p-3 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Rich text editor with full formatting capabilities</span>
          <span>{content.replace(/<[^>]*>/g, '').length} characters</span>
        </div>
      </div>

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
          color: #111827;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.75rem 0;
          color: #111827;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
          color: #111827;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
          border-radius: 0 8px 8px 0;
        }
        
        [contenteditable] pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          margin: 1rem 0;
        }
        
        [contenteditable] code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          color: #1d4ed8;
        }
        
        [contenteditable] table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        
        [contenteditable] th {
          background-color: #f3f4f6;
          font-weight: bold;
          padding: 0.75rem;
          text-align: left;
          border: 1px solid #d1d5db;
        }
        
        [contenteditable] td {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
        }
        
        [contenteditable] hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  )
}