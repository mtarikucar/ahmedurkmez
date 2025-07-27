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
import { useState, useCallback, useRef } from 'react';
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
import { articlesAPI } from '@/lib/api';
import MediaManager from '@/components/admin/MediaManager';

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
  const menuRef = useRef<HTMLDivElement>(null);

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
      VideoEmbed,
      PDFEmbed,
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
        const imageUrl = response.data.url || response.data.media?.url;

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

  const handleVideoEmbed = useCallback(() => {
    const url = window.prompt('Video URL\'sini girin (YouTube, Vimeo veya direkt video)');
    
    if (url) {
      editor?.chain().focus().setVideoEmbed({ src: url }).run();
    }
  }, [editor]);

  const handlePDFUpload = useCallback(async () => {
    if (!articleId) {
      alert('Lütfen önce makaleyi kaydedin.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('pdf', file);

        const response = await articlesAPI.uploadPDF(articleId, formData);
        const pdfUrl = response.data.pdfFile || response.data.media?.url;

        editor?.chain().focus().setPDFEmbed({ src: pdfUrl, title: file.name }).run();
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('PDF yüklenirken hata oluştu.');
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  }, [editor, articleId]);

  const handleMediaSelect = useCallback((media: any[]) => {
    if (media.length > 0) {
      const selectedMedia = media[0];
      
      if (mediaType === 'image') {
        editor?.chain().focus().setImage({ src: selectedMedia.url }).run();
      } else if (mediaType === 'video') {
        editor?.chain().focus().setVideoEmbed({ src: selectedMedia.url }).run();
      } else if (mediaType === 'pdf') {
        editor?.chain().focus().setPDFEmbed({ src: selectedMedia.url, title: selectedMedia.originalName }).run();
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
      className={`absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-teal-light z-50 ${showAddMenu ? 'block' : 'hidden'}`}
    >
      <div className="py-2">
        <button
          onClick={() => {
            handleImageUpload();
            setShowAddMenu(false);
          }}
          className="w-full px-4 py-2 text-left text-brown-dark hover:bg-gradient-to-r hover:from-[var(--bg-primary)] hover:to-[var(--bg-secondary)] flex items-center gap-3"
        >
          <ImageIcon className="w-5 h-5 text-teal-medium" />
          <span>Resim Ekle</span>
        </button>
        
        <button
          onClick={() => {
            setMediaType('image');
            setShowMediaManager(true);
            setShowAddMenu(false);
          }}
          className="w-full px-4 py-2 text-left text-brown-dark hover:bg-gradient-to-r hover:from-[var(--bg-primary)] hover:to-[var(--bg-secondary)] flex items-center gap-3"
        >
          <ImageIcon className="w-5 h-5 text-teal-medium" />
          <span>Medya Kütüphanesi</span>
        </button>
        
        <button
          onClick={() => {
            handleVideoEmbed();
            setShowAddMenu(false);
          }}
          className="w-full px-4 py-2 text-left text-brown-dark hover:bg-gradient-to-r hover:from-[var(--bg-primary)] hover:to-[var(--bg-secondary)] flex items-center gap-3"
        >
          <Video className="w-5 h-5 text-burgundy-medium" />
          <span>Video Embed</span>
        </button>
        
        <button
          onClick={() => {
            handlePDFUpload();
            setShowAddMenu(false);
          }}
          className="w-full px-4 py-2 text-left text-brown-dark hover:bg-gradient-to-r hover:from-[var(--bg-primary)] hover:to-[var(--bg-secondary)] flex items-center gap-3"
        >
          <FileText className="w-5 h-5 text-brown-medium" />
          <span>PDF Ekle</span>
        </button>
      </div>
    </div>
  );

  const EditorToolbar = () => (
    <div className="sticky top-0 z-10 bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] border-b-2 border-teal-light p-3 space-y-2">
      <div className="flex flex-wrap items-center gap-1">
        {/* Add Content Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className={`p-2 rounded-full bg-gradient-to-r from-teal-medium to-teal-dark text-white hover:from-teal-dark hover:to-teal-dark transition-all duration-300 ${showAddMenu ? 'rotate-45' : ''}`}
            title="İçerik Ekle"
          >
            <Plus className="w-5 h-5" />
          </button>
          <AddContentMenu />
        </div>

        <div className="w-px h-8 bg-teal-light mx-2" />

        {/* Text Style */}
        <div className="flex items-center gap-1 pr-2">
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

        <div className="w-px h-8 bg-teal-light mx-2" />

        {/* Headings */}
        <div className="flex items-center gap-1">
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

        <div className="w-px h-8 bg-teal-light mx-2" />

        {/* Lists and Quotes */}
        <div className="flex items-center gap-1">
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

        <div className="w-px h-8 bg-teal-light mx-2" />

        {/* Quote and Code */}
        <div className="flex items-center gap-1">
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

        <div className="w-px h-8 bg-teal-light mx-2" />

        {/* Link */}
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-teal-light/20 transition-colors ${
            editor.isActive('link') ? 'bg-teal-medium text-white' : 'text-brown-dark'
          }`}
          title="Link Ekle"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-teal-light mx-2" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
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

        <div className="w-px h-8 bg-teal-light mx-2" />

        {/* History */}
        <div className="flex items-center gap-1">
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
                <EyeOff className="w-4 h-4 text-brown-dark" />
                <span className="hidden md:inline text-brown-dark">Düzenleme</span>
                <span className="md:hidden text-brown-dark">Düzenle</span>
                {/* For mobile view */}
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-brown-dark" />
                <span className="hidden md:inline text-brown-dark">Önizleme</span>
                <span className="md:hidden text-brown-dark">Önizle</span>
                {/* For mobile view */}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="card-seljuk overflow-hidden">
        <EditorToolbar />
        
        <div className="p-6">
          {showPreview ? (
            <div className="prose prose-lg max-w-none font-bookmania text-brown-dark">
              <div 
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                className="preview-content"
              />
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
            border: 2px solid #269393;
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
            background: #269393;
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
            border: 2px solid #269393;
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
            background: #269393;
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
    </>
  );
}