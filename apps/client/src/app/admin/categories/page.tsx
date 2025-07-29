'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { categoriesAPI } from '@/lib/api';
import {
  PlusIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  description?: string;
  categoryType: string;
  subCategoryType?: string;
  parentId?: number;
  parent?: Category;
  children?: Category[];
  createdAt: string;
}

const categoryTypeLabels = {
  printed_publications: 'Basılı Yayınlar',
  audio_video_publications: 'Sesli/Görüntülü Yayınlar',
  social_artistic_publications: 'Sosyal/Sanatsal Yayınlar'
};

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    categoryType: 'printed_publications',
    parentId: null as number | null,
  });

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCategory.name.trim()) {
      alert('Lütfen kategori adını girin.');
      return;
    }

    try {
      await categoriesAPI.create(newCategory);
      setShowCreateModal(false);
      setNewCategory({
        name: '',
        description: '',
        categoryType: 'printed_publications',
        parentId: null,
      });
      fetchCategories();
      alert('Kategori başarıyla oluşturuldu!');
    } catch (error: any) {
      console.error('Error creating category:', error);
      alert('Kategori oluşturulurken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

    try {
      await categoriesAPI.delete(id);
      setCategories(categories.filter(category => category.id !== id));
      alert('Kategori başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Kategori silinirken hata oluştu.');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats
      .filter(cat => level === 0 ? !cat.parentId : cat.parentId)
      .map(category => (
        <div key={category.id} className={`${level > 0 ? 'ml-8' : ''}`}>
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-2">
            <div className="flex items-center">
              <FolderIcon className={`h-5 w-5 mr-3 ${level === 0 ? 'text-blue-500' : 'text-gray-400'}`} />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500">{category.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {categoryTypeLabels[category.categoryType as keyof typeof categoryTypeLabels]}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-900"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          {category.children && category.children.length > 0 && (
            <div className="ml-4">
              {renderCategoryTree(category.children, level + 1)}
            </div>
          )}
        </div>
      ));
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Kategoriler</h1>
            <p className="mt-2 text-sm text-gray-700">
              Yayın kategorilerinizi yönetin ve düzenleyin.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
              Yeni Kategori
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Kategori ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-sm text-gray-500">Yükleniyor...</div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Kategori bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Henüz kategori oluşturulmamış veya arama kriterlerinize uygun kategori yok.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {renderCategoryTree(filteredCategories)}
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Kategori Oluştur</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Adı *
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Kategori adı..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama
                    </label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Kategori açıklaması..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Türü
                    </label>
                    <select
                      value={newCategory.categoryType}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, categoryType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="printed_publications">Basılı Yayınlar</option>
                      <option value="audio_video_publications">Sesli/Görüntülü Yayınlar</option>
                      <option value="social_artistic_publications">Sosyal/Sanatsal Yayınlar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Üst Kategori
                    </label>
                    <select
                      value={newCategory.parentId || ''}
                      onChange={(e) => setNewCategory(prev => ({ 
                        ...prev, 
                        parentId: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Ana kategori olarak oluştur</option>
                      {categories
                        .filter(cat => !cat.parentId && cat.categoryType === newCategory.categoryType)
                        .map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Oluştur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
