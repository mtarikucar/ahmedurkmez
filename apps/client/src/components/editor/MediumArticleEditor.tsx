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
import { VideoEmbed } from './extensions/VideoEmbed';
import { PDFEmbed } from './extensions/PDFEmbed';
import { useState, useCallback, useRef, useEffect } from 'react';
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
  Video,
  FileText,
  Plus,
  X,
} from 'lucide-react';
import { articlesAPI, uploadAPI, mediaAPI } from '@/lib/api';
import MediaManager from '@/components/admin/MediaManager';
import EBookViewer from '@/components/ui/EBookViewer';

interface MediumArticleEditorProps {
  initialContent?: string;
  articleId?: number;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export default function MediumArticleEditor({
  initialContent = '',
  articleId,
  onChange,
  placeholder = 'Hikayenizi anlatmaya başlayın...',
}: MediumArticleEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'pdf'>('image');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showEBookViewer, setShowEBookViewer] = useState(false);
  const [currentEBook, setCurrentEBook] = useState<{url: string, title: string} | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Add event listener for e-book buttons
  useEffect(() => {
    const handleEBookClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('ebook-open-btn')) {
        e.preventDefault();
        const src = target.getAttribute('data-src');
        const title = target.getAttribute('data-title');
        if (src && title) {
          setCurrentEBook({ url: src, title });
          setShowEBookViewer(true);
        }
      }
    };

