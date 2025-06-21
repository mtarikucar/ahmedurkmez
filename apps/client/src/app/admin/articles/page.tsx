'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { articlesAPI } from '@/lib/api';
import { Article } from '@/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface ArticleFilters {
  status?: string;
  type?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export default function ArticlesManagement() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ArticleFilters>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getAll(filters);

      // Handle both paginated and non-paginated responses
      if (response.data.articles) {
        // Paginated response
        setArticles(response.data.articles);
        setTotalCount(response.data.total);
      } else if (Array.isArray(response.data)) {
        // Direct array response
        setArticles(response.data);
        setTotalCount(response.data.length);
      } else {
        console.error('Unexpected response format:', response.data);
        setArticles([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) {
      try {
        await articlesAPI.delete(id);
        fetchArticles();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handleFilterChange = (key: keyof ArticleFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset to first page when filtering
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', text: 'Yayınlandı' },
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Taslak' },
      archived: { color: 'bg-gray-100 text-gray-800', text: 'Arşivlendi' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    return type === 'academic_paper' ? (
      <AcademicCapIcon className="h-5 w-5 text-blue-600" />
    ) : (
      <DocumentTextIcon className="h-5 w-5 text-green-600" />
    );
  };

  const getTypeText = (type: string) => {
    const typeConfig = {
      academic_paper: 'Akademik Makale',
      blog_post: 'Blog Yazısı',
      research: 'Araştırma',
      essay: 'Deneme',
      review: 'İnceleme',
    };
    return typeConfig[type as keyof typeof typeConfig] || type;
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Makale Yönetimi</h1>
                <p className="mt-2 text-gray-600">
                  Makalelerinizi oluşturun, düzenleyin ve yönetin
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/articles/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Yeni Makale
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Filtreler</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FunnelIcon className="h-4 w-4 mr-1" />
                  {showFilters ? 'Gizle' : 'Göster'}
                </button>
              </div>
            </div>
            
            {showFilters && (
              <div className="px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arama
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Makale başlığı..."
                        value={filters.search || ''}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durum
                    </label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Tümü</option>
                      <option value="published">Yayınlandı</option>
                      <option value="draft">Taslak</option>
                      <option value="archived">Arşivlendi</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tür
                    </label>
                    <select
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Tümü</option>
                      <option value="academic_paper">Akademik Makale</option>
                      <option value="blog_post">Blog Yazısı</option>
                      <option value="research">Araştırma</option>
                      <option value="essay">Deneme</option>
                      <option value="review">İnceleme</option>
                    </select>
                  </div>

                  {/* Results per page */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sayfa başına
                    </label>
                    <select
                      value={filters.limit || 10}
                      onChange={(e) => handleFilterChange('limit', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Articles Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Makaleler ({totalCount})
                </h3>
              </div>

              {!loading && articles.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Makale bulunamadı</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filters.search || filters.status || filters.type
                      ? 'Arama kriterlerinize uygun makale bulunamadı. Filtreleri temizleyerek tekrar deneyin.'
                      : 'Yeni bir makale oluşturarak başlayın.'
                    }
                  </p>
                  <div className="mt-6 space-x-3">
                    {(filters.search || filters.status || filters.type) && (
                      <button
                        onClick={() => {
                          setFilters({ page: 1, limit: 10 });
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Filtreleri Temizle
                      </button>
                    )}
                    <button
                      onClick={() => router.push('/admin/articles/new')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Yeni Makale
                    </button>
                  </div>
                </div>
              ) : articles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Makale
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İstatistikler
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {articles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {article.featuredImage && (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                  src={article.featuredImage}
                                  alt={article.title}
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {article.title}
                                </div>
                                {article.subtitle && (
                                  <div className="text-sm text-gray-500">
                                    {article.subtitle}
                                  </div>
                                )}
                                {article.category && (
                                  <div className="text-xs text-gray-400">
                                    {article.category.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getTypeIcon(article.type)}
                              <span className="ml-2 text-sm text-gray-900">
                                {getTypeText(article.type)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(article.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="space-y-1">
                              <div>{article.viewCount} görüntülenme</div>
                              <div>{article.likeCount} beğeni</div>
                              <div>{article.comments?.length || 0} yorum</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Görüntüle"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Düzenle"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Sil"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Makaleler yükleniyor...</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {articles.length > 0 && totalCount > (filters.limit || 10) && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1).toString())}
                    disabled={(filters.page || 1) <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <button
                    onClick={() => handleFilterChange('page', ((filters.page || 1) + 1).toString())}
                    disabled={(filters.page || 1) >= Math.ceil(totalCount / (filters.limit || 10))}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{((filters.page || 1) - 1) * (filters.limit || 10) + 1}</span>
                      {' - '}
                      <span className="font-medium">
                        {Math.min((filters.page || 1) * (filters.limit || 10), totalCount)}
                      </span>
                      {' / '}
                      <span className="font-medium">{totalCount}</span>
                      {' sonuç gösteriliyor'}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1).toString())}
                        disabled={(filters.page || 1) <= 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Önceki
                      </button>
                      <button
                        onClick={() => handleFilterChange('page', ((filters.page || 1) + 1).toString())}
                        disabled={(filters.page || 1) >= Math.ceil(totalCount / (filters.limit || 10))}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sonraki
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
