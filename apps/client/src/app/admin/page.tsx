'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
    },
    {
      name: 'Toplam Makale',
      value: stats?.articles?.total || 0,
      icon: DocumentTextIcon,
    },
    {
      name: 'Toplam Yorum',
      value: stats?.comments?.total || 0,
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: 'Toplam İletişim',
      value: stats?.contacts?.total || 0,
      icon: EyeIcon,
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Admin paneli yükleniyor...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Sistem istatistikleri ve son aktiviteler
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-white" />
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
          <div className="px-6 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
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
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white shadow ${
                            activity.type === 'article' ? 'bg-blue-500' :
                            activity.type === 'comment' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}>
                            <span className="text-white text-sm font-medium">
                              {activity.type.charAt(0).toUpperCase()}
                            </span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">
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
          <Link
            href="/admin/users"
            className="bg-white p-6 shadow rounded-lg hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  Kullanıcı Yönetimi
                </h3>
                <p className="text-sm text-gray-500">
                  Kullanıcıları görüntüle ve yönet
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/articles"
            className="bg-white p-6 shadow rounded-lg hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors duration-200">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                  Makale Yönetimi
                </h3>
                <p className="text-sm text-gray-500">
                  Makaleleri görüntüle ve yönet
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            className="bg-white p-6 shadow rounded-lg hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-200">
                <EyeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                  Analitik
                </h3>
                <p className="text-sm text-gray-500">
                  İstatistikleri görüntüle
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
