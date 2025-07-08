'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoriesAPI } from '@/lib/api';
import { Category } from '@/types';
import {
  TagIcon,
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon,
  VideoCameraIcon,
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

  const getRandomGradient = (index: number) => {
    const gradients = [
      'from-center-primary to-center-secondary',
      'from-works-primary to-works-secondary',
      'from-resume-primary to-resume-secondary',
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
    ];
    return gradients[index % gradients.length];
  };

  const getRandomIcon = (index: number) => {
    const icons = [TagIcon, BookOpenIcon, AcademicCapIcon, VideoCameraIcon, DocumentTextIcon];
    const IconComponent = icons[index % icons.length];
    return IconComponent;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bookmania" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: 'var(--center-secondary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 sm:py-32 font-bookmania" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight font-bookmania mb-6" style={{ color: 'var(--text-primary)' }}>
            Kategoriler
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed font-bookmania mb-12" style={{ color: 'var(--text-secondary)' }}>
            Makaleleri konularına göre keşfedin ve ilgi alanınıza uygun içerikleri bulun
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <TagIcon className="w-12 h-12" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <h3 className="text-2xl font-bold font-bookmania mb-3" style={{ color: 'var(--text-primary)' }}>
                Henüz kategori bulunmuyor
              </h3>
              <p className="text-lg font-bookmania" style={{ color: 'var(--text-secondary)' }}>
                Yakında farklı kategorilerde makaleler yayınlanacak.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => {
              const IconComponent = getRandomIcon(index);
              return (
                <Link
                  key={category.id}
                  href={`/articles?category=${category.slug}`}
                  className="group transform transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-center-secondary/30">
                    <div className={`h-40 flex items-center justify-center bg-gradient-to-r ${getRandomGradient(index)}`}>
                      <IconComponent className="h-16 w-16 text-white drop-shadow-lg" />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl lg:text-2xl font-bold font-bookmania mb-3 group-hover:text-center-secondary transition-colors" style={{ color: 'var(--text-primary)' }}>
                        {category.name}
                      </h3>
                      
                      {category.description && (
                        <p className="text-base leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex items-center text-sm font-medium" style={{ color: 'var(--center-secondary)' }}>
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        <span>Makaleleri keşfet</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Featured Topics */}
        <div className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold font-bookmania mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
            Araştırma Alanlarım
          </h2>
          
          <div className="rounded-2xl shadow-elegant p-8 border border-center-primary/20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-center-primary to-center-secondary">
                  <BookOpenIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold font-bookmania mb-3" style={{ color: 'var(--text-primary)' }}>
                  Edebiyat Çalışmaları
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Modern ve çağdaş Türk edebiyatı üzerine derinlemesine analizler ve karşılaştırmalı incelemeler
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-works-primary to-works-secondary">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold font-bookmania mb-3" style={{ color: 'var(--text-primary)' }}>
                  Kültürel Araştırmalar
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Doğu-Batı kültür etkileşimi, toplumsal dönüşümler ve kimlik çalışmaları
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-resume-primary to-resume-secondary">
                  <VideoCameraIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold font-bookmania mb-3" style={{ color: 'var(--text-primary)' }}>
                  Akademik İncelemeler
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Karşılaştırmalı edebiyat, interdisipliner yaklaşımlar ve metodolojik çalışmalar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold font-bookmania mb-6" style={{ color: 'var(--text-primary)' }}>
              Tüm Makaleleri Keşfedin
            </h2>
            <p className="text-xl leading-relaxed font-bookmania mb-8" style={{ color: 'var(--text-secondary)' }}>
              Kategorilere göre filtrelenmiş makaleleri incelemek ve arama yapmak için makaleler sayfasını ziyaret edin
            </p>
            <Link
              href="/articles"
              className="inline-flex items-center px-8 py-4 rounded-xl text-lg font-bold font-bookmania text-white bg-gradient-to-r from-center-secondary to-center-tertiary hover:from-center-tertiary hover:to-center-secondary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <DocumentTextIcon className="h-6 w-6 mr-3" />
              Tüm Makaleleri Görüntüle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
