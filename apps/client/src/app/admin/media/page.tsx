'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { mediaPublicationsAPI } from '@/lib/api';
import {
  PlusIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  BuildingLibraryIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

interface MediaPublication {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  youtubeUrl: string;
  duration?: number;
  mediaType: string;
  status: string;
  viewCount: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

const mediaTypeLabels = {
  tv_show: 'Televizyon Oturumu',
  radio_show: 'Radyo Programı',
  mosque_lesson: 'Cami Dersi'
};

const mediaTypeIcons = {
  tv_show: VideoCameraIcon,
  radio_show: MicrophoneIcon,
  mosque_lesson: BuildingLibraryIcon
};

const statusLabels = {
  draft: 'Taslak',
  published: 'Yayınlandı',
  archived: 'Arşivlendi'
};

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800'
};

export default function MediaPublicationsAdmin() {
  const [publications, setPublications] = useState<MediaPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchPublications();
  }, [searchTerm, statusFilter, typeFilter]);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.mediaType = typeFilter;

      const response = await mediaPublicationsAPI.getAll(params);
      setPublications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching media publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yayını silmek istediğinizden emin misiniz?')) return;

    try {
      await mediaPublicationsAPI.delete(id);
      setPublications(publications.filter(pub => pub.id !== id));
    } catch (error) {
      console.error('Error deleting media publication:', error);
      alert('Yayın silinirken hata oluştu.');
    }
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

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Sesli/Görüntülü Yayınlar</h1>
            <p className="mt-2 text-sm text-gray-700">
              Televizyon oturumları, radyo programları ve cami derslerinizi yönetin.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/admin/media/create"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              Yeni Yayın
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Yayın ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="">Tüm Türler</option>
            <option value="tv_show">Televizyon Oturumları</option>
            <option value="radio_show">Radyo Programları</option>
            <option value="mosque_lesson">Cami Dersleri</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
          >
            <option value="">Tüm Durumlar</option>
            <option value="draft">Taslak</option>
            <option value="published">Yayınlandı</option>
            <option value="archived">Arşivlendi</option>
          </select>
        </div>

        {/* Publications Table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Yayın
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Tür
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Süre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Görüntülenme
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">İşlemler</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          Yükleniyor...
                        </td>
                      </tr>
                    ) : publications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                          Henüz yayın bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      publications.map((publication) => {
                        const videoId = extractYouTubeId(publication.youtubeUrl);
                        const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                        const IconComponent = mediaTypeIcons[publication.mediaType as keyof typeof mediaTypeIcons] || VideoCameraIcon;
                        
                        return (
                          <tr key={publication.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-16 w-24 relative">
                                  {thumbnail ? (
                                    <div className="relative">
                                      <img
                                        src={thumbnail}
                                        alt={publication.title}
                                        className="h-16 w-24 object-cover rounded-lg"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayIcon className="h-8 w-8 text-white bg-red-600 rounded-full p-1" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="h-16 w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <IconComponent className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {publication.title}
                                  </div>
                                  {publication.subtitle && (
                                    <div className="text-sm text-gray-500">
                                      {publication.subtitle}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <IconComponent className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900">
                                  {mediaTypeLabels[publication.mediaType as keyof typeof mediaTypeLabels]}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDuration(publication.duration)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[publication.status as keyof typeof statusColors]}`}>
                                {statusLabels[publication.status as keyof typeof statusLabels] || publication.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <EyeIcon className="h-4 w-4 text-gray-400 mr-1" />
                                {publication.viewCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <a
                                  href={publication.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-600 hover:text-red-900"
                                  title="YouTube'da İzle"
                                >
                                  <PlayIcon className="h-4 w-4" />
                                </a>
                                <Link
                                  href={`/admin/media/${publication.id}/edit`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(publication.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
