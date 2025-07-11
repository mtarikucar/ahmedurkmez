'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, FilmIcon, VideoCameraIcon, MicrophoneIcon, TvIcon, RadioIcon } from '@heroicons/react/24/outline';

const AudiovisualPublicationsPage = () => {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const subcategories = [
    { id: 'all', name: 'Tümü', count: 89 },
    { id: 'videos', name: 'Video İçerikler', count: 32, icon: VideoCameraIcon },
    { id: 'podcasts', name: 'Podcast\'ler', count: 28, icon: MicrophoneIcon },
    { id: 'tv', name: 'TV Programları', count: 18, icon: TvIcon },
    { id: 'interviews', name: 'Röportajlar', count: 11, icon: RadioIcon }
  ];

  const publications = [
    {
      id: 1,
      title: "Dijital Dönüşüm Podcast Serisi",
      type: "Podcast",
      category: "podcasts",
      year: "2024",
      episodes: 12,
      duration: "45-60 dk",
      platform: "Spotify, Apple Podcasts, YouTube",
      description: "Dijital çağda eğitimin geleceği üzerine uzmanlarla yapılan derinlemesine sohbetler.",
      viewCount: 15420,
      subscribers: 2850,
      featured: true,
      totalDuration: "11 saat",
      avgRating: 4.8
    },
    {
      id: 2,
      title: "Modern Eğitim Yaklaşımları Belgeseli",
      type: "Video",
      category: "videos",
      year: "2024",
      duration: "28 dk",
      platform: "YouTube, Vimeo",
      format: "4K, HD",
      description: "21. yüzyıl eğitim metodlarının uygulandığı okulları ziyaret eden belgesel serisi.",
      viewCount: 8750,
      likes: 432,
      featured: true,
      language: "Türkçe",
      subtitles: "İngilizce, Almanca"
    },
    {
      id: 3,
      title: "Eğitim Gündemi - Haftalık Program",
      type: "TV Programı",
      category: "tv",
      year: "2023-2024",
      episodes: 48,
      duration: "30 dk",
      channel: "Eğitim TV",
      description: "Eğitim dünyasından güncel gelişmelerin ele alındığı haftalık televizyon programı.",
      viewCount: 125000,
      seasonCount: 2,
      featured: false,
      broadcastTime: "Her Pazar 20:00"
    },
    {
      id: 4,
      title: "Öğretmenlerle Söyleşi",
      type: "Röportaj",
      category: "interviews",
      year: "2023",
      duration: "15-25 dk",
      platform: "Instagram Live, Facebook Live",
      guestCount: 24,
      description: "Deneyimli öğretmenlerle eğitim üzerine samimi söyleşiler.",
      viewCount: 6200,
      totalGuests: 24,
      featured: false,
      liveAudience: 150
    }
  ];

  const filteredPublications = selectedSubcategory === 'all' 
    ? publications 
    : publications.filter(pub => pub.category === selectedSubcategory);

  const getTypeColor = (type: string) => {
    const colors = {
      'Podcast': 'burgundy',
      'Video': 'teal',
      'TV Programı': 'brown',
      'Röportaj': 'amber'
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
              className="bg-burgundy-light rounded-full w-2 h-2 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy-dark/30 via-red-700/20 to-burgundy-medium/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-burgundy-medium mb-8 font-bookmania"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Geri Dön
          </button>

          <div className="flex items-center mb-6">
            <div className="p-4 bg-gradient-burgundy rounded-xl mr-6 border-2 border-burgundy-light/30 shadow-lg">
              <FilmIcon className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="heading-seljuk-large text-4xl font-bold text-brown-dark mb-3 drop-shadow-lg">
                Görsel-İşitsel Yayınlar
              </h1>
              <p className="text-xl text-brown-light max-w-3xl font-bookmania">
                Video içerikler, podcast'ler, televizyon programları ve röportajların koleksiyonu
              </p>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">89</div>
              <div className="text-gray-300 text-sm">Toplam İçerik</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">156K</div>
              <div className="text-gray-300 text-sm">Toplam İzlenme</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">3.2K</div>
              <div className="text-gray-300 text-sm">Abone</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">124</div>
              <div className="text-gray-300 text-sm">Saat İçerik</div>
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
                        ? 'bg-purple-600 text-white shadow-lg'
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
                publication.featured ? 'ring-2 ring-purple-500/30' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Sol Taraf - Ana Bilgiler */}
                <div className="flex-1">
                  <div className="flex items-center mb-4 bg-gray-100/80 p-3 rounded-lg">
                    {publication.featured && (
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full mr-3">
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
                    {publication.duration && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">Süre:</span>
                        <span>{publication.duration}</span>
                      </div>
                    )}
                    {publication.episodes && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">Bölüm:</span>
                        <span>{publication.episodes}</span>
                      </div>
                    )}
                    {publication.channel && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">Kanal:</span>
                        <span>{publication.channel}</span>
                      </div>
                    )}
                    {publication.format && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">Format:</span>
                        <span>{publication.format}</span>
                      </div>
                    )}
                    {publication.language && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">Dil:</span>
                        <span>{publication.language}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sağ Taraf - İstatistikler ve Aksiyonlar */}
                <div className="lg:w-64 space-y-4">
                  <div className="bg-gray-100/80 rounded-lg p-4 shadow-sm">
                    <h4 className="text-brown-dark font-medium mb-3">İstatistikler</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>İzlenme:</span>
                        <span className="text-purple-600 font-medium">{publication.viewCount.toLocaleString()}</span>
                      </div>
                      {publication.subscribers && (
                        <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                          <span>Abone:</span>
                          <span className="text-blue-600 font-medium">{publication.subscribers.toLocaleString()}</span>
                        </div>
                      )}
                      {publication.likes && (
                        <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                          <span>Beğeni:</span>
                          <span className="text-emerald-600 font-medium">{publication.likes}</span>
                        </div>
                      )}
                      {publication.avgRating && (
                        <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                          <span>Puan:</span>
                          <span className="text-amber-600 font-medium">{publication.avgRating}/5</span>
                        </div>
                      )}
                      {publication.totalGuests && (
                        <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                          <span>Konuk:</span>
                          <span className="text-purple-600 font-medium">{publication.totalGuests}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-burgundy-600 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm">
                      İzle / Dinle
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
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === 1
                      ? 'bg-purple-600 text-white'
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

export default AudiovisualPublicationsPage;
