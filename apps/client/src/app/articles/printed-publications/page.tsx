'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, BookOpenIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { booksAPI, articlesAPI, papersAPI } from '@/lib/api';

const PrintedPublicationsPage = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      
      // Fetch all printed publications
      const [booksResponse, articlesResponse, papersResponse] = await Promise.all([
        booksAPI.getAll({ status: 'published' }),
        articlesAPI.getAll({ status: 'published' }),
        papersAPI.getAll({ status: 'published' })
      ]);

      const books = (booksResponse.data?.data || []).map((item: any) => ({ ...item, type: 'book' }));
      const articles = (articlesResponse.data?.data || []).map((item: any) => ({ ...item, type: 'article' }));
      const papers = (papersResponse.data?.data || []).map((item: any) => ({ ...item, type: 'paper' }));

      const allPublications = [...books, ...articles, ...papers].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setPublications(allPublications);
    } catch (error) {
      console.error('Error fetching publications:', error);
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeCount = (type: string) => {
    if (type === 'all') return publications.length;
    return publications.filter((pub: any) => pub.type === type).length;
  };

  const getFilteredPublications = () => {
    if (selectedType === 'all') return publications;
    return publications.filter((pub: any) => pub.type === selectedType);
  };

  const publicationTypes = [
    { id: 'all', name: 'Tümü', count: getTypeCount('all'), icon: null },
    { id: 'book', name: 'Kitaplarım', count: getTypeCount('book'), icon: BookOpenIcon },
    { id: 'article', name: 'Makalelerim', count: getTypeCount('article'), icon: DocumentTextIcon },
    { id: 'paper', name: 'Bildirilerim', count: getTypeCount('paper'), icon: AcademicCapIcon },
  ];

  const filteredPublications = getFilteredPublications();

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
                  Basılı Yayınlar
                </h1>
                <p className="text-sm text-gray-600">
                  Kitaplar, makaleler ve bildiriler
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
              {publicationTypes.map((type) => (
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
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Yayın bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Bu kategoride henüz yayın bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.map((publication) => {
              const IconComponent = publicationTypes.find(t => t.id === publication.type)?.icon || BookOpenIcon;

              return (
                <div
                  key={`${publication.type}-${publication.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    const detailPath = publication.type === 'book' ? `/books/${publication.id}` :
                                     publication.type === 'article' ? `/articles/${publication.id}` :
                                     `/papers/${publication.id}`;
                    router.push(detailPath);
                  }}
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
                          {publicationTypes.find(t => t.id === publication.type)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {publication.title}
                    </h3>
                    
                    {publication.subtitle && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {publication.subtitle}
                      </p>
                    )}
                    
                    {publication.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                        {publication.description}
                      </p>
                    )}

                    {/* Publication specific details */}
                    {publication.type === 'book' && publication.bookType && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Tür:</span> {publication.bookType === 'theoretical' ? 'Teorik' : 'Pratik'}
                      </div>
                    )}

                    {publication.type === 'paper' && publication.paperType && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Tür:</span> {
                          publication.paperType === 'methodology_history' ? 'Usul/Tarih' :
                          publication.paperType === 'social_sciences' ? 'Sosyal Bilimler' :
                          'Tenkit İçerikli'
                        }
                      </div>
                    )}

                    {publication.category && (
                      <div className="text-sm text-gray-500 mb-2">
                        <span className="font-medium">Kategori:</span> {publication.category.name}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{publication.viewCount || 0} görüntülenme</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(publication.createdAt)}</span>
                      </div>
                      <div className="flex space-x-2">
                        {publication.pdfFile && (
                          <a
                            href={publication.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                          >
                            PDF
                          </a>
                        )}
                        {publication.purchaseLink && (
                          <a
                            href={publication.purchaseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            Satın Al
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

export default PrintedPublicationsPage;
