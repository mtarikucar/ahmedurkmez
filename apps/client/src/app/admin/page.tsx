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
      color: 'bg-gradient-teal',
      textColor: 'text-teal-dark',
    },
    {
      name: 'Toplam Makale',
      value: stats?.articles?.total || 0,
      icon: DocumentTextIcon,
      color: 'bg-gradient-burgundy',
      textColor: 'text-burgundy-dark',
    },
    {
      name: 'Toplam Yorum',
      value: stats?.comments?.total || 0,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-gradient-brown',
      textColor: 'text-brown-dark',
    },
    {
      name: 'Toplam İletişim',
      value: stats?.contacts?.total || 0,
      icon: EyeIcon,
      color: 'bg-gradient-primary',
      textColor: 'text-teal-dark',
    },
  ];

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-teal-medium mx-auto mb-4"></div>
            <p className="text-brown-dark font-bookmania text-lg">Admin paneli yükleniyor...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-teal-light rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-burgundy-light rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-brown-light rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="heading-seljuk-large text-4xl lg:text-5xl mb-4">Admin Dashboard</h1>
            <p className="text-lg font-bookmania text-brown-light">
              Sistem istatistikleri ve son aktiviteler
            </p>

            {/* Decorative Seljuk Pattern */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-teal-light rounded-full"></div>
                <div className="w-2 h-2 bg-burgundy-light rounded-full mt-0.5"></div>
                <div className="w-4 h-4 bg-brown-light rounded-full -mt-0.5"></div>
                <div className="w-2 h-2 bg-burgundy-light rounded-full mt-0.5"></div>
                <div className="w-3 h-3 bg-teal-light rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <div
                key={stat.name}
                className="card-seljuk overflow-hidden group hover:scale-105 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${stat.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-bookmania-medium text-brown-light truncate">
                          {stat.name}
                        </dt>
                        <dd className={`text-2xl font-bookmania-bold ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
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
          <div className="card-seljuk">
            <div className="px-6 py-6">
              <h3 className="heading-seljuk text-xl mb-6">
                Son Aktiviteler
              </h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivity.map((activity, index) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {index !== recentActivity.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-teal-light"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg ${
                              activity.type === 'article' ? 'bg-gradient-burgundy' :
                              activity.type === 'comment' ? 'bg-gradient-teal' :
                              'bg-gradient-brown'
                            }`}>
                              <span className="text-white text-sm font-bookmania-bold">
                                {activity.type.charAt(0).toUpperCase()}
                              </span>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm font-bookmania text-brown-dark">
                                {activity.description}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap font-bookmania text-brown-light">
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
              className="card-seljuk p-6 group hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="bg-gradient-teal p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bookmania-bold text-brown-dark group-hover:text-teal-dark transition-colors duration-300">
                    Kullanıcı Yönetimi
                  </h3>
                  <p className="text-sm font-bookmania text-brown-light">
                    Kullanıcıları görüntüle ve yönet
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/admin/articles"
              className="card-seljuk p-6 group hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="bg-gradient-burgundy p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DocumentTextIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bookmania-bold text-brown-dark group-hover:text-burgundy-dark transition-colors duration-300">
                    Makale Yönetimi
                  </h3>
                  <p className="text-sm font-bookmania text-brown-light">
                    Makaleleri görüntüle ve yönet
                  </p>
                </div>
              </div>
            </a>

            <a
              href="/admin/analytics"
              className="card-seljuk p-6 group hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="bg-gradient-brown p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <EyeIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bookmania-bold text-brown-dark group-hover:text-brown-dark transition-colors duration-300">
                    Analitik
                  </h3>
                  <p className="text-sm font-bookmania text-brown-light">
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
