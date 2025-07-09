'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { usersAPI } from '@/lib/api';
import { User } from '@/types';
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await usersAPI.delete(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Kullanıcı silinirken bir hata oluştu');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="heading-seljuk-large text-3xl lg:text-4xl text-brown-dark">Kullanıcı Yönetimi</h1>
                <p className="mt-2 font-bookmania text-brown-light">
                  Sistem kullanıcılarını görüntüle ve yönet
                </p>
              </div>
              <button className="btn-primary flex items-center space-x-2">
                <UserPlusIcon className="h-5 w-5" />
                <span>Yeni Kullanıcı</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              className="w-full px-4 py-3 border-2 border-teal-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] font-bookmania text-brown-dark placeholder-brown-light"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Users Table */}
          <div className="card-seljuk shadow-xl overflow-hidden">
            <table className="min-w-full divide-y divide-teal-light">
              <thead className="bg-gradient-to-r from-teal-light to-teal-medium">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bookmania-bold text-white uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bookmania-bold text-white uppercase tracking-wider">
                    E-posta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bookmania-bold text-white uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bookmania-bold text-white uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bookmania-bold text-white uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bookmania-bold text-white uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] divide-y divide-teal-light">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gradient-to-r hover:from-teal-light/20 hover:to-burgundy-light/20 transition-all duration-300">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-medium to-teal-dark flex items-center justify-center shadow-lg">
                            <span className="text-white font-bookmania-bold">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bookmania-medium text-brown-dark">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bookmania text-brown-dark">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-bookmania-medium rounded-full ${
                        user.role === 'admin'
                          ? 'bg-burgundy-light text-white'
                          : 'bg-teal-light text-white'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-bookmania-medium rounded-full ${
                        user.isActive
                          ? 'bg-teal-medium text-white'
                          : 'bg-burgundy-medium text-white'
                      }`}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bookmania text-brown-dark">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-teal-medium hover:text-teal-dark transition-colors duration-300">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-burgundy-medium hover:text-burgundy-dark transition-colors duration-300"
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="font-bookmania text-brown-light">Kullanıcı bulunamadı</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
