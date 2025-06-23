'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI, authAPI } from '@/lib/api';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await usersAPI.update(user.id, formData);
      setSuccess(true);
      setIsEditing(false);
      // Optionally refresh user data here
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
    setIsEditing(false);
    setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    setPasswordLoading(true);

    try {
      await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordError('');
    setPasswordSuccess(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8 font-bookmania" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shadow-xl rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {/* Header */}
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--resume-primary)' }}>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-bookmania" style={{ color: 'var(--text-primary)' }}>Profil</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Düzenle
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-6 py-6">
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">Profil başarıyla güncellendi.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture & Basic Info */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="mx-auto h-32 w-32 rounded-full bg-indigo-500 flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="h-32 w-32 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-16 w-16 text-white" />
                      )}
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Üye olma: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : ''}
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user?.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user?.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            Ad
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            disabled={!isEditing}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Soyad
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            disabled={!isEditing}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          E-posta
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          disabled={!isEditing}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Biyografi
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          disabled={!isEditing}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                          value={formData.bio}
                          onChange={handleChange}
                        />
                      </div>

                      {isEditing && (
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            İptal
                          </button>
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Hesap Ayarları</h2>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Şifre Değiştir</h3>
                    <p className="text-sm text-gray-500">Hesap güvenliğiniz için düzenli olarak şifrenizi değiştirin</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Şifre Değiştir
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Hesap Durumu</h3>
                      <p className="text-sm text-gray-500">Hesabınız aktif durumda</p>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-900 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Şifre Değiştir</h3>
              <button
                onClick={handlePasswordModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">Şifre başarıyla değiştirildi!</p>
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{passwordError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handlePasswordModalClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? 'Değiştiriliyor...' : 'Şifre Değiştir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