    document.addEventListener('click', handleEBookClick);
    return () => document.removeEventListener('click', handleEBookClick);
  }, []);

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
          class: 'mx-auto rounded-lg shadow-lg my-6 max-w-full cursor-pointer hover:shadow-xl transition-shadow',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 hover:text-indigo-500 underline',
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
      VideoEmbed,
      PDFEmbed,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    onCreate: ({ editor }) => {
      // Re-attach event listeners when editor is created with existing content
      setTimeout(() => {
        const handleEBookClick = (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('ebook-open-btn')) {
            e.preventDefault();
            const src = target.getAttribute('data-src');
            const title = target.getAttribute('data-title');
            if (src && title) {
              setCurrentEBook({ url: src, title });
              setShowEBookViewer(true);
            }
          }
        };

        document.addEventListener('click', handleEBookClick);
        return () => document.removeEventListener('click', handleEBookClick);
      }, 100);
    },
  });

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      
      try {
        // Create FormData for image upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'image');
        formData.append('title', file.name);
        formData.append('description', 'Image uploaded from editor');
        
        const response = await mediaAPI.uploadFile(formData);
        const imageUrl = response.data.url;

        editor?.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Resim yüklenirken hata oluştu.');
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  }, [editor]);

  const handleVideoEmbed = useCallback(() => {
    const url = window.prompt('Video URL\'sini girin (YouTube, Vimeo veya direkt video)');
    
    if (url) {
      editor?.chain().focus().setVideoEmbed({ src: url }).run();
    }
  }, [editor]);

  const handlePDFUpload = useCallback(async (displayMode: 'viewer' | 'ebook' = 'viewer') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      
      try {
        // Use dedicated PDF upload endpoint
        const response = await uploadAPI.uploadPDF(file);
        const pdfUrl = response.data.url;

        editor?.chain().focus().setPDFEmbed({ 
          src: pdfUrl, 
          title: file.name.replace('.pdf', ''),
          displayMode 
        }).run();
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('PDF yüklenirken hata oluştu.');
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  }, [editor]);

  const handleMediaSelect = useCallback((media: any[]) => {
    if (media.length > 0) {
      const selectedMedia = media[0];
      
      if (mediaType === 'image') {
        editor?.chain().focus().setImage({ src: selectedMedia.url }).run();
      } else if (mediaType === 'video') {
        editor?.chain().focus().setVideoEmbed({ src: selectedMedia.url }).run();
      } else if (mediaType === 'pdf') {
        editor?.chain().focus().setPDFEmbed({ 
          src: selectedMedia.url, 
          title: selectedMedia.originalName || selectedMedia.title || 'PDF Belgesi',
          displayMode: 'ebook' 
        }).run();
      }
    }
    
    setShowMediaManager(false);
  }, [editor, mediaType]);

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

  const AddContentMenu = () => (
    <div 
      ref={menuRef}
      className={`absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 ${showAddMenu ? 'block' : 'hidden'}`}
    >
      <div className="py-2">
        <button
          onClick={() => {
            handleImageUpload();
            setShowAddMenu(false);
          }}
          disabled={isUploading}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon className="w-5 h-5 text-gray-500" />
          <span>Resim Ekle</span>
        </button>
        
        <button
          onClick={() => {
            setMediaType('image');
            setShowMediaManager(true);
            setShowAddMenu(false);
          }}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <ImageIcon className="w-5 h-5 text-gray-500" />
          <span>Medya Kütüphanesi</span>
        </button>
        
        <button
          onClick={() => {
            handleVideoEmbed();
            setShowAddMenu(false);
          }}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3"
        >
          <Video className="w-5 h-5 text-gray-500" />
          <span>Video Embed</span>
        </button>
        
        <div className="border-t border-gray-100">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            PDF Ekle
          </div>
          <button
            onClick={() => {
              handlePDFUpload('viewer');
              setShowAddMenu(false);
            }}
            disabled={isUploading}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-medium">PDF Viewer</div>
              <div className="text-xs text-gray-500">Geleneksel PDF görüntüleyici</div>
            </div>
          </button>
          <button
            onClick={() => {
              handlePDFUpload('ebook');
              setShowAddMenu(false);
            }}
            disabled={isUploading}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
            <div>
              <div className="font-medium">E-Kitap</div>
              <div className="text-xs text-gray-500">Kitap kartı şeklinde görüntü</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const EditorToolbar = () => (
    <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-3 space-y-2">
      <div className="flex flex-wrap items-center gap-1">
        {/* Add Content Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            disabled={isUploading}
            className={`p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${showAddMenu ? 'rotate-45' : ''}`}
            title={isUploading ? 'Yükleniyor...' : 'İçerik Ekle'}
          >
            {isUploading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
          <AddContentMenu />
        </div>

        <div className="w-px h-8 bg-gray-300 mx-2" />

        {/* Text Style */}
        <div className="flex items-center gap-1 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('bold') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Kalın"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('italic') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="İtalik"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('underline') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Altı Çizili"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 mx-2" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Başlık 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Başlık 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Başlık 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 mx-2" />

        {/* Lists and Quotes */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Liste"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Numaralı Liste"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 mx-2" />

        {/* Quote and Code */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('blockquote') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Alıntı"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Kod Bloğu"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 mx-2" />

        {/* Link */}
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            editor.isActive('link') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
          }`}
          title="Link Ekle"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-2" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Sola Hizala"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Ortala"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="Sağa Hizala"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
            title="İki Yana Yasla"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 mx-2" />

        {/* History */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50"
            title="Geri Al"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50"
            title="İleri Al"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Toggle */}
        <div className="ml-auto">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all duration-300"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="hidden md:inline">Düzenleme</span>
                <span className="md:hidden">Düzenle</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden md:inline">Önizleme</span>
                <span className="md:hidden">Önizle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
        <EditorToolbar />
        
        <div className="p-6">
          {showPreview ? (
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                className="preview-content"
              />
            </div>
          ) : (
            <EditorContent 
              editor={editor} 
              className="min-h-[400px] focus-within:ring-2 focus-within:ring-indigo-500 rounded-lg"
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
            color: #9CA3AF;
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
            color: #111827;
          }

          .ProseMirror h2 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #111827;
          }

          .ProseMirror h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #111827;
          }

          .ProseMirror p {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #374151;
          }

          .ProseMirror blockquote {
            border-left: 4px solid #6366F1;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #6B7280;
          }

          .ProseMirror pre {
            background: #F3F4F6;
            border: 1px solid #D1D5DB;
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
            overflow-x: auto;
          }

          .ProseMirror code {
            background: #F3F4F6;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            color: #6366F1;
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
            color: #6366F1;
            text-decoration: underline;
            transition: color 0.3s;
          }

          .ProseMirror a:hover {
            color: #4F46E5;
          }

          /* Video embed styles */
          .video-embed {
            margin: 2rem 0;
            text-align: center;
          }

          .video-embed iframe {
            width: 100%;
            height: 400px;
            border: none;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          /* PDF embed styles */
          .pdf-embed {
            margin: 2rem 0;
            border: 2px solid #D1D5DB;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .pdf-embed iframe {
            width: 100%;
            height: 500px;
            border: none;
          }

          .pdf-embed .pdf-header {
            background: #6366F1;
            color: white;
            padding: 0.75rem 1rem;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .pdf-embed .pdf-header a {
            color: white;
            text-decoration: none;
            padding: 0.25rem 0.5rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 0.25rem;
            transition: background 0.3s;
          }

          .pdf-embed .pdf-header a:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          /* Preview content styles */
          .preview-content .video-embed {
            margin: 2rem 0;
            text-align: center;
          }

          .preview-content .video-embed iframe {
            width: 100%;
            height: 400px;
            border: none;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .preview-content .pdf-embed {
            margin: 2rem 0;
            border: 2px solid #D1D5DB;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .preview-content .pdf-embed iframe {
            width: 100%;
            height: 500px;
            border: none;
          }

          .preview-content .pdf-embed .pdf-header {
            background: #6366F1;
            color: white;
            padding: 0.75rem 1rem;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .preview-content .pdf-embed .pdf-header a {
            color: white;
            text-decoration: none;
            padding: 0.25rem 0.5rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 0.25rem;
            transition: background 0.3s;
          }

          .preview-content .pdf-embed .pdf-header a:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .preview-content img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 2rem auto;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          /* E-book embed styles */
          .pdf-ebook-embed {
            margin: 2rem 0;
            text-align: center;
          }

          .ebook-placeholder {
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            padding: 2rem;
            border: 2px solid #0ea5e9;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .ebook-placeholder:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }

          .ebook-open-btn {
            background: #0ea5e9 !important;
            color: white !important;
            font-weight: 500;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .ebook-open-btn:hover {
            background: #0284c7 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          .preview-content .pdf-ebook-embed {
            margin: 2rem 0;
            text-align: center;
          }

          .preview-content .ebook-placeholder {
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            padding: 2rem;
            border: 2px solid #0ea5e9;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .preview-content .ebook-placeholder:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }

          .preview-content .ebook-open-btn {
            background: #0ea5e9 !important;
            color: white !important;
            font-weight: 500;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .preview-content .ebook-open-btn:hover {
            background: #0284c7 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          /* E-book embed styles */
          .pdf-ebook-embed {
            margin: 2rem 0;
            text-align: center;
          }

          .pdf-ebook-embed button:hover {
            transform: translateY(-1px);
          }

          .pdf-ebook-embed a:hover {
            transform: translateY(-1px);
          }

          .preview-content .pdf-ebook-embed {
            margin: 2rem 0;
            text-align: center;
          }

          .preview-content .pdf-ebook-embed button:hover {
            transform: translateY(-1px);
          }

          .preview-content .pdf-ebook-embed a:hover {
            transform: translateY(-1px);
          }
        `}</style>
      </div>

      {/* Media Manager Modal */}
      {showMediaManager && (
        <MediaManager
          isOpen={showMediaManager}
          onClose={() => setShowMediaManager(false)}
          onSelect={handleMediaSelect}
          selectionMode="single"
          fileType={mediaType === 'pdf' ? 'document' : mediaType}
        />
      )}

      {/* E-Book Viewer Modal */}
      {showEBookViewer && currentEBook && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={() => setShowEBookViewer(false)}
            className="absolute top-4 right-4 z-60 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <EBookViewer
            pdfUrl={currentEBook.url}
            title={currentEBook.title}
            onClose={() => setShowEBookViewer(false)}
          />
        </div>
      )}
    </>
  );
}