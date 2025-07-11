'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, BookOpenIcon, DocumentTextIcon, AcademicCapIcon, NewspaperIcon } from '@heroicons/react/24/outline';

const PrintedPublicationsPage = () => {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const subcategories = [
    { id: 'all', name: 'Tümü', count: 127 },
    { id: 'books', name: 'Kitaplar', count: 45, icon: BookOpenIcon },
    { id: 'articles', name: 'Makaleler', count: 38, icon: DocumentTextIcon },
    { id: 'research', name: 'Araştırmalar', count: 25, icon: AcademicCapIcon },
    { id: 'academic', name: 'Akademik Yayınlar', count: 19, icon: NewspaperIcon }
  ];

  const publications = [
    {
      id: 1,
      title: "Modern Eğitim Yaklaşımları ve Teknoloji Entegrasyonu",
      type: "Kitap",
      category: "books",
      year: "2024",
      publisher: "Eğitim Yayınları",
      pages: 324,
      isbn: "978-605-123-456-7",
      description: "21. yüzyıl eğitim paradigmalarında teknolojinin rolü ve uygulamalı örnekler.",
      viewCount: 1250,
      downloadCount: 432,
      featured: true
    },
    {
      id: 2,
      title: "Dijital Okuryazarlık ve Medya Pedagojisi",
      type: "Makale",
      category: "articles",
      year: "2024",
      journal: "Eğitim ve Bilim Dergisi",
      pages: 25,
      doi: "10.15390/EB.2024.11234",
      description: "Dijital çağda okuryazarlık kavramının gelişimi ve eğitimdeki yansımaları.",
      viewCount: 890,
      citationCount: 12,
      featured: true
    },
    {
      id: 3,
      title: "Uzaktan Eğitimde Öğrenci Motivasyonu Araştırması",
      type: "Araştırma",
      category: "research",
      year: "2023",
      institution: "Üniversite Araştırma Merkezi",
      duration: "12 ay",
      sampleSize: 1500,
      description: "Pandemi sonrası uzaktan eğitim süreçlerinde öğrenci motivasyon faktörleri.",
      viewCount: 750,
      participantCount: 1500,
      featured: false
    },
    {
      id: 4,
      title: "Öğretmen Yetiştirme Programlarında Yenilikçi Yaklaşımlar",
      type: "Akademik Yayın",
      category: "academic",
      year: "2023",
      conference: "Uluslararası Eğitim Kongresi",
      location: "İstanbul",
      presentation: "Sözlü Sunum",
      description: "Öğretmen adaylarının 21. yüzyıl becerilerle donatılması için yeni modeller.",
      viewCount: 620,
      attendeeCount: 300,
      featured: false
    }
  ];

  const filteredPublications = selectedSubcategory === 'all' 
    ? publications 
    : publications.filter(pub => pub.category === selectedSubcategory);

  const getTypeColor = (type: string) => {
    const colors = {
      'Kitap': 'brown',
      'Makale': 'teal',
      'Araştırma': 'burgundy',
      'Akademik Yayın': 'amber'
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
              className="bg-brown-light rounded-full w-2 h-2 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-brown-dark/30 via-amber-700/20 to-orange-600/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-brown-dark hover:text-brown-light transition-colors mb-8 font-bookmania"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Geri Dön
          </button>

          <div className="flex items-center mb-6">
            <div className="p-4 bg-gradient-brown rounded-xl mr-6 border-2 border-brown-light/30 shadow-lg">
              <BookOpenIcon className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="heading-seljuk-large text-4xl font-bold text-brown-dark mb-3 drop-shadow-lg">
                Basılı Yayınlar
              </h1>
              <p className="text-xl text-brown-light max-w-3xl font-bookmania">
                Kitaplar, makaleler, araştırmalar ve akademik yayınların kapsamlı koleksiyonu
              </p>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="card-seljuk text-center hover:bg-brown-light/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-brown-dark mb-1">127</div>
              <div className="text-brown-light text-sm font-bookmania">Toplam Yayın</div>
            </div>
            <div className="card-seljuk text-center hover:bg-amber-600/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-amber-600 mb-1">45K</div>
              <div className="text-brown-light text-sm font-bookmania">Toplam Görüntüleme</div>
            </div>
            <div className="card-seljuk text-center hover:bg-teal-light/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-teal-dark mb-1">1.2K</div>
              <div className="text-brown-light text-sm font-bookmania">İndirme</div>
            </div>
            <div className="card-seljuk text-center hover:bg-burgundy-light/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-burgundy-medium mb-1">234</div>
              <div className="text-brown-light text-sm font-bookmania">Atıf</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Alt Kategori Filtreleri */}
        <div className="mb-12">
          <div className="card-seljuk">
            <h3 className="text-brown-dark font-bookmania font-medium mb-4">Alt Kategoriler</h3>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((sub) => {
                const IconComponent = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`flex items-center px-4 py-3 rounded-lg font-bookmania ${
                      selectedSubcategory === sub.id
                        ? 'bg-gradient-brown text-white shadow-lg border-2 border-brown-light/30'
                        : 'bg-brown-light/10 text-brown-dark border border-brown-light/20'
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

        {/* Yayın Listesi */}
        <div className="space-y-8">
          {filteredPublications.map((publication) => (
            <div
              key={publication.id}
              className={`bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 shadow-lg ${
                publication.featured ? 'ring-2 ring-teal-500/50' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Sol Taraf - Ana Bilgiler */}
                <div className="flex-1">
                  <div className="flex items-center mb-4 bg-gray-100/80 p-3 rounded-lg">
                    {publication.featured && (
                      <span className="px-3 py-1 bg-teal-600 text-white text-sm font-medium rounded-full mr-3">
                        Öne Çıkan
                      </span>
                    )}
                    <span className={`px-3 py-1 bg-${getTypeColor(publication.type)}-600 text-white text-sm font-medium rounded-full`}>
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
                    {publication.publisher && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2 text-brown-dark">Yayınevi:</span>
                        <span>{publication.publisher}</span>
                      </div>
                    )}
                    {publication.journal && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2 text-brown-dark">Dergi:</span>
                        <span>{publication.journal}</span>
                      </div>
                    )}
                    {publication.institution && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2 text-brown-dark">Kurum:</span>
                        <span>{publication.institution}</span>
                      </div>
                    )}
                    {publication.conference && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2 text-brown-dark">Konferans:</span>
                        <span>{publication.conference}</span>
                      </div>
                    )}
                    {publication.pages && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2 text-brown-dark">Sayfa:</span>
                        <span>{publication.pages}</span>
                      </div>
                    )}
                    {publication.isbn && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2 text-brown-dark">ISBN:</span>
                        <span>{publication.isbn}</span>
                      </div>
                    )}
                    {publication.doi && (
                      <div className="flex items-center text-brown-light bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2">DOI:</span>
                        <span>{publication.doi}</span>
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
                        <span>Görüntülenme:</span>
                        <span className="text-blue-600 font-medium">{publication.viewCount.toLocaleString()}</span>
                      </div>
                      {publication.downloadCount && (
                        <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                          <span>İndirme:</span>
                          <span className="text-emerald-600 font-medium">{publication.downloadCount}</span>
                        </div>
                      )}
                      {publication.citationCount && (
                        <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                          <span>Atıf:</span>
                          <span className="text-purple-600 font-medium">{publication.citationCount}</span>
                        </div>
                      )}
                      {publication.participantCount && (
                        <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                          <span>Katılımcı:</span>
                          <span className="text-amber-600 font-medium">{publication.participantCount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm">
                      Detayları Görüntüle
                    </button>
                    <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm">
                      PDF İndir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sayfalama */}
        <div className="mt-12 flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-brown-dark'
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

export default PrintedPublicationsPage;
