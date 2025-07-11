'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, PaintBrushIcon, DocumentTextIcon, ShareIcon, PhotoIcon, BeakerIcon } from '@heroicons/react/24/outline';

const SocialArtisticPublicationsPage = () => {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const subcategories = [
    { id: 'all', name: 'Tümü', count: 156 },
    { id: 'blogs', name: 'Blog Yazıları', count: 68, icon: DocumentTextIcon },
    { id: 'social', name: 'Sosyal Medya', count: 45, icon: ShareIcon },
    { id: 'artistic', name: 'Sanatsal Projeler', count: 28, icon: PaintBrushIcon },
    { id: 'photography', name: 'Fotoğrafçılık', count: 15, icon: PhotoIcon }
  ];

  const publications = [
    {
      id: 1,
      title: "Eğitimde Sosyal Medya Kullanımı Blog Serisi",
      type: "Blog Yazısı",
      category: "blogs",
      year: "2024",
      postCount: 25,
      platform: "Medium, Kişisel Blog",
      frequency: "Haftalık",
      description: "Sosyal medya platformlarının eğitimde etkin kullanımı üzerine pratik öneriler ve deneyimler.",
      viewCount: 28500,
      comments: 342,
      featured: true,
      avgReadTime: "8 dk",
      totalShares: 1250
    },
    {
      id: 2,
      title: "Instagram Eğitim İçerikleri",
      type: "Sosyal Medya",
      category: "social",
      year: "2024",
      postCount: 120,
      platform: "Instagram",
      followers: 15600,
      description: "Eğitim konularında farkındalık yaratmak için hazırlanan görsel içerikler ve stories.",
      viewCount: 125000,
      likes: 8940,
      featured: true,
      engagement: "7.2%",
      reachRate: "85%"
    },
    {
      id: 3,
      title: "Eğitim Temalı Dijital Sanat Koleksiyonu",
      type: "Sanatsal Proje",
      category: "artistic",
      year: "2023",
      artworkCount: 18,
      medium: "Dijital İllüstrasyon",
      theme: "Gelecek Eğitimi",
      description: "Gelecekteki eğitim sistemlerini konu alan dijital sanat eserleri koleksiyonu.",
      viewCount: 5400,
      downloads: 890,
      featured: false,
      exhibitions: 3,
      awards: 2
    },
    {
      id: 4,
      title: "Kampüs Yaşamı Fotoğraf Projesi",
      type: "Fotoğrafçılık",
      category: "photography",
      year: "2023",
      photoCount: 240,
      theme: "Üniversite Yaşamı",
      equipment: "Canon EOS R5, DJI Mavic",
      description: "Üniversite kampüslerinde öğrenci yaşamını belgeleyen fotoğraf serisi.",
      viewCount: 3200,
      prints: 45,
      featured: false,
      exhibitions: 2,
      technique: "Belgesel Fotoğrafçılık"
    }
  ];

  const filteredPublications = selectedSubcategory === 'all' 
    ? publications 
    : publications.filter(pub => pub.category === selectedSubcategory);

  const getTypeColor = (type: string) => {
    const colors = {
      'Blog Yazısı': 'teal',
      'Sosyal Medya': 'burgundy',
      'Sanatsal Proje': 'brown',
      'Fotoğrafçılık': 'amber'
    };
    return colors[type as keyof typeof colors] || 'gray';
  };

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Decorative Seljuk Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="bg-teal-light rounded-full w-2 h-2 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-dark/30 via-teal-medium/20 to-teal-light/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-teal-dark mb-8 font-bookmania"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Geri Dön
          </button>

          <div className="flex items-center mb-6">
            <div className="p-4 bg-gradient-teal rounded-xl mr-6 border-2 border-teal-light/30 shadow-lg">
              <PaintBrushIcon className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="heading-seljuk-large text-4xl font-bold text-brown-dark mb-3 drop-shadow-lg">
                Sosyal ve Sanatsal Yayınlar
              </h1>
              <p className="text-xl text-brown-light max-w-3xl font-bookmania">
                Blog yazıları, sosyal medya içerikleri, sanatsal projeler ve fotoğraf çalışmaları
              </p>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">156</div>
              <div className="text-gray-300 text-sm">Toplam İçerik</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">162K</div>
              <div className="text-gray-300 text-sm">Toplam Etkileşim</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">15.6K</div>
              <div className="text-gray-300 text-sm">Takipçi</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">7.2%</div>
              <div className="text-gray-300 text-sm">Etkileşim Oranı</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Alt Kategori Filtreleri */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
            <h3 className="text-brown-dark font-medium mb-4">İçerik Türleri</h3>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((sub) => {
                const IconComponent = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      selectedSubcategory === sub.id
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-gray-200 text-brown-dark'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                    <span className="font-medium">{sub.name}</span>
                    <span className="ml-2 text-xs opacity-75">({sub.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* İçerik Listesi */}
        <div className="space-y-8">
          {filteredPublications.map((publication) => (
            <div
              key={publication.id}
              className={`bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 shadow-lg ${
                publication.featured ? 'ring-2 ring-emerald-500/30' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Sol Taraf - Ana Bilgiler */}
                <div className="flex-1">
                  <div className="flex items-center mb-4 bg-gray-100/80 p-3 rounded-lg">
                    {publication.featured && (
                      <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full mr-3">
                        Öne Çıkan
                      </span>
                    )}
                    <span className={`px-3 py-1 bg-${getTypeColor(publication.type)}-600 text-white text-xs font-medium rounded-full`}>
                      {publication.type}
                    </span>
                    <span className="text-brown-dark text-sm ml-4 bg-white px-3 py-1 rounded shadow-sm">{publication.year}</span>
                  </div>

                  <h3 className="text-2xl font-bookmania font-bold text-brown-dark mb-4 bg-white/70 p-4 rounded-lg cursor-pointer shadow-sm">
                    {publication.title}
                  </h3>

                  <p className="text-brown-dark text-sm leading-relaxed mb-6 bg-gray-50/80 p-4 rounded-lg">
                    {publication.description}
                  </p>

                  {/* Detay Bilgileri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-100/60 p-4 rounded-lg">
                    {publication.platform && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">Platform:</span>
                        <span>{publication.platform}</span>
                      </div>
                    )}
                    {publication.frequency && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">Sıklık:</span>
                        <span>{publication.frequency}</span>
                      </div>
                    )}
                    {publication.postCount && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">İçerik Sayısı:</span>
                        <span>{publication.postCount}</span>
                      </div>
                    )}
                    {publication.medium && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">Medyum:</span>
                        <span>{publication.medium}</span>
                      </div>
                    )}
                    {publication.theme && (
                      <div className="flex items-center text-gray-400">
                        <span className="font-medium mr-2">Tema:</span>
                        <span>{publication.theme}</span>
                      </div>
                    )}
                    {publication.technique && (
                      <div className="flex items-center text-gray-400">
                        <span className="font-medium mr-2">Teknik:</span>
                        <span>{publication.technique}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sağ Taraf - İstatistikler ve Aksiyonlar */}
                <div className="lg:w-64 space-y-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">İstatistikler</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-300">
                        <span>Görüntülenme:</span>
                        <span className="text-emerald-400 font-medium">{publication.viewCount.toLocaleString()}</span>
                      </div>
                      {publication.followers && (
                        <div className="flex justify-between text-gray-300">
                          <span>Takipçi:</span>
                          <span className="text-blue-400 font-medium">{publication.followers.toLocaleString()}</span>
                        </div>
                      )}
                      {publication.likes && (
                        <div className="flex justify-between text-gray-300">
                          <span>Beğeni:</span>
                          <span className="text-purple-400 font-medium">{publication.likes.toLocaleString()}</span>
                        </div>
                      )}
                      {publication.comments && (
                        <div className="flex justify-between text-gray-300">
                          <span>Yorum:</span>
                          <span className="text-amber-400 font-medium">{publication.comments}</span>
                        </div>
                      )}
                      {publication.engagement && (
                        <div className="flex justify-between text-gray-300">
                          <span>Etkileşim:</span>
                          <span className="text-emerald-400 font-medium">{publication.engagement}</span>
                        </div>
                      )}
                      {publication.awards && (
                        <div className="flex justify-between text-gray-300">
                          <span>Ödül:</span>
                          <span className="text-amber-400 font-medium">{publication.awards}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                      Görüntüle
                    </button>
                    <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                      Paylaş
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sayfalama */}
        <div className="mt-12 flex justify-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialArtisticPublicationsPage;
