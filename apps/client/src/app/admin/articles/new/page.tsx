'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { Article } from '@/types';
import MediaManager from '@/components/admin/MediaManager';
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

const initialFormData: ArticleFormData = {
  title: '',
  subtitle: '',
  excerpt: '',
  content: '',
  type: 'blog_post',
  status: 'draft',
  categoryId: '',
  featuredImage: '',
  pdfFile: '',
  doi: '',
  journal: '',
  publishedDate: '',
  tags: [],
  keywords: [],
  authors: [],
  allowComments: true,
  isFeatured: false,
  metaTitle: '',
  metaDescription: '',
};

export default function NewArticle() {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [showMediaManager, setShowMediaManager] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

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
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayAdd = (field: 'tags' | 'keywords' | 'authors', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const handleArrayRemove = (field: 'tags' | 'keywords' | 'authors', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
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
      setFormData(prev => ({
        ...prev,
        categoryId: response.data.id.toString(),
      }));

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
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        publishedDate: formData.publishedDate || undefined,
      };

      const response = await articlesAPI.create(submitData);
      alert('Makale başarıyla oluşturuldu!');
      router.push('/admin/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Makale oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const isAcademicPaper = formData.type === 'academic_paper';

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-brown-light hover:text-burgundy-medium transition-colors duration-300"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="heading-seljuk-large text-3xl lg:text-4xl text-brown-dark">Yeni Makale</h1>
                <p className="mt-2 font-bookmania text-brown-light">
                  Yeni bir makale oluşturun
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="card-seljuk p-6">
              <h3 className="text-lg font-bookmania-bold text-brown-dark mb-4">Temel Bilgiler</h3>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="block w-full px-4 py-3 border-2 border-teal-light rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] font-bookmania text-brown-dark placeholder-brown-light"
                    placeholder="Makale başlığını girin..."
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                    Alt Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="block w-full px-4 py-3 border-2 border-teal-light rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] font-bookmania text-brown-dark placeholder-brown-light"
                    placeholder="Alt başlık (opsiyonel)..."
                  />
                </div>

                {/* Type and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                      Makale Türü *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="block w-full px-4 py-3 border-2 border-teal-light rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] font-bookmania text-brown-dark"
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

            {/* Academic Paper Specific Fields */}
            {isAcademicPaper && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Akademik Makale Bilgileri</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  {/* DOI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DOI (Digital Object Identifier)
                    </label>
                    <input
                      type="text"
                      value={formData.doi}
                      onChange={(e) => handleInputChange('doi', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="10.1000/182"
                    />
                  </div>

                  {/* Journal and Published Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dergi/Konferans
                      </label>
                      <input
                        type="text"
                        value={formData.journal}
                        onChange={(e) => handleInputChange('journal', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Dergi veya konferans adı"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yayın Tarihi
                      </label>
                      <input
                        type="date"
                        value={formData.publishedDate}
                        onChange={(e) => handleInputChange('publishedDate', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                      PDF Dosyası
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-teal-light rounded-lg bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] hover:border-teal-medium transition-colors duration-300">
                      <div className="space-y-1 text-center">
                        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-teal-medium" />
                        <div className="flex text-sm font-bookmania text-brown-dark">
                          <label className="relative cursor-pointer bg-gradient-to-r from-teal-medium to-teal-dark rounded-md font-bookmania-medium text-white px-3 py-1 hover:from-teal-dark hover:to-teal-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-medium transition-all duration-300">
                            <span>PDF dosyası yükle</span>
                            <input
                              type="file"
                              accept=".pdf"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  // Handle PDF upload
                                  console.log('PDF file selected:', file);
                                }
                              }}
                            />
                          </label>
                          <p className="pl-1">veya sürükle bırak</p>
                        </div>
                        <p className="text-xs font-bookmania text-brown-light">PDF dosyaları, maksimum 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anahtar Kelimeler
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('keywords', index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleArrayAdd('keywords', newKeyword);
                            setNewKeyword('');
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Anahtar kelime ekle..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleArrayAdd('keywords', newKeyword);
                          setNewKeyword('');
                        }}
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Authors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yazarlar
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.authors.map((author, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {author}
                          <button
                            type="button"
                            onClick={() => handleArrayRemove('authors', index)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleArrayAdd('authors', newAuthor);
                            setNewAuthor('');
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Yazar adı ekle..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleArrayAdd('authors', newAuthor);
                          setNewAuthor('');
                        }}
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Editor */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">İçerik</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Makale İçeriği *
                </label>
                <textarea
                  required
                  rows={15}
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder={isAcademicPaper
                    ? "Akademik makale içeriğini Markdown formatında yazın...\n\n# Giriş\n\nBu çalışmada...\n\n## Metodoloji\n\n### Veri Toplama\n\n## Sonuçlar\n\n## Tartışma\n\n## Sonuç\n\n## Kaynaklar"
                    : "Makale içeriğini Markdown formatında yazın...\n\n# Ana Başlık\n\nBuraya giriş paragrafınızı yazın.\n\n## Alt Başlık\n\nDetayları burada açıklayın.\n\n### Daha Küçük Başlık\n\n- Liste öğesi 1\n- Liste öğesi 2\n\n**Kalın metin** ve *italik metin* kullanabilirsiniz."
                  }
                />
                <p className="mt-2 text-sm text-gray-500">
                  Markdown formatını kullanabilirsiniz. Başlıklar için #, kalın metin için **metin**, italik için *metin* kullanın.
                </p>
              </div>
            </div>

            {/* Media Management */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medya ve Görseller</h3>

              {/* Featured Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öne Çıkan Görsel
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Görsel yükle</span>
                        <input type="file" accept="image/*" className="sr-only" />
                      </label>
                      <p className="pl-1">veya sürükle bırak</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF dosyaları, maksimum 5MB</p>
                  </div>
                </div>
              </div>

              {/* Additional Media */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ek Medya Dosyaları
                </label>
                <div className="border border-gray-300 rounded-md p-4">
                  <div className="text-center py-4">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Makale içinde kullanmak üzere görsel, video veya dosya yükleyin
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMediaManager(true)}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Medya Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Etiketler ve SEO</h3>

              <div className="space-y-6">
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiketler
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleArrayRemove('tags', index)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleArrayAdd('tags', newTag);
                          setNewTag('');
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Etiket ekle..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleArrayAdd('tags', newTag);
                        setNewTag('');
                      }}
                      className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* SEO Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Başlığı
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="SEO için özel başlık (boş bırakılırsa makale başlığı kullanılır)"
                  />
                </div>

                {/* SEO Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Açıklaması
                  </label>
                  <textarea
                    rows={3}
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Arama motorları için açıklama (150-160 karakter önerilir)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.metaDescription.length}/160 karakter
                  </p>
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
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Makaleyi Kaydet'}
              </button>
            </div>
          </form>

          {/* Media Manager Modal */}
          <MediaManager
            isOpen={showMediaManager}
            onClose={() => setShowMediaManager(false)}
            onSelect={(media) => {
              // Insert media into content at cursor position
              const mediaMarkdown = media.type === 'image'
                ? `![${media.alt || media.title}](${media.url})`
                : `[${media.title}](${media.url})`;

              setFormData(prev => ({
                ...prev,
                content: prev.content + '\n\n' + mediaMarkdown + '\n\n'
              }));
            }}
            allowMultiple={false}
            acceptedTypes={['image', 'video', 'document']}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
