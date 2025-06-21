'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoriesAPI } from '@/lib/api';
import { Category } from '@/types';
import {
  TagIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Kategoriler
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Makaleleri konularına göre keşfedin
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Kategori bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Henüz hiç kategori eklenmemiş.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/articles?category=${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div 
                    className="h-32 flex items-center justify-center"
                    style={{ backgroundColor: category.color || '#6366f1' }}
                  >
                    <TagIcon className="h-12 w-12 text-white" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                        {category.description}
                      </p>
                    )}
                    
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      <span>Makaleleri görüntüle</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Featured Categories */}
        {categories.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Popüler Konular
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Edebiyat Çalışmaları
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Modern ve çağdaş Türk edebiyatı üzerine derinlemesine analizler
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Kültürel Araştırmalar
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Doğu-Batı kültür etkileşimi ve toplumsal dönüşümler
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Akademik İncelemeler
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Karşılaştırmalı edebiyat ve interdisipliner yaklaşımlar
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tüm Makaleleri Keşfedin
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Kategorilere göre filtrelenmiş makaleleri incelemek için makaleler sayfasını ziyaret edin.
          </p>
          <Link
            href="/articles"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Tüm Makaleleri Görüntüle
          </Link>
        </div>
      </div>
    </div>
  );
}
