'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon, DocumentTextIcon, FilmIcon, PaintBrushIcon, BookOpenIcon, MicrophoneIcon, CameraIcon } from '@heroicons/react/24/outline';

const ArticlesPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Ana kategoriler - Site renk şemasına uygun
  const mainCategories = [
    {
      id: 'printed',
      name: 'Basılı Yayınlar',
      description: 'Kitaplar, makaleler, araştırmalar ve akademik yayınlar',
      icon: BookOpenIcon,
      gradient: 'from-amber-600 via-amber-700 to-orange-800',
      color: 'amber',
      bgClass: 'bg-gradient-brown',
      borderClass: 'border-brown-light/30',
      itemCount: 127,
      subcategories: ['Kitaplar', 'Makaleler', 'Araştırmalar', 'Akademik Yayınlar']
    },
    {
      id: 'audiovisual',
      name: 'Görsel-İşitsel Yayınlar',
      description: 'Video içerikler, podcast\'ler, televizyon programları',
      icon: FilmIcon,
      gradient: 'from-red-600 via-red-700 to-red-800',
      color: 'red',
      bgClass: 'bg-gradient-burgundy',
      borderClass: 'border-burgundy-light/30',
      itemCount: 89,
      subcategories: ['Video İçerikler', 'Podcast\'ler', 'TV Programları', 'Röportajlar']
    },
    {
      id: 'social',
      name: 'Sosyal ve Sanatsal Yayınlar',
      description: 'Blog yazıları, sosyal medya içerikleri, sanatsal projeler',
      icon: PaintBrushIcon,
      gradient: 'from-teal-600 via-teal-700 to-teal-800',
      color: 'teal',
      bgClass: 'bg-gradient-teal',
      borderClass: 'border-teal-light/30',
      itemCount: 156,
      subcategories: ['Blog Yazıları', 'Sosyal Medya', 'Sanatsal Projeler', 'Fotoğrafçılık']
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/articles/${categoryId}`);
  };

  const handleViewAll = () => {
    router.push('/articles/all');
  };

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Decorative Seljuk Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="bg-teal-medium rounded-full w-2 h-2 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-dark/20 via-burgundy-dark/20 to-brown-dark/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="heading-seljuk-large text-5xl font-bold text-brown-dark mb-6 drop-shadow-2xl">
              Eserler ve Yayınlar
            </h1>
            <p className="text-xl text-brown-light max-w-3xl mx-auto leading-relaxed font-bookmania">
              Yıllar içinde üretilen akademik çalışmalar, sanatsal projeler ve sosyal içeriklerin 
              kapsamlı koleksiyonu. Her kategori, farklı alanlardaki uzmanlığı ve yaratıcılığı yansıtır.
            </p>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="card-seljuk text-center">
              <div className="text-3xl font-bookmania-bold text-teal-dark mb-2">372</div>
              <div className="text-brown-dark text-sm font-bookmania">Toplam Eser</div>
            </div>
            <div className="card-seljuk text-center">
              <div className="text-3xl font-bookmania-bold text-burgundy-medium mb-2">15</div>
              <div className="text-brown-dark text-sm font-bookmania">Yıllık Deneyim</div>
            </div>
            <div className="card-seljuk text-center">
              <div className="text-3xl font-bookmania-bold text-brown-dark mb-2">45</div>
              <div className="text-brown-dark text-sm font-bookmania">Farklı Platform</div>
            </div>
            <div className="card-seljuk text-center">
              <div className="text-3xl font-bookmania-bold text-amber-600 mb-2">1.2M</div>
              <div className="text-brown-dark text-sm font-bookmania">Toplam Görüntüleme</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Kategoriler */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mainCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`relative overflow-hidden rounded-xl cursor-pointer ${category.bgClass} border-2 ${category.borderClass} shadow-lg backdrop-blur-sm`}
              >
                {/* Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white/90 rounded-xl backdrop-blur-sm border border-gray-200/50 shadow-sm">
                      <IconComponent className="w-8 h-8 text-brown-dark" />
                    </div>
                    <div className="text-right bg-white/80 p-3 rounded-lg shadow-sm">
                      <div className="text-brown-light text-sm font-bookmania">Toplam</div>
                      <div className="text-2xl font-bookmania-bold text-brown-dark">{category.itemCount}</div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1">
                    <h3 className="text-2xl heading-seljuk font-bold text-brown-dark mb-4 bg-white/60 p-3 rounded-lg shadow-sm">
                      {category.name}
                    </h3>
                    <p className="text-brown-dark text-sm leading-relaxed mb-6 font-bookmania bg-white/70 p-4 rounded-lg shadow-sm">
                      {category.description}
                    </p>

                    {/* Subcategories */}
                    <div className="bg-gray-100/80 p-4 rounded-lg shadow-sm">
                      <div className="text-brown-dark text-sm font-bookmania font-medium mb-3">Alt Kategoriler:</div>
                      <div className="space-y-2">
                        {category.subcategories.map((sub, idx) => (
                          <div key={idx} className="flex items-center text-brown-dark text-sm font-bookmania bg-white/70 p-2 rounded shadow-sm">
                            <div className="w-2 h-2 bg-teal-400 rounded-full mr-3" />
                            {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-300/50 bg-white/70 p-3 rounded-lg shadow-sm">
                    <span className="text-brown-dark text-sm font-bookmania font-medium">Detayları Görüntüle</span>
                    <ChevronRightIcon className="w-5 h-5 text-brown-light" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tüm Eserler Butonu */}
        <div className="mt-16 text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center px-8 py-4 bg-gradient-teal text-white font-bookmania font-medium rounded-xl shadow-lg border-2 border-teal-light/30 backdrop-blur-sm"
          >
            <DocumentTextIcon className="w-5 h-5 mr-3" />
            Tüm Eserleri Görüntüle
            <ChevronRightIcon className="w-5 h-5 ml-3" />
          </button>
        </div>

        {/* Son Eklenenler Önizlemesi */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="heading-seljuk text-3xl font-bold text-brown-dark mb-4 drop-shadow-lg">
              Son Eklenen Eserler
            </h2>
            <p className="text-brown-light font-bookmania">En güncel çalışmalar ve yayınlar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Modern Eğitim Yaklaşımları",
                category: "Basılı Yayınlar",
                date: "2024",
                type: "Makale",
                color: "teal"
              },
              {
                title: "Dijital Dönüşüm Podcast Serisi",
                category: "Görsel-İşitsel",
                date: "2024",
                type: "Podcast",
                color: "burgundy"
              },
              {
                title: "Sosyal Medya ve Toplum",
                category: "Sosyal Yayınlar",
                date: "2024",
                type: "Blog Serisi",
                color: "brown"
              }
            ].map((item, idx) => (
              <div key={idx} className="card-seljuk cursor-pointer">
                <div className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded-lg">
                  <span className={`px-3 py-1 bg-${item.color}-light/30 text-${item.color}-dark text-sm font-bookmania font-medium rounded-full`}>
                    {item.type}
                  </span>
                  <span className="text-brown-dark text-sm font-bookmania font-medium bg-white px-2 py-1 rounded">{item.date}</span>
                </div>
                <h3 className="text-brown-dark font-bookmania font-medium mb-3 text-lg bg-gray-50 p-3 rounded-lg">
                  {item.title}
                </h3>
                <p className="text-brown-light text-sm font-bookmania bg-gray-100/50 p-2 rounded">{item.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
