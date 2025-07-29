'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, VideoCameraIcon, MicrophoneIcon, BuildingLibraryIcon, PlayIcon } from '@heroicons/react/24/outline';
import { mediaPublicationsAPI } from '@/lib/api';

const AudiovisualPublicationsPage = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [mediaPublications, setMediaPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaPublications();
  }, []);

  const fetchMediaPublications = async () => {
    try {
      setLoading(true);
      const response = await mediaPublicationsAPI.getAll({ 
        status: 'published'
      });
      setMediaPublications(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching media publications:', error);
      setMediaPublications([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeCount = (type: string) => {
    if (type === 'all') return mediaPublications.length;
    return mediaPublications.filter((media: any) => media.mediaType === type).length;
  };

  const getFilteredPublications = () => {
    if (selectedType === 'all') return mediaPublications;
    return mediaPublications.filter((media: any) => media.mediaType === selectedType);
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const mediaTypes = [
    { id: 'all', name: 'Tümü', count: getTypeCount('all'), icon: null },
    { id: 'tv_show', name: 'TV Oturumları', count: getTypeCount('tv_show'), icon: VideoCameraIcon },
    { id: 'radio_show', name: 'Radyo Programları', count: getTypeCount('radio_show'), icon: MicrophoneIcon },
    { id: 'mosque_lesson', name: 'Cami Dersleri', count: getTypeCount('mosque_lesson'), icon: BuildingLibraryIcon },
  ];

  const filteredPublications = getFilteredPublications();

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
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Sesli/Görüntülü Yayınlar
                </h1>
                <p className="text-sm text-gray-600">
                  TV oturumları, radyo programları ve cami dersleri
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {mediaTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    selectedType === type.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {type.icon && <type.icon className="h-5 w-5 mr-2" />}
                  {type.name}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {type.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="text-center py-12">
            <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Yayın bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bu kategoride henüz yayın bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.map((media) => {
              const videoId = extractYouTubeId(media.youtubeUrl);
              const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
              const IconComponent = mediaTypes.find(t => t.id === media.mediaType)?.icon || VideoCameraIcon;

              return (
                <div
                  key={media.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/media/${media.id}`)}
                >
                  <div className="relative">
                    {thumbnail ? (
                      <div className="relative">
                        <img
                          src={thumbnail}
                          alt={media.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayIcon className="h-16 w-16 text-white bg-red-600 rounded-full p-3 opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <IconComponent className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <IconComponent className="h-3 w-3 mr-1" />
                        {mediaTypes.find(t => t.id === media.mediaType)?.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {media.title}
                    </h3>
                    {media.subtitle && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {media.subtitle}
                      </p>
                    )}
                    {media.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                        {media.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{media.viewCount || 0} görüntülenme</span>
                      </div>
                      <a
                        href={media.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        <PlayIcon className="h-3 w-3 mr-1" />
                        İzle
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudiovisualPublicationsPage;
