'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import YouTube from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from '@tiptap/extension-font-size'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Emoji from '@tiptap/extension-emoji'
import Mention from '@tiptap/extension-mention'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { common, createLowlight } from 'lowlight'
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
  CheckIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline'

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function TiptapEditor({ 
  content, 
  onChange, 
  placeholder = 'Start writing...',
  className = ''
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
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
      YouTube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg my-4',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-gray-300 w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2 bg-gray-100 font-bold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2 my-2',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Subscript,
      Superscript,
      Emoji,
      Mention,
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200',
        },
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
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addYouTube = () => {
    const url = prompt('Enter YouTube URL:')
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addTable = () => {
    const rows = prompt('Enter number of rows (default: 3):') || '3'
    const cols = prompt('Enter number of columns (default: 3):') || '3'
    editor.chain().focus().insertTable({ rows: parseInt(rows), cols: parseInt(cols), withHeaderRow: true }).run()
  }

  const addTaskList = () => {
    editor.chain().focus().toggleTaskList().run()
  }

  const addCallout = (type: 'info' | 'warning' | 'success' | 'tip') => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      tip: 'bg-purple-50 border-purple-200 text-purple-800',
    }
    
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '✅',
      tip: '💡',
    }

    const callout = `<div class="border-l-4 ${colors[type]} p-4 my-4 rounded-r-lg">
      <div class="flex items-start gap-2">
        <span class="text-lg">${icons[type]}</span>
        <div>
          <strong class="capitalize">${type}:</strong>
          <p class="mt-1">Your ${type} content here...</p>
        </div>
      </div>
    </div>`

    editor.chain().focus().insertContent(callout).run()
  }

  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run()
  }

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const setHighlightColor = (color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run()
  }

  const Button = ({ onClick, children, title, className = '', icon: Icon }: any) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${className}`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : children}
    </button>
  )

  const DropdownButton = ({ onClick, children, title, isOpen, icon: Icon }: any) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1 ${isOpen ? 'bg-gray-100' : ''}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
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

          {/* Font Size */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <DropdownButton
              onClick={() => setFontSize('12px')}
              title="Font Size 12px"
            >
              12px
            </DropdownButton>
            <DropdownButton
              onClick={() => setFontSize('14px')}
              title="Font Size 14px"
            >
              14px
            </DropdownButton>
            <DropdownButton
              onClick={() => setFontSize('16px')}
              title="Font Size 16px"
            >
              16px
            </DropdownButton>
            <DropdownButton
              onClick={() => setFontSize('18px')}
              title="Font Size 18px"
            >
              18px
            </DropdownButton>
            <DropdownButton
              onClick={() => setFontSize('20px')}
              title="Font Size 20px"
            >
              20px
            </DropdownButton>
          </div>

          {/* Colors */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <DropdownButton
              onClick={() => setTextColor('#000000')}
              title="Black"
              icon={SwatchIcon}
            >
              Color
            </DropdownButton>
            <div className="flex gap-1">
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
            <div className="flex gap-1 ml-2">
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
            <Button
              onClick={addTaskList}
              icon={CheckIcon}
              title="Task List"
              className={editor.isActive('taskList') ? 'bg-gray-200' : ''}
            />
          </div>

          {/* Text Alignment */}
          <div className="flex border-r border-gray-300 pr-3 mr-3">
            <Button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Align Left"
              className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
            >
              L
            </Button>
            <Button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Align Center"
              className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
            >
              C
            </Button>
            <Button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              title="Align Right"
              className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
            >
              R
            </Button>
            <Button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              title="Justify"
              className={editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}
            >
              J
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
            <Button
              onClick={addYouTube}
              icon={PlayIcon}
              title="Insert YouTube Video"
            />
            <Button
              onClick={() => editor.chain().focus().insertContent('<div class="border border-gray-300 rounded-lg p-4 my-4 bg-gray-50"><div class="flex items-center gap-2"><DocumentIcon class="w-6 h-6 text-gray-500" /><a href="#" class="text-blue-600 font-medium">Download File</a></div></div>').run()}
              icon={DocumentIcon}
              title="Insert File"
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
