'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import { useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Eye,
  EyeOff,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { articlesAPI } from '@/lib/api';

interface ArticleEditorProps {
  initialContent?: string;
  articleId?: number;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export default function ArticleEditor({
  initialContent = '',
  articleId,
  onChange,
  placeholder = 'Hikayenizi anlatmaya başlayın...',
}: ArticleEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'mx-auto rounded-lg shadow-lg my-4 max-w-full',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-burgundy-medium hover:text-burgundy-dark underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      TextStyle,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none font-bookmania text-brown-dark focus:outline-none min-h-[400px] px-4 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  const handleImageUpload = useCallback(async () => {
    if (!articleId) {
      alert('Lütfen önce makaleyi kaydedin.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await articlesAPI.uploadImage(articleId, formData);
        const imageUrl = response.data.url;

        // Insert image at current position
        editor?.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Resim yüklenirken hata oluştu.');
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  }, [editor, articleId]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const EditorToolbar = () => (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] border-b-2 border-teal-light p-3 space-y-2">
      {/* Formatting Tools */}
      <div className="flex flex-wrap items-center gap-1">
        {/* Text Style */}
        <div className="flex items-center gap-1 pr-2 border-r border-teal-light">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('bold') ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Kalın"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('italic') ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="İtalik"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('underline') ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Altı Çizili"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 px-2 border-r border-teal-light">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Başlık 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Başlık 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Başlık 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 px-2 border-r border-teal-light">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('bulletList') ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Liste"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('orderedList') ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Numaralı Liste"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Other Tools */}
        <div className="flex items-center gap-1 px-2 border-r border-teal-light">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('blockquote') ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Alıntı"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Kod Bloğu"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Media */}
        <div className="flex items-center gap-1 px-2 border-r border-teal-light">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive('link') ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Link Ekle"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleImageUpload}
            disabled={isUploading}
            className="p-2 rounded hover:bg-teal-light/20 transition-colors text-brown-dark disabled:opacity-50"
            title="Resim Ekle"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-medium"></div>
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 px-2 border-r border-teal-light">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Sola Hizala"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Ortala"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="Sağa Hizala"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-teal-medium text-white' : 'text-brown-dark'
            }`}
            title="İki Yana Yasla"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* History */}
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-teal-light/20 transition-colors text-brown-dark disabled:opacity-50"
            title="Geri Al"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-teal-light/20 transition-colors text-brown-dark disabled:opacity-50"
            title="İleri Al"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Toggle */}
        <div className="ml-auto">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-burgundy-medium to-burgundy-dark text-white rounded-lg hover:from-burgundy-dark hover:to-burgundy-dark transition-all duration-300"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                Düzenle
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Önizleme
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card-seljuk overflow-hidden">
      <EditorToolbar />
      
      <div className="p-6">
        {showPreview ? (
          <div className="prose prose-lg max-w-none font-bookmania text-brown-dark">
            <ReactMarkdown>{editor.getHTML()}</ReactMarkdown>
          </div>
        ) : (
          <EditorContent 
            editor={editor} 
            className="min-h-[400px] focus-within:ring-2 focus-within:ring-teal-medium rounded-lg"
          />
        )}
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: 400px;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #69412C80;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          font-family: var(--font-heading);
          color: #69412C;
        }

        .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-family: var(--font-heading);
          color: #69412C;
        }

        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-family: var(--font-heading);
          color: #69412C;
        }

        .ProseMirror p {
          margin-bottom: 1rem;
          line-height: 1.8;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #932641;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #7f5d4b;
        }

        .ProseMirror pre {
          background: #f4f3e1;
          border: 1px solid #269393;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }

        .ProseMirror code {
          background: #f4f3e1;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          color: #932641;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .ProseMirror li {
          margin-bottom: 0.5rem;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 2rem auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .ProseMirror a {
          color: #932641;
          text-decoration: underline;
          transition: color 0.3s;
        }

        .ProseMirror a:hover {
          color: #800020;
        }
      `}</style>
    </div>
  );
}