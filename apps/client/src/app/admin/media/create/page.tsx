'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { mediaPublicationsAPI, categoriesAPI } from '@/lib/api';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  PlayIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

interface MediaFormData {
  title: string;
  subtitle: string;
  description: string;
  youtubeUrl: string;
  mediaType: string;
  status: string;
  tags: string[];
  allowComments: boolean;
  isFeatured: boolean;
  categoryId: number | null;
}

const initialFormData: MediaFormData = {
  title: '',
  subtitle: '',
  description: '',
  youtubeUrl: '',
  mediaType: 'tv_show',
  status: 'draft',
  tags: [],
  allowComments: true,
  isFeatured: false,
  categoryId: null,
};

const mediaTypes = [
  { value: 'tv_show', label: 'Televizyon Oturumu', icon: VideoCameraIcon },
  { value: 'radio_show', label: 'Radyo Programı', icon: MicrophoneIcon },
  { value: 'mosque_lesson', label: 'Cami Dersi', icon: BuildingLibraryIcon },
];

export default function CreateMediaPublication() {
  const router = useRouter();
  const [formData, setFormData] = useState<MediaFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [youtubePreview, setYoutubePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.youtubeUrl) {
      const videoId = extractYouTubeId(formData.youtubeUrl);
      if (videoId) {
        setYoutubePreview(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`);
      } else {
        setYoutubePreview(null);
      }
    } else {
      setYoutubePreview(null);
    }
  }, [formData.youtubeUrl]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleInputChange = (field: keyof MediaFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (status: string) => {
    if (!formData.title || !formData.youtubeUrl) {
      alert('Lütfen başlık ve YouTube URL alanlarını doldurun.');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        status,
      };

      await mediaPublicationsAPI.create(submitData);
      alert(status === 'published' ? 'Yayın yayınlandı!' : 'Yayın kaydedildi!');
      router.push('/admin/media');
    } catch (error: any) {
      console.error('Error saving media publication:', error);
      alert('Yayın kaydedilirken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const selectedMediaType = mediaTypes.find(type => type.value === formData.mediaType);

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
                Yeni Yayın Oluştur
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Yeni bir sesli/görüntülü yayın ekleyin ve yayınlayın.
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
                    placeholder="Yayın başlığı..."
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
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {youtubePreview && (
                    <div className="mt-3">
                      <div className="relative inline-block">
                        <img
                          src={youtubePreview}
                          alt="YouTube Preview"
                          className="w-48 h-36 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayIcon className="h-12 w-12 text-white bg-red-600 rounded-full p-2" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Yayın açıklaması..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Yayınla
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yayın Türü *
                  </label>
                  <div className="space-y-2">
                    {mediaTypes.map((type) => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="radio"
                          name="mediaType"
                          value={type.value}
                          checked={formData.mediaType === type.value}
                          onChange={(e) => handleInputChange('mediaType', e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3 flex items-center">
                          <type.icon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{type.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

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
                    placeholder="yayın, program, sohbet..."
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
                    disabled={loading || !formData.title || !formData.youtubeUrl}
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
