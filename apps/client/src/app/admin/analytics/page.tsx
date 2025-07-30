'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminAPI, articlesAPI } from '@/lib/api';
import {
  ChartBarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  popularArticles: any[];
  articlesByMonth: any[];
  commentsByMonth: any[];
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgViewsPerArticle: number;
}

interface StatCard {
  name: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: any;
  color: string;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12'); // months

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [popularResponse, articlesByMonthResponse, commentsByMonthResponse] = await Promise.all([
        adminAPI.getPopularArticles(10),
        adminAPI.getArticlesByMonth(),
        adminAPI.getCommentsByMonth(),
      ]);

      // Calculate totals from popular articles
      const articles = popularResponse.data;
      const totalViews = articles.reduce((sum: number, article: any) => sum + (article.viewCount || 0), 0);
      const totalLikes = articles.reduce((sum: number, article: any) => sum + (article.likeCount || 0), 0);
      const totalComments = articles.reduce((sum: number, article: any) => sum + (article.comments?.length || 0), 0);

      setData({
        popularArticles: articles,
        articlesByMonth: articlesByMonthResponse.data,
        commentsByMonth: commentsByMonthResponse.data,
        totalViews,
        totalLikes,
        totalComments,
        avgViewsPerArticle: articles.length > 0 ? Math.round(totalViews / articles.length) : 0,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const statCards: StatCard[] = [
    {
      name: 'Toplam Görüntülenme',
      value: formatNumber(data?.totalViews || 0),
      change: '+12%',
      changeType: 'increase',
      icon: EyeIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Toplam Beğeni',
      value: formatNumber(data?.totalLikes || 0),
      change: '+8%',
      changeType: 'increase',
      icon: HeartIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Toplam Yorum',
      value: formatNumber(data?.totalComments || 0),
      change: '+15%',
      changeType: 'increase',
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Ortalama Görüntülenme',
      value: formatNumber(data?.avgViewsPerArticle || 0),
      change: '+5%',
      changeType: 'increase',
      icon: ArrowTrendingUpIcon,
      color: 'bg-purple-500',
    },
  ];

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
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Analitik</h1>
            <p className="mt-2 text-sm text-gray-700">
              Makale performansı ve kullanıcı etkileşimi istatistikleri
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="3">Son 3 Ay</option>
              <option value="6">Son 6 Ay</option>
              <option value="12">Son 12 Ay</option>
              <option value="24">Son 2 Yıl</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-md`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        {stat.change && (
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Articles by Month Chart */}
          <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Aylık Makale Sayısı</h3>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Grafik Yükleniyor</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Chart.js veya benzeri bir kütüphane ile grafik gösterilecek
                </p>
              </div>
            </div>
          </div>

          {/* Comments by Month Chart */}
          <div className="bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Aylık Yorum Sayısı</h3>
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Grafik Yükleniyor</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Chart.js veya benzeri bir kütüphane ile grafik gösterilecek
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mt-8 bg-white shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              En Popüler Makaleler
            </h3>
              
            {data?.popularArticles && data.popularArticles.length > 0 ? (
              <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Makale
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Görüntülenme
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Beğeni
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Yorum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Tarih
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.popularArticles.map((article, index) => (
                          <tr key={article.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {article.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {article.category?.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <EyeIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-900">
                                  {formatNumber(article.viewCount || 0)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <HeartIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-900">
                                  {formatNumber(article.likeCount || 0)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-sm text-gray-900">
                                  {article.comments?.length || 0}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz veri yok</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Makale yayınladıktan sonra analitik veriler burada görünecek.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
