'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { useNotification } from '@/hooks/useNotification';
import MediumArticleEditor from '@/components/editor/MediumArticleEditor';
import CategorySelector from '@/components/ui/CategorySelector';
import TagSelector from '@/components/ui/TagSelector';
import {
  ArrowLeftIcon,
  EyeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface ArticleFormData {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  status: string;
  categoryId: number | null;
  tags: string[];
  allowComments: boolean;
  isFeatured: boolean;
}

const initialFormData: ArticleFormData = {
  title: '',
  subtitle: '',
  excerpt: '',
  content: '',
  status: 'draft',
  categoryId: null,
  tags: [],
  allowComments: true,
  isFeatured: false,
};

// Clean function to remove any unwanted properties
const cleanFormData = (data: any) => {
  const {
    title,
    subtitle,
    excerpt,
    content,
    status,
    featuredImage,
    tags,
    allowComments,
    isFeatured,
    metaTitle,
    metaDescription,
    categoryId,
  } = data;
  
  return {
    title: title || '',
    subtitle: subtitle || '',
    excerpt: excerpt || '',
    content: content || '',
    type: 'blog_post',
    status: status || 'draft',
    featuredImage: featuredImage || '',
    tags: tags || [],
    allowComments: allowComments !== undefined ? allowComments : true,
    isFeatured: isFeatured !== undefined ? isFeatured : false,
    metaTitle: metaTitle || '',
    metaDescription: metaDescription || '',
    categoryId: categoryId || null,
  };
};

const statusOptions = [
  { value: 'draft', label: 'Taslak', icon: PencilIcon, color: 'text-brown-medium' },
  { value: 'published', label: 'Yayınlandı', icon: GlobeAltIcon, color: 'text-teal-medium' },
  { value: 'archived', label: 'Arşivlendi', icon: DocumentTextIcon, color: 'text-brown-light' },
];

const commonTags = [
  'teknoloji', 'bilim', 'araştırma', 'yazılım', 'makine öğrenmesi', 'yapay zeka',
  'web geliştirme', 'mobil', 'tasarım', 'ui/ux', 'javascript', 'python', 'react',
  'nodejs', 'database', 'devops', 'cloud', 'güvenlik', 'blockchain', 'iot'
];

export default function CreateArticle() {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData);
  
  // Clear any potential cached data on mount
  useEffect(() => {
    // Clear localStorage if it contains old article data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('article') || key.includes('form')) {
        localStorage.removeItem(key);
      }
    });
  }, []);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [articleId, setArticleId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const { showSuccess, showError, showWarning, NotificationComponent } = useNotification();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    
    // Calculate word count and read time
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const newWordCount = words.length;
    const newReadTime = Math.ceil(newWordCount / 200); // Average reading speed: 200 words/minute
    
    setWordCount(newWordCount);
    setReadTime(newReadTime);
  };

  const handleCategoryCreate = async (name: string, description: string) => {
    try {
      const response = await categoriesAPI.create({ name, description });
      setCategories(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const handleAutoSave = useCallback(async () => {
    if (!articleId && formData.title && formData.content && formData.categoryId) {
      setIsSaving(true);
      try {
        // Clean and send only valid fields
        const submitData = cleanFormData(formData);
        submitData.status = 'draft';

        console.log('Auto-save sending data to backend:', submitData);
        
        const response = await articlesAPI.create(submitData);
        setArticleId(response.data.id);
      } catch (error) {
        console.error('Auto-save error:', error);
      } finally {
        setIsSaving(false);
      }
    }
  }, [articleId, formData]);

  // Auto-update existing article when changes are made
  const handleAutoUpdate = useCallback(async () => {
    if (articleId && formData.title && formData.content && formData.categoryId) {
      setIsSaving(true);
      try {
        // Clean and send only valid fields
        const submitData = cleanFormData(formData);

        console.log('Auto-update sending data to backend:', submitData);
        
        await articlesAPI.update(articleId, submitData);
      } catch (error) {
        console.error('Auto-update error:', error);
      } finally {
        setIsSaving(false);
      }
    }
  }, [articleId, formData]);

  // Auto-save when necessary fields are filled (initial save)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!articleId && formData.title && formData.content && formData.categoryId) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [formData.title, formData.content, formData.categoryId, articleId, handleAutoSave]);

  // Auto-update when article exists and any field changes (including status)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (articleId && formData.title && formData.content && formData.categoryId) {
        handleAutoUpdate();
      }
    }, 1500); // Faster update for existing articles

    return () => clearTimeout(timer);
  }, [formData.title, formData.content, formData.categoryId, formData.status, formData.tags, formData.allowComments, formData.isFeatured, formData.metaTitle, formData.metaDescription, formData.excerpt, articleId, handleAutoUpdate]);

  const handleSubmit = async (status: string) => {
    if (!formData.title || !formData.content || !formData.categoryId) {
      showWarning('Eksik Bilgi', 'Lütfen başlık, içerik ve kategori alanlarını doldurun.');
      return;
    }

    setLoading(true);

    try {
      // Clean and send only valid fields
      const submitData = cleanFormData(formData);
      submitData.status = status;

      console.log('Sending data to backend:', submitData);
      
      if (articleId) {
        await articlesAPI.update(articleId, submitData);
      } else {
        const response = await articlesAPI.create(submitData);
        setArticleId(response.data.id);
      }

      showSuccess(
        status === 'published' ? 'Makale Yayınlandı!' : 'Makale Kaydedildi!',
        status === 'published' ? 'Makale başarıyla yayınlandı.' : 'Makale taslak olarak kaydedildi.',
        status === 'published' ? () => router.push('/admin/articles') : undefined
      );
    } catch (error) {
      console.error('Error saving article:', error);
      showError('Hata Oluştu', 'Makale kaydedilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <ProtectedRoute requireAdmin>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Yeni Makale Oluştur</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Yeni bir makale oluşturun ve yayınlayın
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{wordCount} kelime</span>
                  <span>~{readTime} dk okuma</span>
                  {isSaving && (
                    <span className="text-orange-600 flex items-center gap-1">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {articleId ? 'Güncelleniyor...' : 'Kaydediliyor...'}
                    </span>
                  )}
                  {!isSaving && articleId && (
                    <span className="text-green-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Kaydedildi
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                {showPreview ? 'Düzenle' : 'Önizle'}
              </button>
              
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Taslak Kaydet
              </button>
              
              <button
                onClick={() => handleSubmit('published')}
                disabled={loading || !formData.title || !formData.content || !formData.categoryId}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
              >
                <GlobeAltIcon className="w-4 h-4 mr-2" />
                Yayınla
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Makale başlığını girin..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Alt başlık (opsiyonel)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                İçerik *
              </label>
              <MediumArticleEditor
                initialContent={formData.content}
                articleId={articleId || undefined}
                onChange={handleContentChange}
                placeholder="Makale içeriğini yazın..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Kategori
              </h3>
              <CategorySelector
                categories={categories}
                selectedCategoryId={formData.categoryId}
                onCategorySelect={(id) => handleInputChange('categoryId', id)}
                onCategoryCreate={handleCategoryCreate}
              />
            </div>

            {/* Tags */}
            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Etiketler
              </h3>
              <TagSelector
                tags={formData.tags}
                onTagsChange={(tags) => handleInputChange('tags', tags)}
                suggestions={commonTags}
                maxTags={10}
              />
            </div>

            {/* Status */}
            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Durum
              </h3>
              <fieldset className="space-y-3">
                {statusOptions.map((status) => (
                  <div key={status.value} className="flex items-center">
                    <input
                      id={status.value}
                      name="status"
                      type="radio"
                      checked={formData.status === status.value}
                      onChange={() => handleInputChange('status', status.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label htmlFor={status.value} className="ml-3 flex items-center">
                      <status.icon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{status.label}</div>
                        <div className="text-xs text-gray-500">
                          {status.value === 'published' && 'Herkes tarafından görülebilir'}
                          {status.value === 'draft' && 'Sadece siz görebilirsiniz'}
                          {status.value === 'archived' && 'Arşivde saklanır'}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>

            {/* SEO & Content */}
            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                SEO ve İçerik
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özet
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    placeholder="Makale özeti..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    placeholder="SEO başlığı..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Açıklama
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={3}
                    placeholder="SEO açıklaması..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Seçenekler
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="allowComments"
                    type="checkbox"
                    checked={formData.allowComments}
                    onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="allowComments" className="ml-3 text-sm text-gray-700">
                    Yorumlara izin ver
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isFeatured" className="ml-3 text-sm text-gray-700">
                    Öne çıkarılsın
                  </label>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      <NotificationComponent />
    </ProtectedRoute>
  );
}