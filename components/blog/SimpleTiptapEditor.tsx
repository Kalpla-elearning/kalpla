'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  ChatBubbleLeftIcon,
  TableCellsIcon,
  MinusIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline'

interface SimpleTiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function SimpleTiptapEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing...',
  className = ''
}: SimpleTiptapEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    immediatelyRender: false,
  })

  if (!editor || !isMounted) {
    return (
      <div className={`border border-gray-300 rounded-lg ${className}`}>
        <div className="border-b border-gray-300 p-3 bg-gray-50">
          <div className="text-gray-500 text-sm">Loading editor...</div>
        </div>
        <div className="prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4">
          <div className="text-gray-400">{placeholder}</div>
        </div>
      </div>
    )
  }

  const addImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const addCallout = (type: 'info' | 'warning' | 'success' | 'tip') => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      tip: 'bg-purple-50 border-purple-200 text-purple-800',
    }
    
    const calloutHtml = `<div class="border-l-4 border-current p-4 my-4 ${colors[type]}">
      <div class="font-medium">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
      <div class="mt-1">Your content here...</div>
    </div>`
    
    editor.chain().focus().insertContent(calloutHtml).run()
  }

  const Button = ({ onClick, children, title, className = '', icon: Icon }: any) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors ${className}`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : children}
    </button>
  )

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-3 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {/* Undo/Redo */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <Button
              onClick={() => editor.chain().focus().undo().run()}
              icon={ArrowUturnLeftIcon}
              title="Undo"
            />
            <Button
              onClick={() => editor.chain().focus().redo().run()}
              icon={ArrowUturnRightIcon}
              title="Redo"
            />
          </div>

          {/* Text Formatting */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              icon={BoldIcon}
              title="Bold"
              className={editor.isActive('bold') ? 'bg-gray-200' : ''}
            />
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              icon={ItalicIcon}
              title="Italic"
              className={editor.isActive('italic') ? 'bg-gray-200' : ''}
            />
            <Button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              icon={UnderlineIcon}
              title="Underline"
              className={editor.isActive('underline') ? 'bg-gray-200' : ''}
            />
            <Button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
              className={editor.isActive('strike') ? 'bg-gray-200' : ''}
            >
              S
            </Button>
          </div>

          {/* Headings */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <Button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              title="Heading 1"
              className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
            >
              H1
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              title="Heading 2"
              className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
            >
              H2
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              title="Heading 3"
              className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
            >
              H3
            </Button>
          </div>

          {/* Lists */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              icon={ListBulletIcon}
              title="Bullet List"
              className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
            />
            <Button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered List"
              className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
            >
              1.
            </Button>
          </div>

          {/* Media & Links */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <Button
              onClick={addLink}
              icon={LinkIcon}
              title="Insert Link"
            />
            <Button
              onClick={addImage}
              icon={PhotoIcon}
              title="Insert Image"
            />
          </div>

          {/* Layout Blocks */}
          <div className="flex">
            <Button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              icon={ChatBubbleLeftIcon}
              title="Quote"
              className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
            />
            <Button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              icon={CodeBracketIcon}
              title="Code Block"
              className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
            />
            <Button
              onClick={addTable}
              icon={TableCellsIcon}
              title="Insert Table"
            />
            <Button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              icon={MinusIcon}
              title="Insert Divider"
            />
          </div>
        </div>

        {/* Callout Buttons */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-300">
          <Button
            onClick={() => addCallout('info')}
            title="Info Callout"
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Info
          </Button>
          <Button
            onClick={() => addCallout('warning')}
            title="Warning Callout"
            className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          >
            Warning
          </Button>
          <Button
            onClick={() => addCallout('success')}
            title="Success Callout"
            className="bg-green-100 text-green-700 hover:bg-green-200"
          >
            Success
          </Button>
          <Button
            onClick={() => addCallout('tip')}
            title="Tip Callout"
            className="bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            Tip
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
