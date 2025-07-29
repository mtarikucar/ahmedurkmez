'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { booksAPI, categoriesAPI, uploadAPI } from '@/lib/api';
import FileUpload from '@/components/ui/FileUpload';
import { useNotification } from '@/hooks/useNotification';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

interface BookFormData {
  title: string;
  subtitle: string;
  description: string;
  content: string;
  bookType: string;
  status: string;
  tags: string[];
  allowComments: boolean;
  isFeatured: boolean;
  categoryId: number | null;
  pdfFile: string;
}

const initialFormData: BookFormData = {
  title: '',
  subtitle: '',
  description: '',
  content: '',
  bookType: 'theoretical',
  status: 'draft',
  tags: [],
  allowComments: true,
  isFeatured: false,
  categoryId: null,
  pdfFile: '',
};

const bookTypes = [
  { value: 'theoretical', label: 'Teorik' },
  { value: 'text', label: 'Metin' },
  { value: 'translation', label: 'Çeviri' },
  { value: 'diary_memoir', label: 'Günlük/Hatırat' },
  { value: 'e_book', label: 'e-Kitap' },
];

export default function CreateBook() {
  const router = useRouter();
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showSuccess, showError, showWarning, NotificationComponent } = useNotification();

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

  const handleInputChange = (field: keyof BookFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (status: string) => {
    if (!formData.title || !formData.content) {
      showWarning('Eksik Bilgi', 'Lütfen başlık ve içerik alanlarını doldurun.');
      return;
    }

    setLoading(true);

    try {
      let pdfUrl = formData.pdfFile;

      // Upload PDF if selected
      if (selectedFile) {
        setUploading(true);
        const uploadResponse = await uploadAPI.uploadPDF(selectedFile);
        pdfUrl = uploadResponse.data.url;
        setUploading(false);
      }

      const submitData = {
        ...formData,
        status,
        pdfFile: pdfUrl,
      };

      await booksAPI.create(submitData);
      showSuccess(
        status === 'published' ? 'Kitap Yayınlandı!' : 'Kitap Kaydedildi!',
        status === 'published' ? 'Kitap başarıyla yayınlandı.' : 'Kitap taslak olarak kaydedildi.',
        () => router.push('/admin/books')
      );
    } catch (error: any) {
      console.error('Error saving book:', error);
      showError(
        'Hata Oluştu',
        'Kitap kaydedilirken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata')
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

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
                Yeni Kitap Oluştur
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Yeni bir kitap ekleyin ve yayınlayın.
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
                    placeholder="Kitap başlığı..."
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
                    placeholder="Kitap açıklaması..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Kitap içeriği..."
                  />
                </div>

                {/* PDF Upload */}
                <div>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    accept=".pdf"
                    maxSize={50}
                    label="PDF Dosyası"
                    description="Kitabın PDF dosyasını yükleyin"
                    currentFile={formData.pdfFile}
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
                    Kitap Türü
                  </label>
                  <select
                    value={formData.bookType}
                    onChange={(e) => handleInputChange('bookType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {bookTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
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
                    placeholder="kitap, edebiyat, roman..."
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
                    disabled={loading || uploading}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    {uploading ? 'Yükleniyor...' : 'Taslak'}
                  </button>

                  <button
                    onClick={() => handleSubmit('published')}
                    disabled={loading || uploading || !formData.title || !formData.content}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <GlobeAltIcon className="w-4 h-4 mr-2" />
                    {uploading ? 'Yükleniyor...' : 'Yayınla'}
                  </button>
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
