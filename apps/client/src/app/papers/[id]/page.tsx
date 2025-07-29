'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { papersAPI } from '@/lib/api';
import PDFViewer from '@/components/ui/PDFViewer';
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  CalendarIcon,
  TagIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface Paper {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  content: string;
  paperType: string;
  pdfFile?: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPaper(params.id as string);
    }
  }, [params.id]);

  const fetchPaper = async (id: string) => {
    try {
      setLoading(true);
      const response = await papersAPI.getById(parseInt(id));
      setPaper(response.data);
      
      // If PDF exists, set it for viewing
      if (response.data.pdfFile) {
        setPdfUrl(response.data.pdfFile);
      }
    } catch (error) {
      console.error('Error fetching paper:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPaperTypeLabel = (type: string) => {
    switch (type) {
      case 'methodology_history':
        return 'Usul/Tarih';
      case 'social_sciences':
        return 'Sosyal Bilimler';
      case 'criticism':
        return 'Tenkit İçerikli';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="text-center">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Bildiri bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aradığınız bildiri mevcut değil veya kaldırılmış olabilir.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 truncate max-w-md">
                  {paper.title}
                </h1>
                <p className="text-sm text-gray-600">Bildiri Detayı</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Paper Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {paper.title}
                    </h1>
                    {paper.subtitle && (
                      <h2 className="text-lg text-gray-600 mb-3">
                        {paper.subtitle}
                      </h2>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(paper.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {paper.viewCount} görüntülenme
                      </div>
                      {paper.category && (
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 mr-1" />
                          {paper.category.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Paper Description */}
              {paper.description && (
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Açıklama</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {paper.description}
                  </p>
                </div>
              )}

              {/* Paper Content */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">İçerik</h3>
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: paper.content.replace(/\n/g, '<br>') }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Paper Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bildiri Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tür:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {getPaperTypeLabel(paper.paperType)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Yayın Tarihi:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {formatDate(paper.createdAt)}
                  </span>
                </div>
                {paper.category && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Kategori:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {paper.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* PDF Viewer */}
            {pdfUrl && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  PDF Görüntüleyici
                </h3>
                <PDFViewer file={pdfUrl} title={paper?.title} />
              </div>
            )}

            {/* Tags */}
            {paper.tags && paper.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {paper.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
