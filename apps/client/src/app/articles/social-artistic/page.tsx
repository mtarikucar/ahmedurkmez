'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, PresentationChartBarIcon, HeartIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { creativeWorksAPI } from '@/lib/api';

const SocialArtisticPublicationsPage = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [creativeWorks, setCreativeWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCreativeWorks();
  }, []);

  const fetchCreativeWorks = async () => {
    try {
      setLoading(true);
      const response = await creativeWorksAPI.getAll({ 
        status: 'published'
      });
      setCreativeWorks(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching creative works:', error);
      setCreativeWorks([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeCount = (type: string) => {
    if (type === 'all') return creativeWorks.length;
    return creativeWorks.filter((work: any) => work.creativeWorkType === type).length;
  };

  const getFilteredWorks = () => {
    if (selectedType === 'all') return creativeWorks;
    return creativeWorks.filter((work: any) => work.creativeWorkType === selectedType);
  };

  const workTypes = [
    { id: 'all', name: 'Tümü', count: getTypeCount('all'), icon: null },
    { id: 'presentation', name: 'Sunumlarım', count: getTypeCount('presentation'), icon: PresentationChartBarIcon },
    { id: 'poem', name: 'Şiirlerim', count: getTypeCount('poem'), icon: HeartIcon },
    { id: 'essay', name: 'Denemelerim', count: getTypeCount('essay'), icon: PencilSquareIcon },
  ];

  const filteredWorks = getFilteredWorks();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

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
                  Sosyal/Sanatsal Yayınlar
                </h1>
                <p className="text-sm text-gray-600">
                  Sunumlar, şiirler ve denemeler
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
              {workTypes.map((type) => (
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
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-12">
            <PresentationChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Yayın bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bu kategoride henüz yayın bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => {
              const IconComponent = workTypes.find(t => t.id === work.creativeWorkType)?.icon || PresentationChartBarIcon;

              return (
                <div
                  key={work.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/creative-works/${work.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {workTypes.find(t => t.id === work.creativeWorkType)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {work.title}
                    </h3>
                    
                    {work.subtitle && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {work.subtitle}
                      </p>
                    )}
                    
                    {work.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                        {work.description}
                      </p>
                    )}

                    {/* Work specific details */}
                    {work.venue && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Mekan:</span> {work.venue}
                      </div>
                    )}

                    {work.eventDate && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Tarih:</span> {formatDate(work.eventDate)}
                      </div>
                    )}

                    {work.creativeWorkType === 'essay' && work.wordCount && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Kelime Sayısı:</span> {work.wordCount}
                      </div>
                    )}

                    {work.creativeWorkType === 'poem' && work.meter && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Vezin:</span> {work.meter}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{work.viewCount || 0} görüntülenme</span>
                      </div>
                      <div className="flex space-x-2">
                        {work.pdfFile && (
                          <a
                            href={work.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            PDF
                          </a>
                        )}
                        {work.videoUrl && (
                          <a
                            href={work.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 transition-colors"
                          >
                            Video
                          </a>
                        )}
                        {work.audioUrl && (
                          <a
                            href={work.audioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 transition-colors"
                          >
                            Ses
                          </a>
                        )}
                      </div>
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

export default SocialArtisticPublicationsPage;
