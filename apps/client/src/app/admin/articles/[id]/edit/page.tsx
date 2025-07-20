'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { articlesAPI, categoriesAPI } from '@/lib/api';
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
  categoryId: number;
  featuredImage: string;
  tags: string[];
  allowComments: boolean;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
}

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

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = parseInt(params.id as string);
  
  const [formData, setFormData] = useState<ArticleFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    fetchArticle();
    fetchCategories();
  }, []);

  const fetchArticle = async () => {
    try {
      const response = await articlesAPI.getById(articleId);
      const article = response.data;
      
      setFormData({
        title: article.title || '',
        subtitle: article.subtitle || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        status: article.status || 'draft',
        categoryId: article.categoryId || 0,
        featuredImage: article.featuredImage || '',
        tags: article.tags || [],
        allowComments: article.allowComments ?? true,
        isFeatured: article.isFeatured ?? false,
        metaTitle: article.metaTitle || '',
        metaDescription: article.metaDescription || '',
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching article:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value,
    }) : null);
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => prev ? ({ ...prev, content }) : null);
    
    // Calculate word count and read time
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const newWordCount = words.length;
    const newReadTime = Math.ceil(newWordCount / 200);
    
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

  const handleSubmit = async (status: string) => {
    if (!formData || !formData.title || !formData.content || !formData.categoryId) {
      alert('Lütfen başlık, içerik ve kategori alanlarını doldurun.');
      return;
    }

    setSaving(true);

    try {
      // Clean and send only valid fields
      const cleanData = {
        title: formData.title,
        subtitle: formData.subtitle,
        excerpt: formData.excerpt,
        content: formData.content,
        type: 'blog_post', // Always Medium-style
        status,
        featuredImage: formData.featuredImage,
        tags: formData.tags,
        allowComments: formData.allowComments,
        isFeatured: formData.isFeatured,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        categoryId: formData.categoryId,
      };

      console.log('Sending update data to backend:', cleanData);
      
      await articlesAPI.update(articleId, cleanData);
      alert(status === 'published' ? 'Makale yayınlandı!' : 'Makale güncellendi!');
      
      if (status === 'published') {
        router.push('/admin/articles');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Makale güncellenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
          <div className="text-brown-dark font-bookmania">Makale yükleniyor...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!formData) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
          <div className="text-brown-dark font-bookmania">Makale bulunamadı.</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-teal-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="mr-4 p-2 text-brown-light hover:text-burgundy-medium transition-colors duration-300"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-xl font-bookmania-bold text-brown-dark">
                    Makale Düzenle
                  </h1>
                  <p className="text-sm text-brown-light font-bookmania">
                    Medium tarzı zengin içerik editörü
                  </p>
                  <div className="flex items-center gap-4 text-sm text-brown-light">
                    <span>{wordCount} kelime</span>
                    <span>~{readTime} dk okuma</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSubmit('draft')}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-brown-light to-brown-medium text-white rounded-lg hover:from-brown-medium hover:to-brown-dark disabled:opacity-50 transition-all duration-300 font-bookmania-medium"
                >
                  <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                  Taslak Kaydet
                </button>
                
                <button
                  onClick={() => handleSubmit('published')}
                  disabled={saving}
                  className="px-4 py-2 bg-gradient-to-r from-burgundy-medium to-burgundy-dark text-white rounded-lg hover:from-burgundy-dark hover:to-burgundy-dark disabled:opacity-50 transition-all duration-300 font-bookmania-medium"
                >
                  <GlobeAltIcon className="w-4 h-4 inline mr-2" />
                  Yayınla
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="card-seljuk p-6">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Makale başlığınızı buraya yazın..."
                  className="w-full text-4xl font-bookmania-bold text-brown-dark bg-transparent border-none outline-none placeholder-brown-light/60 resize-none"
                />
                
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  placeholder="Alt başlık (opsiyonel)"
                  className="w-full mt-4 text-xl font-bookmania text-brown-medium bg-transparent border-none outline-none placeholder-brown-light/60"
                />
              </div>

              {/* Editor */}
              <MediumArticleEditor
                initialContent={formData.content}
                articleId={articleId}
                onChange={handleContentChange}
                placeholder="Hikayenizi anlatmaya başlayın..."
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <div className="card-seljuk p-6">
                <h3 className="text-lg font-bookmania-bold text-brown-dark mb-4">
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
              <div className="card-seljuk p-6">
                <h3 className="text-lg font-bookmania-bold text-brown-dark mb-4">
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
              <div className="card-seljuk p-6">
                <h3 className="text-lg font-bookmania-bold text-brown-dark mb-4">
                  Durum
                </h3>
                <div className="space-y-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleInputChange('status', status.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                        formData.status === status.value
                          ? 'border-teal-medium bg-gradient-to-r from-teal-light/10 to-teal-medium/10'
                          : 'border-teal-light hover:border-teal-medium/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <status.icon className={`w-5 h-5 ${status.color}`} />
                        <span className="font-bookmania-medium text-brown-dark">
                          {status.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SEO */}
              <div className="card-seljuk p-6">
                <h3 className="text-lg font-bookmania-bold text-brown-dark mb-4">
                  SEO Ayarları
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                      Meta Başlık
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      placeholder="SEO başlığı..."
                      className="w-full px-4 py-3 border-2 border-teal-light rounded-lg bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] font-bookmania text-brown-dark placeholder-brown-light focus:ring-2 focus:ring-teal-medium focus:border-teal-medium outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                      Meta Açıklama
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      rows={3}
                      placeholder="SEO açıklaması..."
                      className="w-full px-4 py-3 border-2 border-teal-light rounded-lg bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] font-bookmania text-brown-dark placeholder-brown-light focus:ring-2 focus:ring-teal-medium focus:border-teal-medium outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                      Özet
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      rows={3}
                      placeholder="Makale özeti..."
                      className="w-full px-4 py-3 border-2 border-teal-light rounded-lg bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] font-bookmania text-brown-dark placeholder-brown-light focus:ring-2 focus:ring-teal-medium focus:border-teal-medium outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="card-seljuk p-6">
                <h3 className="text-lg font-bookmania-bold text-brown-dark mb-4">
                  Seçenekler
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                      className="w-4 h-4 text-teal-medium border-teal-light rounded focus:ring-teal-medium"
                    />
                    <span className="font-bookmania text-brown-dark">
                      Yorumlara izin ver
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="w-4 h-4 text-teal-medium border-teal-light rounded focus:ring-teal-medium"
                    />
                    <span className="font-bookmania text-brown-dark">
                      Öne çıkarılsın
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}