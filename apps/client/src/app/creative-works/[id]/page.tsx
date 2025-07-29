'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { creativeWorksAPI } from '@/lib/api';
import PDFViewer from '@/components/ui/PDFViewer';
import {
  ArrowLeftIcon,
  PresentationChartBarIcon,
  HeartIcon,
  PencilSquareIcon,
  CalendarIcon,
  TagIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  VideoCameraIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

interface CreativeWork {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  content: string;
  creativeWorkType: string;
  venue?: string;
  eventDate?: string;
  audience?: string;
  meter?: string;
  rhymeScheme?: string;
  wordCount?: number;
  readingTime?: number;
  pdfFile?: string;
  videoUrl?: string;
  audioUrl?: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export default function CreativeWorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [work, setWork] = useState<CreativeWork | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchWork(params.id as string);
    }
  }, [params.id]);

  const fetchWork = async (id: string) => {
    try {
      setLoading(true);
      const response = await creativeWorksAPI.getById(parseInt(id));
      setWork(response.data);
      
      // If PDF exists, set it for viewing
      if (response.data.pdfFile) {
        setPdfUrl(response.data.pdfFile);
      }
    } catch (error) {
      console.error('Error fetching creative work:', error);
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

  const getWorkTypeInfo = (type: string) => {
    switch (type) {
      case 'presentation':
        return { label: 'Sunum', icon: PresentationChartBarIcon, color: 'blue' };
      case 'poem':
        return { label: 'Şiir', icon: HeartIcon, color: 'pink' };
      case 'essay':
        return { label: 'Deneme', icon: PencilSquareIcon, color: 'green' };
      default:
        return { label: type, icon: PresentationChartBarIcon, color: 'gray' };
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="text-center">
          <PresentationChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Eser bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aradığınız eser mevcut değil veya kaldırılmış olabilir.
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

  const workTypeInfo = getWorkTypeInfo(work.creativeWorkType);
  const IconComponent = workTypeInfo.icon;
  const youtubeEmbedId = work.videoUrl ? extractYouTubeId(work.videoUrl) : null;

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
                  {work.title}
                </h1>
                <p className="text-sm text-gray-600">{workTypeInfo.label}</p>
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
              {/* Video if available */}
              {youtubeEmbedId && (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeEmbedId}?rel=0&modestbranding=1`}
                    title={work.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Work Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-${workTypeInfo.color}-100 rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`h-8 w-8 text-${workTypeInfo.color}-600`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {work.title}
                    </h1>
                    {work.subtitle && (
                      <h2 className="text-lg text-gray-600 mb-3">
                        {work.subtitle}
                      </h2>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {work.eventDate ? formatDate(work.eventDate) : formatDate(work.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {work.viewCount} görüntülenme
                      </div>
                      {work.category && (
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 mr-1" />
                          {work.category.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Description */}
              {work.description && (
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Açıklama</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {work.description}
                  </p>
                </div>
              )}

              {/* Work Content */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {work.creativeWorkType === 'poem' ? 'Şiir Metni' : 'İçerik'}
                </h3>
                <div className="prose max-w-none">
                  <div 
                    className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${
                      work.creativeWorkType === 'poem' ? 'font-serif text-center' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: work.content.replace(/\n/g, '<br>') }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Work Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Eser Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tür:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {workTypeInfo.label}
                  </span>
                </div>
                {work.venue && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Mekan:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {work.venue}
                    </span>
                  </div>
                )}
                {work.eventDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Etkinlik Tarihi:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {formatDate(work.eventDate)}
                    </span>
                  </div>
                )}
                {work.audience && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Hedef Kitle:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {work.audience}
                    </span>
                  </div>
                )}
                {work.meter && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Vezin:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {work.meter}
                    </span>
                  </div>
                )}
                {work.rhymeScheme && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Kafiye:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {work.rhymeScheme}
                    </span>
                  </div>
                )}
                {work.wordCount && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Kelime Sayısı:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {work.wordCount}
                    </span>
                  </div>
                )}
                {work.readingTime && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Okuma Süresi:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {work.readingTime} dakika
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Media Links */}
            {(work.videoUrl || work.audioUrl) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Medya</h3>
                <div className="space-y-3">
                  {work.videoUrl && (
                    <a
                      href={work.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      <VideoCameraIcon className="h-4 w-4 mr-2" />
                      Video İzle
                    </a>
                  )}
                  {work.audioUrl && (
                    <a
                      href={work.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      <SpeakerWaveIcon className="h-4 w-4 mr-2" />
                      Ses Dinle
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* PDF Viewer */}
            {pdfUrl && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  PDF Görüntüleyici
                </h3>
                <PDFViewer file={pdfUrl} title={work?.title} />
              </div>
            )}

            {/* Tags */}
            {work.tags && work.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag, index) => (
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
