'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminAPI } from '@/lib/api';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    admins: number;
  };
  articles: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  contacts: {
    total: number;
    new: number;
    read: number;
    replied: number;
  };
  categories: {
    total: number;
    active: number;
  };
  media: {
    total: number;
    totalSize: number;
  };
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  createdAt: string;
}

interface RecentActivityResponse {
  recentArticles: any[];
  recentComments: any[];
  recentContacts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getRecentActivity(),
      ]);

      setStats(statsResponse.data);

      // Transform the activity response into a unified array
      const activityData: RecentActivityResponse = activityResponse.data;
      const unifiedActivity: RecentActivity[] = [];

      // Add recent articles
      activityData.recentArticles?.forEach(article => {
        unifiedActivity.push({
          id: article.id,
          type: 'article',
          description: `Yeni makale: ${article.title}`,
          createdAt: article.createdAt,
        });
      });

      // Add recent comments
      activityData.recentComments?.forEach(comment => {
        unifiedActivity.push({
          id: comment.id,
          type: 'comment',
          description: `Yeni yorum: ${comment.article?.title || 'Bilinmeyen makale'}`,
          createdAt: comment.createdAt,
        });
      });

      // Add recent contacts
      activityData.recentContacts?.forEach(contact => {
        unifiedActivity.push({
          id: contact.id,
          type: 'contact',
          description: `Yeni mesaj: ${contact.name} - ${contact.subject}`,
          createdAt: contact.createdAt,
        });
      });

      // Sort by creation date (newest first)
      unifiedActivity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setRecentActivity(unifiedActivity.slice(0, 10)); // Take top 10
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Toplam Kullanıcı',
      value: stats?.users?.total || 0,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Toplam Makale',
      value: stats?.articles?.total || 0,
      icon: DocumentTextIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Toplam Yorum',
      value: stats?.comments?.total || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Toplam İletişim',
      value: stats?.contacts?.total || 0,
      icon: EyeIcon,
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Sistem istatistikleri ve son aktiviteler
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg"
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
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Son Aktiviteler
              </h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivity.map((activity, index) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {index !== recentActivity.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                              <span className="text-white text-sm font-medium">
                                {activity.type.charAt(0).toUpperCase()}
                              </span>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {activity.description}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/admin/users"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Kullanıcı Yönetimi
                  </h3>
                  <p className="text-sm text-gray-500">
                    Kullanıcıları görüntüle ve yönet
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/admin/articles"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Makale Yönetimi
                  </h3>
                  <p className="text-sm text-gray-500">
                    Makaleleri görüntüle ve yönet
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/admin/analytics"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <EyeIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Analitik
                  </h3>
                  <p className="text-sm text-gray-500">
                    İstatistikleri görüntüle
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
