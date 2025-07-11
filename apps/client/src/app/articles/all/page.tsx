'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, MagnifyingGlassIcon, FunnelIcon, BookOpenIcon, FilmIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

const AllArticlesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: 'Tümü', icon: null },
    { id: 'printed', name: 'Basılı Yayınlar', icon: BookOpenIcon },
    { id: 'audiovisual', name: 'Görsel-İşitsel', icon: FilmIcon },
    { id: 'social', name: 'Sosyal & Sanatsal', icon: PaintBrushIcon }
  ];

  const years = ['2024', '2023', '2022', '2021', '2020'];
  
  const allArticles = [
    // Basılı Yayınlar
    {
      id: 1,
      title: "Modern Eğitim Yaklaşımları ve Teknoloji Entegrasyonu",
      category: "printed",
      categoryName: "Basılı Yayınlar",
      type: "Kitap",
      year: "2024",
      description: "21. yüzyıl eğitim paradigmalarında teknolojinin rolü ve uygulamalı örnekler.",
      viewCount: 1250,
      featured: true,
      color: "blue"
    },
    {
      id: 2,
      title: "Dijital Okuryazarlık ve Medya Pedagojisi",
      category: "printed",
      categoryName: "Basılı Yayınlar",
      type: "Makale",
      year: "2024",
      description: "Dijital çağda okuryazarlık kavramının gelişimi ve eğitimdeki yansımaları.",
      viewCount: 890,
      featured: true,
      color: "blue"
    },
    // Görsel-İşitsel
    {
      id: 3,
      title: "Dijital Dönüşüm Podcast Serisi",
      category: "audiovisual",
      categoryName: "Görsel-İşitsel",
      type: "Podcast",
      year: "2024",
      description: "Dijital çağda eğitimin geleceği üzerine uzmanlarla yapılan derinlemesine sohbetler.",
      viewCount: 15420,
      featured: true,
      color: "purple"
    },
    {
      id: 4,
      title: "Modern Eğitim Yaklaşımları Belgeseli",
      category: "audiovisual",
      categoryName: "Görsel-İşitsel",
      type: "Video",
      year: "2024",
      description: "21. yüzyıl eğitim metodlarının uygulandığı okulları ziyaret eden belgesel serisi.",
      viewCount: 8750,
      featured: true,
      color: "purple"
    },
    // Sosyal & Sanatsal
    {
      id: 5,
      title: "Eğitimde Sosyal Medya Kullanımı Blog Serisi",
      category: "social",
      categoryName: "Sosyal & Sanatsal",
      type: "Blog",
      year: "2024",
      description: "Sosyal medya platformlarının eğitimde etkin kullanımı üzerine pratik öneriler.",
      viewCount: 28500,
      featured: true,
      color: "emerald"
    },
    {
      id: 6,
      title: "Instagram Eğitim İçerikleri",
      category: "social",
      categoryName: "Sosyal & Sanatsal",
      type: "Sosyal Medya",
      year: "2024",
      description: "Eğitim konularında farkındalık yaratmak için hazırlanan görsel içerikler.",
      viewCount: 125000,
      featured: true,
      color: "emerald"
    },
    // 2023 İçerikleri
    {
      id: 7,
      title: "Uzaktan Eğitimde Öğrenci Motivasyonu Araştırması",
      category: "printed",
      categoryName: "Basılı Yayınlar",
      type: "Araştırma",
      year: "2023",
      description: "Pandemi sonrası uzaktan eğitim süreçlerinde öğrenci motivasyon faktörleri.",
      viewCount: 750,
      featured: false,
      color: "brown"
    },
    {
      id: 8,
      title: "Eğitim Gündemi - TV Programı",
      category: "audiovisual",
      categoryName: "Görsel-İşitsel",
      type: "TV Programı",
      year: "2023",
      description: "Eğitim dünyasından güncel gelişmelerin ele alındığı haftalık program.",
      viewCount: 125000,
      featured: false,
      color: "burgundy"
    }
  ];

  const filteredArticles = allArticles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesYear = selectedYear === 'all' || article.year === selectedYear;
      
      return matchesSearch && matchesCategory && matchesYear;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return parseInt(b.year) - parseInt(a.year);
        case 'oldest':
          return parseInt(a.year) - parseInt(b.year);
        case 'mostViewed':
          return b.viewCount - a.viewCount;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

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

      {/* Header */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-dark/20 via-burgundy-dark/20 to-brown-dark/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-brown-dark mb-8 font-bookmania"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Geri Dön
          </button>

          <div className="text-center mb-12">
            <h1 className="heading-seljuk-large text-5xl font-bold text-brown-dark mb-6 drop-shadow-2xl">
              Tüm Eserler
            </h1>
            <p className="text-xl text-brown-light max-w-3xl mx-auto leading-relaxed font-bookmania">
              Yıllar içinde üretilmiş tüm akademik çalışmalar, sanatsal projeler ve yayınların 
              kapsamlı arşivi. Arama ve filtreleme seçenekleriyle istediğiniz içeriği kolayca bulun.
            </p>
          </div>

          {/* Arama ve Filtreler */}
          <div className="card-seljuk mb-12">
            {/* Arama Çubuğu */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brown-light" />
              <input
                type="text"
                placeholder="Eser başlığı veya açıklama arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-brown-light/10 border border-brown-light/20 rounded-xl text-brown-dark placeholder-brown-light focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-transparent font-bookmania"
              />
            </div>

            {/* Filtreler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Kategori */}
              <div>
                <label className="block text-brown-dark text-sm font-medium mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg text-brown-dark focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Yıl */}
              <div>
                <label className="block text-brown-dark text-sm font-medium mb-2">Yıl</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg text-brown-dark focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="all">Tüm Yıllar</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-brown-dark text-sm font-medium mb-2">Sıralama</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg text-brown-dark focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="mostViewed">En Çok Görüntülenen</option>
                  <option value="alphabetical">Alfabetik</option>
                </select>
              </div>

              {/* Sonuç Sayısı */}
              <div className="flex items-end">
                <div className="bg-white/80 rounded-lg p-3 w-full text-center shadow-sm">
                  <div className="text-2xl font-bold text-brown-dark">{filteredArticles.length}</div>
                  <div className="text-brown-light text-sm">Sonuç</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İçerik Listesi */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-800/50 rounded-2xl p-12 max-w-md mx-auto">
              <FunnelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sonuç Bulunamadı</h3>
              <p className="text-gray-400">
                Arama kriterlerinize uygun eser bulunamadı. Lütfen farklı filtreler deneyin.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 cursor-pointer border border-gray-600/50 ${
                  article.featured ? 'ring-2 ring-blue-500/30' : ''
                }`}
                onClick={() => router.push(`/articles/${article.category}/${article.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  {article.featured && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                      Öne Çıkan
                    </span>
                  )}
                  <div className="flex items-center space-x-2 ml-auto">
                    <span className={`px-3 py-1 bg-${article.color}-500/20 text-${article.color}-400 text-xs font-medium rounded-full`}>
                      {article.type}
                    </span>
                    <span className="text-gray-400 text-xs">{article.year}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bookmania font-bold text-white mb-3 line-clamp-2 bg-gray-700/50 p-3 rounded-lg">
                  {article.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>{article.categoryName}</span>
                    <span>👁 {article.viewCount.toLocaleString()}</span>
                  </div>
                  <button className="text-teal-400 text-sm font-medium bg-gray-700 px-3 py-1 rounded">
                    Detaylar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sayfalama (eğer çok fazla sonuç varsa) */}
        {filteredArticles.length > 12 && (
          <div className="mt-16 flex justify-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArticlesPage;
