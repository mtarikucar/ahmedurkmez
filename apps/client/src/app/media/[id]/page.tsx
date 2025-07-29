'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mediaPublicationsAPI } from '@/lib/api';
import { 
  ArrowLeftIcon, 
  VideoCameraIcon, 
  MicrophoneIcon,
  BuildingLibraryIcon,
  CalendarIcon, 
  TagIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface MediaPublication {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  youtubeUrl: string;
  mediaType: string;
  duration?: number;
  tags: string[];
  viewCount: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [media, setMedia] = useState<MediaPublication | null>(null);
  const [loading, setLoading] = useState(true);
  const [youtubeEmbedId, setYoutubeEmbedId] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchMedia(params.id as string);
    }
  }, [params.id]);

  const fetchMedia = async (id: string) => {
    try {
      setLoading(true);
      const response = await mediaPublicationsAPI.getById(parseInt(id));
      setMedia(response.data);
      
      // Extract YouTube video ID for embedding
      if (response.data.youtubeUrl) {
        const videoId = extractYouTubeId(response.data.youtubeUrl);
        setYoutubeEmbedId(videoId);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'Bilinmiyor';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}s ${minutes}dk`;
    }
    return `${minutes}dk`;
  };

  const getMediaTypeInfo = (type: string) => {
    switch (type) {
      case 'tv_show':
        return { label: 'TV Oturumu', icon: VideoCameraIcon, color: 'blue' };
      case 'radio_show':
        return { label: 'Radyo Programı', icon: MicrophoneIcon, color: 'green' };
      case 'mosque_lesson':
        return { label: 'Cami Dersi', icon: BuildingLibraryIcon, color: 'purple' };
      default:
        return { label: type, icon: VideoCameraIcon, color: 'gray' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="text-center">
          <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Yayın bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aradığınız yayın mevcut değil veya kaldırılmış olabilir.
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

  const mediaTypeInfo = getMediaTypeInfo(media.mediaType);
  const IconComponent = mediaTypeInfo.icon;

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
                  {media.title}
                </h1>
                <p className="text-sm text-gray-600">{mediaTypeInfo.label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* YouTube Video */}
              {youtubeEmbedId && (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeEmbedId}?rel=0&modestbranding=1`}
                    title={media.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Media Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-${mediaTypeInfo.color}-100 rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`h-8 w-8 text-${mediaTypeInfo.color}-600`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {media.title}
                    </h1>
                    {media.subtitle && (
                      <h2 className="text-lg text-gray-600 mb-3">
                        {media.subtitle}
                      </h2>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(media.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {media.viewCount} görüntülenme
                      </div>
                      {media.duration && (
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatDuration(media.duration)}
                        </div>
                      )}
                      {media.category && (
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 mr-1" />
                          {media.category.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Description */}
              {media.description && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Açıklama</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {media.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Media Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Yayın Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tür:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {mediaTypeInfo.label}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Yayın Tarihi:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {formatDate(media.createdAt)}
                  </span>
                </div>
                {media.duration && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Süre:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {formatDuration(media.duration)}
                    </span>
                  </div>
                )}
                {media.category && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Kategori:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {media.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* YouTube Link */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">YouTube'da İzle</h3>
              <a
                href={media.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <VideoCameraIcon className="h-4 w-4 mr-2" />
                YouTube'da Aç
              </a>
            </div>

            {/* Tags */}
            {media.tags && media.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {media.tags.map((tag, index) => (
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
