'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { creativeWorksAPI } from '@/lib/api';
import {
  PlusIcon,
  PresentationChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

interface Presentation {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  content: string;
  venue?: string;
  eventDate?: string;
  audience?: string;
  pdfFile?: string;
  videoUrl?: string;
  audioUrl?: string;
  status: string;
  viewCount: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

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

export default function PresentationsAdmin() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchPresentations();
  }, [searchTerm, statusFilter]);

  const fetchPresentations = async () => {
    try {
      setLoading(true);
      const params: any = { workType: 'presentation' };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await creativeWorksAPI.getAll(params);
      setPresentations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu sunumu silmek istediğinizden emin misiniz?')) return;

    try {
      await creativeWorksAPI.delete(id);
      setPresentations(presentations.filter(presentation => presentation.id !== id));
    } catch (error) {
      console.error('Error deleting presentation:', error);
      alert('Sunum silinirken hata oluştu.');
    }
  };

  const truncateContent = (content: string, maxLength: number = 120): string => {
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Sunumlarım</h1>
            <p className="mt-2 text-sm text-gray-700">
              Sunumlarınızı yönetin, düzenleyin ve yeni sunumlar ekleyin.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/admin/presentations/create"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              Yeni Sunum
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
              placeholder="Sunum ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          
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

        {/* Presentations Table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Sunum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Mekan/Hedef Kitle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Medya
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Sunum Tarihi
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
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Yükleniyor...
                        </td>
                      </tr>
                    ) : presentations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          Henüz sunum bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      presentations.map((presentation) => (
                        <tr key={presentation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <PresentationChartBarIcon className="h-6 w-6 text-orange-600" />
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {presentation.title}
                                </div>
                                {presentation.subtitle && (
                                  <div className="text-sm text-gray-500 mb-1">
                                    {presentation.subtitle}
                                  </div>
                                )}
                                <div className="text-xs text-gray-400">
                                  {truncateContent(presentation.content, 100)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              {presentation.venue && (
                                <div className="font-medium">{presentation.venue}</div>
                              )}
                              {presentation.audience && (
                                <div className="text-gray-500 text-xs">{presentation.audience}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              {presentation.pdfFile && (
                                <div className="flex items-center text-xs text-blue-600">
                                  <DocumentArrowDownIcon className="h-3 w-3 mr-1" />
                                  PDF
                                </div>
                              )}
                              {presentation.videoUrl && (
                                <div className="flex items-center text-xs text-red-600">
                                  <VideoCameraIcon className="h-3 w-3 mr-1" />
                                  Video
                                </div>
                              )}
                              {presentation.audioUrl && (
                                <div className="flex items-center text-xs text-green-600">
                                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114A4.369 4.369 0 005 11c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                  </svg>
                                  Ses
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {presentation.eventDate ? new Date(presentation.eventDate).toLocaleDateString('tr-TR') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[presentation.status as keyof typeof statusColors]}`}>
                              {statusLabels[presentation.status as keyof typeof statusLabels] || presentation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <EyeIcon className="h-4 w-4 text-gray-400 mr-1" />
                              {presentation.viewCount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                href={`/admin/presentations/${presentation.id}/edit`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(presentation.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
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
