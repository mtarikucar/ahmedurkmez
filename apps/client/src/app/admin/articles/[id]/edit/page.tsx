'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { Article } from '@/types';
import {
  ArrowLeftIcon,
  PhotoIcon,
  DocumentArrowUpIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface ArticleFormData {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string;
  type: string;
  status: string;
  categoryId: string;
  featuredImage: string;
  pdfFile: string;
  doi: string;
  journal: string;
  publishedDate: string;
  tags: string[];
  keywords: string[];
  authors: string[];
  allowComments: boolean;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
}

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<ArticleFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
      fetchCategories();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const response = await articlesAPI.getById(parseInt(articleId));
      const articleData = response.data;
      setArticle(articleData);
      
      // Convert article data to form data
      setFormData({
        title: articleData.title || '',
        subtitle: articleData.subtitle || '',
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        type: articleData.type || 'blog_post',
        status: articleData.status || 'draft',
        categoryId: articleData.categoryId?.toString() || '',
        featuredImage: articleData.featuredImage || '',
        pdfFile: articleData.pdfFile || '',
        doi: articleData.doi || '',
        journal: articleData.journal || '',
        publishedDate: articleData.publishedDate ? articleData.publishedDate.split('T')[0] : '',
        tags: articleData.tags || [],
        keywords: articleData.keywords || [],
        authors: articleData.authors || [],
        allowComments: articleData.allowComments ?? true,
        isFeatured: articleData.isFeatured ?? false,
        metaTitle: articleData.metaTitle || '',
        metaDescription: articleData.metaDescription || '',
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      router.push('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to mock data
      setCategories([
        { id: 1, name: 'Teknoloji' },
        { id: 2, name: 'Bilim' },
        { id: 3, name: 'Araştırma' },
      ]);
    }
  };

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value,
    }) : null);
  };

  const handleArrayAdd = (field: 'tags' | 'keywords' | 'authors', value: string) => {
    if (!formData || !value.trim() || formData[field].includes(value.trim())) return;
    setFormData(prev => prev ? ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }) : null);
  };

  const handleArrayRemove = (field: 'tags' | 'keywords' | 'authors', index: number) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }) : null);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setCreatingCategory(true);
    try {
      const response = await categoriesAPI.create({
        name: newCategoryName.trim(),
        description: `${newCategoryName.trim()} kategorisi`,
      });

      // Add new category to the list
      setCategories(prev => [...prev, response.data]);

      // Select the new category
      setFormData(prev => prev ? ({
        ...prev,
        categoryId: response.data.id.toString(),
      }) : null);

      // Reset form
      setNewCategoryName('');
      setShowNewCategoryInput(false);
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Kategori oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);

    try {
      const submitData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        publishedDate: formData.publishedDate || undefined,
      };

      await articlesAPI.update(parseInt(articleId), submitData);
      router.push('/admin/articles');
    } catch (error) {
      console.error('Error updating article:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!article || !formData) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Makale bulunamadı</h3>
            <p className="mt-2 text-sm text-gray-500">
              Aradığınız makale mevcut değil veya erişim izniniz yok.
            </p>
            <button
              onClick={() => router.push('/admin/articles')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Makale Listesine Dön
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isAcademicPaper = formData.type === 'academic_paper';

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Makale Düzenle</h1>
                <p className="mt-2 text-gray-600">
                  "{article.title}" makalesini düzenleyin
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Makale başlığını girin..."
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Alt başlık (opsiyonel)..."
                  />
                </div>

                {/* Type and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Makale Türü *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="blog_post">Blog Yazısı (Medium Tarzı)</option>
                      <option value="academic_paper">Akademik Makale (IEEE Tarzı)</option>
                      <option value="research">Araştırma</option>
                      <option value="essay">Deneme</option>
                      <option value="review">İnceleme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <div className="space-y-2">
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange('categoryId', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Kategori seçin...</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>

                      {/* New Category Input */}
                      {showNewCategoryInput ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateCategory();
                              }
                            }}
                            placeholder="Yeni kategori adı..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                          />
                          <button
                            type="button"
                            onClick={handleCreateCategory}
                            disabled={creatingCategory || !newCategoryName.trim()}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {creatingCategory ? '...' : <PlusIcon className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewCategoryInput(false);
                              setNewCategoryName('');
                            }}
                            className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowNewCategoryInput(true)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Yeni Kategori Ekle
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="draft">Taslak</option>
                      <option value="published">Yayınla</option>
                      <option value="archived">Arşivle</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-6 pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allowComments}
                        onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yorumlara izin ver</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Öne çıkarılsın</span>
                    </label>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Özet
                  </label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Makale özeti (SEO ve önizleme için)..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
