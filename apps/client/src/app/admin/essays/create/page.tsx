'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { creativeWorksAPI, categoriesAPI } from '@/lib/api';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface EssayFormData {
  title: string;
  subtitle: string;
  description: string;
  content: string;
  venue: string;
  eventDate: string;
  status: string;
  tags: string[];
  allowComments: boolean;
  isFeatured: boolean;
  categoryId: number | null;
}

const initialFormData: EssayFormData = {
  title: '',
  subtitle: '',
  description: '',
  content: '',
  venue: '',
  eventDate: '',
  status: 'draft',
  tags: [],
  allowComments: true,
  isFeatured: false,
  categoryId: null,
};

export default function CreateEssay() {
  const router = useRouter();
  const [formData, setFormData] = useState<EssayFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (field: keyof EssayFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateReadingTime = (wordCount: number): number => {
    // Average reading speed: 200 words per minute
    return Math.ceil(wordCount / 200);
  };

  const handleSubmit = async (status: string) => {
    if (!formData.title || !formData.content) {
      alert('Lütfen başlık ve içerik alanlarını doldurun.');
      return;
    }

    setLoading(true);

    try {
      const wordCount = calculateWordCount(formData.content);
      const readingTime = calculateReadingTime(wordCount);

      const submitData = {
        ...formData,
        creativeWorkType: 'essay',
        status,
        wordCount,
        readingTime,
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : undefined,
      };

      await creativeWorksAPI.create(submitData);
      alert(status === 'published' ? 'Deneme yayınlandı!' : 'Deneme kaydedildi!');
      router.push('/admin/essays');
    } catch (error: any) {
      console.error('Error saving essay:', error);
      alert('Deneme kaydedilirken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const wordCount = calculateWordCount(formData.content);
  const readingTime = calculateReadingTime(wordCount);

  return (
    <ProtectedRoute requireAdmin>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Yeni Deneme Oluştur
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Yeni bir deneme ekleyin ve yayınlayın.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Temel Bilgiler
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deneme başlığı..."
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Alt başlık..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deneme hakkında kısa açıklama..."
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      İçerik *
                    </label>
                    <div className="text-sm text-gray-500">
                      {wordCount} kelime • {readingTime} dk okuma
                    </div>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deneme metnini buraya yazın..."
                  />
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yayınlandığı Yer
                    </label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dergi, gazete, etkinlik..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yayın Tarihi
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                İstatistikler
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kelime Sayısı:</span>
                  <span className="text-sm font-medium text-gray-900">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Okuma Süresi:</span>
                  <span className="text-sm font-medium text-gray-900">{readingTime} dakika</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Karakter Sayısı:</span>
                  <span className="text-sm font-medium text-gray-900">{formData.content.length}</span>
                </div>
              </div>
            </div>

            {/* Publish */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Yayınla
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => handleInputChange('categoryId', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiketler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
                      handleInputChange('tags', tags);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="deneme, edebiyat, düşünce..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Yorumlara izin ver
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Öne çıkarılsın
                    </span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSubmit('draft')}
                    disabled={loading}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Taslak
                  </button>
                  
                  <button
                    onClick={() => handleSubmit('published')}
                    disabled={loading || !formData.title || !formData.content}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <GlobeAltIcon className="w-4 h-4 mr-2" />
                    Yayınla
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
