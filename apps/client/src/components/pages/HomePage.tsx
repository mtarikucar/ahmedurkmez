'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategorySection from '@/components/ui/CategorySection';
import ImageSlider from '@/components/ui/ImageSlider';
import { AcademicCapIcon, BookOpenIcon, VideoCameraIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

// CSS Animation classes will be used instead of Framer Motion for now

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedWorkCategory, setSelectedWorkCategory] = useState<string>('all');
  const [expandedWorkCard, setExpandedWorkCard] = useState<number | null>(null);
  const router = useRouter();

  // Resume categories data for left section - simplified
  const [resumeCategories] = useState([
    {
      id: 1,
      name: 'Eğitim Hayatı',
      description: 'Akademik eğitim sürecim ve aldığım derecelerin detayları',
      shortDescription: 'Lisans, yüksek lisans ve doktora eğitim sürecim hakkında detaylı bilgiler.',
      color: '#3B82F6',
      icon: AcademicCapIcon,
      route: '/resume/education'
    },
    {
      id: 2,
      name: 'Akademik Kariyer',
      description: 'Öğretim üyeliği ve araştırma deneyimlerim',
      shortDescription: 'Araştırma görevliliğinden profesörlüğe kadar olan akademik kariyerim.',
      color: '#10B981',
      icon: BookOpenIcon,
      route: '/resume/career'
    },
    {
      id: 3,
      name: 'Ödüller ve Başarılar',
      description: 'Aldığım ödüller ve akademik başarılarım',
      shortDescription: 'Ulusal ve uluslararası düzeyde aldığım ödüller ve akademik başarılarım.',
      color: '#F59E0B',
      icon: VideoCameraIcon,
      route: '/resume/awards'
    }
  ]);
  const [sliderImages] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Akademik Araştırmalar',
      description: 'Edebiyat ve kültür alanındaki çalışmalarım'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Yayınlarım',
      description: 'Kitaplar, makaleler ve bildiriler'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      title: 'Öğretmenlik Deneyimim',
      description: 'Eğitim hayatımdan kareler'
    }
  ]);



  const [worksCategories] = useState([
    {
      id: 10,
      name: 'Basılı Yayınlar',
      description: 'Kitaplar, makaleler ve bildiriler',
      color: '#F59E0B',
      articles: [],
      children: [
        {
          id: 11,
          name: 'Kitaplarım',
          description: 'Yayınlanmış kitap çalışmalarım',
          color: '#F59E0B',
          articles: [
            {
              id: 10,
              title: 'Modern Türk Edebiyatı Üzerine',
              excerpt: 'Türk edebiyatının modern dönem analizi...',
              slug: 'modern-turk-edebiyati-uzerine',
              createdAt: '2023-06-01',
              category: { name: 'Kitap', color: '#F59E0B' },
              viewCount: 300,
              likeCount: 45
            },
            {
              id: 11,
              title: 'Kültürel Değişim ve Edebiyat',
              excerpt: 'Toplumsal değişimin edebiyata yansıması...',
              slug: 'kulturel-degisim-ve-edebiyat',
              createdAt: '2023-06-15',
              category: { name: 'Kitap', color: '#F59E0B' },
              viewCount: 250,
              likeCount: 38
            },
            {
              id: 12,
              title: 'Şiir ve Anlam Dünyası',
              excerpt: 'Şiirin semantik yapısı üzerine incelemeler...',
              slug: 'siir-ve-anlam-dunyasi',
              createdAt: '2023-07-01',
              category: { name: 'Kitap', color: '#F59E0B' },
              viewCount: 280,
              likeCount: 42
            }
          ],
          children: []
        },
        {
          id: 12,
          name: 'Makalelerim',
          description: 'Akademik dergilerde yayınlanan makaleler',
          color: '#EF4444',
          articles: [
            {
              id: 13,
              title: 'Postmodern Edebiyatta Kimlik Sorunu',
              excerpt: 'Postmodern dönemde kimlik arayışı...',
              slug: 'postmodern-edebiyatta-kimlik-sorunu',
              createdAt: '2023-07-10',
              category: { name: 'Makale', color: '#EF4444' },
              viewCount: 220,
              likeCount: 35
            },
            {
              id: 14,
              title: 'Dijital Çağda Okuma Kültürü',
              excerpt: 'Teknolojinin okuma alışkanlıklarına etkisi...',
              slug: 'dijital-cagda-okuma-kulturu',
              createdAt: '2023-07-20',
              category: { name: 'Makale', color: '#EF4444' },
              viewCount: 190,
              likeCount: 28
            },
            {
              id: 15,
              title: 'Çeviri Kuramları ve Uygulamaları',
              excerpt: 'Çeviri biliminin teorik temelleri...',
              slug: 'ceviri-kuramlari-ve-uygulamalari',
              createdAt: '2023-08-01',
              category: { name: 'Makale', color: '#EF4444' },
              viewCount: 240,
              likeCount: 40
            }
          ],
          children: []
        },
        {
          id: 13,
          name: 'Bildirilerim',
          description: 'Konferans ve sempozyum bildirileri',
          color: '#06B6D4',
          articles: [
            {
              id: 16,
              title: 'Edebiyat Öğretiminde Yeni Yaklaşımlar',
              excerpt: 'Modern eğitim teknikleri ile edebiyat öğretimi...',
              slug: 'edebiyat-ogretiminde-yeni-yaklasimlar',
              createdAt: '2023-08-10',
              category: { name: 'Bildiri', color: '#06B6D4' },
              viewCount: 160,
              likeCount: 25
            },
            {
              id: 17,
              title: 'Kültürlerarası İletişimde Dilin Rolü',
              excerpt: 'Farklı kültürler arası iletişimde dil faktörü...',
              slug: 'kulturlerarasi-iletisimde-dilin-rolu',
              createdAt: '2023-08-20',
              category: { name: 'Bildiri', color: '#06B6D4' },
              viewCount: 180,
              likeCount: 30
            },
            {
              id: 18,
              title: 'Medya ve Edebiyat İlişkisi',
              excerpt: 'Kitle iletişim araçlarının edebiyata etkisi...',
              slug: 'medya-ve-edebiyat-iliskisi',
              createdAt: '2023-09-01',
              category: { name: 'Bildiri', color: '#06B6D4' },
              viewCount: 200,
              likeCount: 33
            }
          ],
          children: []
        }
      ]
    },
    {
      id: 14,
      name: 'Sesli Görüntülü Yayınlar',
      description: 'Video içerikler ve ses kayıtları',
      color: '#EC4899',
      articles: [
        {
          id: 19,
          title: 'Edebiyat Sohbetleri Podcast Serisi',
          excerpt: 'Haftalık edebiyat konuşmaları...',
          slug: 'edebiyat-sohbetleri-podcast-serisi',
          createdAt: '2023-09-10',
          category: { name: 'Podcast', color: '#EC4899' },
          viewCount: 350,
          likeCount: 55
        },
        {
          id: 20,
          title: 'Üniversite Derslerinden Kesitler',
          excerpt: 'Sınıfta işlenen konulardan örnekler...',
          slug: 'universite-derslerinden-kesitler',
          createdAt: '2023-09-20',
          category: { name: 'Video', color: '#EC4899' },
          viewCount: 280,
          likeCount: 42
        },
        {
          id: 21,
          title: 'Kitap Tanıtım Videoları',
          excerpt: 'Yeni çıkan kitapların tanıtımları...',
          slug: 'kitap-tanitim-videolari',
          createdAt: '2023-10-01',
          category: { name: 'Video', color: '#EC4899' },
          viewCount: 320,
          likeCount: 48
        }
      ],
      children: []
    },
    {
      id: 15,
      name: 'Sosyal Sanatsal Yayınlar',
      description: 'Kültürel ve sanatsal içerikler',
      color: '#84CC16',
      articles: [
        {
          id: 22,
          title: 'Şiir Dinletileri',
          excerpt: 'Canlı şiir okuma etkinlikleri...',
          slug: 'siir-dinletileri',
          createdAt: '2023-10-10',
          category: { name: 'Sanat', color: '#84CC16' },
          viewCount: 180,
          likeCount: 28
        },
        {
          id: 23,
          title: 'Kültür Sanat Yazıları',
          excerpt: 'Güncel sanat olayları üzerine değerlendirmeler...',
          slug: 'kultur-sanat-yazilari',
          createdAt: '2023-10-20',
          category: { name: 'Sanat', color: '#84CC16' },
          viewCount: 160,
          likeCount: 25
        },
        {
          id: 24,
          title: 'Edebiyat Festivali Gözlemleri',
          excerpt: 'Katıldığım festival ve etkinliklerden notlar...',
          slug: 'edebiyat-festivali-gozlemleri',
          createdAt: '2023-11-01',
          category: { name: 'Sanat', color: '#84CC16' },
          viewCount: 200,
          likeCount: 32
        }
      ],
      children: []
    }
  ]);

  // Function to handle card click
  const handleCardClick = (cardId: number, route: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
    }
  };

  // Function to handle work card toggle
  const handleWorkCardToggle = (cardId: number) => {
    if (expandedWorkCard === cardId) {
      setExpandedWorkCard(null);
    } else {
      setExpandedWorkCard(cardId);
    }
  };

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] animate-fade-in">
        <div className="text-center font-bookmania animate-slide-up">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-medium mx-auto mb-4"></div>
          <p className="text-brown-dark text-lg">Sayfa yükleniyor...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-teal-light rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-burgundy-light rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-brown-light rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] animate-fade-in">
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

      {/* 15 Column Grid Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-15 gap-6 p-6 max-w-[1920px] mx-auto min-h-screen">

        {/* Left Section - Resume (5 columns) */}
        <div className="lg:col-span-5 rounded-xl shadow-lg p-6 h-fit bg-gradient-brown border-2 border-brown-light/30 backdrop-blur-sm">
          <div className="sticky top-4">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-8 w-8  text-white mr-3 drop-shadow-lg" />
              <h2 className=" text-2xl text-white drop-shadow-lg">Özgeçmiş</h2>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {resumeCategories.map((category, index) => (
                <div key={category.id}>
                  {/* Card Header */}
                  <div 
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 cursor-pointer transition-colors duration-200 hover:bg-white/30"
                    onClick={() => handleCardClick(category.id, category.route)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <category.icon 
                          className="h-6 w-6 text-white" 
                          style={{ color: category.color }}
                        />
                        <h3 className="text-white font-bookmania font-semibold text-lg">
                          {category.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(category.route);
                          }}
                          className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-all duration-200"
                        >
                          İncele
                        </button>
                        {expandedCard === category.id ? (
                          <ChevronUpIcon className="h-5 w-5 text-white" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {expandedCard === category.id && (
                    <div className="mt-2 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                      <p className="text-gray-800 font-medium text-sm leading-relaxed">
                        {category.shortDescription}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleNavigate(category.route)}
                          className="text-sm bg-teal-dark hover:bg-teal-medium text-white px-4 py-2 rounded-full transition-colors duration-200"
                        >
                          Detayları Gör →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Section - Slider and Title (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title Section */}
          <div className="bg-gradient-burgundy rounded-xl shadow-lg p-8 text-center text-white border-2 border-burgundy-light/30">
            <h1 className=" text-4xl lg:text-5xl mb-4 text-white drop-shadow-2xl">
              Prof. Dr. Ahmed Ürkmez
            </h1>
            <p className="text-lg opacity-90 font-bookmania mb-2 drop-shadow-lg">
              Edebiyat ve Kültür Araştırmaları Uzmanı
            </p>
            <p className="text-sm opacity-75 font-bookmania italic drop-shadow-md">
              Modern Selçuklu Sanatı Esinlenmesi
            </p>
            <div className="mt-6 flex justify-center space-x-4 flex-wrap gap-y-2">
              {['Akademisyen', 'Yazar', 'Araştırmacı'].map((role, index) => (
                <div
                  key={role}
                  className="bg-white/20 rounded-full px-6 py-3 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors duration-200"
                >
                  <span className="text-base font-medium font-bookmania">{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Slider */}
          <div className="rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border-2 border-teal-light/30">
            <ImageSlider
              images={sliderImages}
              autoPlay={true}
              interval={4000}
              showDots={true}
              showArrows={true}
              className="h-96"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: BookOpenIcon, count: '25+', label: 'Yayın', color: 'text-teal-dark', bg: 'hover:bg-teal-light/20' },
              { icon: AcademicCapIcon, count: '15+', label: 'Yıl Deneyim', color: 'text-burgundy-medium', bg: 'hover:bg-burgundy-light/20' },
              { icon: VideoCameraIcon, count: '50+', label: 'Video İçerik', color: 'text-brown-dark', bg: 'hover:bg-brown-light/20' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`card-seljuk text-center group ${stat.bg} transition-colors duration-200`}
              >
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bookmania-bold text-brown-dark">{stat.count}</div>
                <div className="text-sm font-bookmania text-brown-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Works (5 columns) */}
        <div className="lg:col-span-5 rounded-xl shadow-lg p-6 h-fit bg-gradient-teal border-2 border-teal-light/30 backdrop-blur-sm">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BookOpenIcon className="h-8 w-8 text-white mr-3 drop-shadow-lg" />
                <h2 className=" text-2xl text-white drop-shadow-lg">Eserler</h2>
              </div>
              <div className="text-white/80 text-sm">
                {worksCategories.reduce((total, cat) => 
                  total + (cat.children ? 
                    cat.children.reduce((childTotal, child) => childTotal + child.articles.length, 0) + cat.articles.length :
                    cat.articles.length
                  ), 0
                )} toplam eser
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedWorkCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                    selectedWorkCategory === 'all' 
                      ? 'bg-white text-teal-dark shadow-sm' 
                      : 'bg-white/25 text-white hover:bg-white/35 drop-shadow-sm'
                  }`}
                >
                  Tümü
                </button>
                {worksCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedWorkCategory(category.id.toString())}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      selectedWorkCategory === category.id.toString() 
                        ? 'bg-white text-teal-dark shadow-sm' 
                        : 'bg-white/25 text-white hover:bg-white/35 drop-shadow-sm'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {worksCategories
                .filter(category => selectedWorkCategory === 'all' || selectedWorkCategory === category.id.toString())
                .map((category, index) => (
                <div key={category.id} className="bg-white/20 backdrop-blur-sm border border-white/5 rounded-lg p-4 transition-colors duration-200">
                  {/* Category Header */}
                  <div 
                    className="flex items-center justify-between mb-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 -m-2 transition-colors duration-200"
                    onClick={() => handleWorkCardToggle(category.id)}
                  >
                    <h3 className="text-white font-bookmania font-semibold text-lg drop-shadow-sm">
                      {category.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-white/25 text-white font-medium px-2 py-1 rounded-full drop-shadow-sm">
                        {category.children ? 
                          category.children.reduce((total, child) => total + child.articles.length, 0) + category.articles.length :
                          category.articles.length
                        } eser
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/articles');
                        }}
                        className="text-xs bg-white/25 hover:bg-white/35 text-white font-medium px-2 py-1 rounded-full transition-colors duration-200 drop-shadow-sm"
                      >
                        Detay
                      </button>
                      {expandedWorkCard === category.id ? (
                        <ChevronUpIcon className="h-5 w-5 text-white" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  
                  {/* Collapsible Content */}
                  {expandedWorkCard === category.id && (
                    <div className="space-y-4 animate-fade-in">
                      <p className="text-white text-sm leading-relaxed bg-gray-800/60 p-3 rounded-lg border border-gray-600/40">
                        {category.description}
                      </p>

                      {/* Sub-categories or Stats */}
                      {category.children && category.children.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {category.children.map((child) => (
                            <div key={child.id} className="bg-gray-700/90 backdrop-blur-sm border border-gray-500/50 rounded-lg p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-white font-bookmania text-sm font-medium mb-1">
                                    {child.name}
                                  </h4>
                                  <p className="text-gray-200 text-xs bg-gray-600/60 p-2 rounded">
                                    {child.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="text-white font-bookmania-bold text-lg bg-teal-600 px-2 py-1 rounded">
                                    {child.articles.length}
                                  </div>
                                  <div className="text-gray-300 text-xs mt-1">eser</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-700/90 backdrop-blur-sm border border-gray-500/50 rounded-lg p-3 text-center">
                            <div className="text-white font-bookmania-bold text-lg">
                              {category.articles.length}
                            </div>
                            <div className="text-gray-200 text-xs">Toplam Eser</div>
                          </div>
                          <div className="bg-gray-700/90 backdrop-blur-sm border border-gray-500/50 rounded-lg p-3 text-center">
                            <div className="text-white font-bookmania-bold text-lg">
                              {category.articles.reduce((total, article) => total + article.viewCount, 0)}
                            </div>
                            <div className="text-gray-200 text-xs">Görüntülenme</div>
                          </div>
                        </div>
                      )}

                      {/* Popular Articles Preview */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-800/70 p-2 rounded-lg">
                          <h4 className="text-white font-bookmania text-sm font-medium">En Popüler Eserler</h4>
                          <span className="text-gray-300 text-xs bg-gray-700 px-2 py-1 rounded">Son 3</span>
                        </div>
                        {(category.children && category.children.length > 0 ? 
                          category.children.flatMap(child => child.articles) : 
                          category.articles
                        )
                          .sort((a, b) => b.viewCount - a.viewCount)
                          .slice(0, 3)
                          .map((article, idx) => (
                            <div key={article.id} className="bg-gray-600/90 backdrop-blur-sm border border-gray-400/50 rounded-lg p-3 hover:bg-gray-500/90 transition-colors duration-200 cursor-pointer group">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0 mr-3">
                                  <div className="flex items-center mb-2">
                                    <span className="text-teal-300 text-xs mr-2 font-bold bg-gray-700 px-2 py-1 rounded">#{idx + 1}</span>
                                    <h5 className="text-white text-sm font-bookmania font-medium">
                                      {article.title}
                                    </h5>
                                  </div>
                                  <p className="text-gray-100 text-xs leading-relaxed line-clamp-2 bg-gray-700/70 p-2 rounded mb-2">
                                    {article.excerpt}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-gray-200 text-xs bg-gray-700/80 px-2 py-1 rounded">
                                      📅 {new Date(article.createdAt).getFullYear()}
                                    </span>
                                    <span className="text-gray-200 text-xs bg-gray-700/80 px-2 py-1 rounded">
                                      📂 {article.category.name}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0 space-y-1">
                                  <div className="text-white text-xs font-medium bg-teal-600 px-2 py-1 rounded">
                                    👁 {article.viewCount.toLocaleString()}
                                  </div>
                                  <div className="text-gray-200 text-xs bg-gray-700 px-2 py-1 rounded">
                                    ❤ {article.likeCount}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Quick Actions */}
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 mt-4">
                <h3 className="text-white font-bookmania font-semibold text-lg mb-3 drop-shadow-sm">Hızlı Erişim</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => router.push('/articles')}
                    className="bg-white/25 hover:bg-white/35 text-white text-sm font-bookmania font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center drop-shadow-sm"
                  >
                    📚 Tüm Eserler
                  </button>
                  <button 
                    onClick={() => router.push('/articles?filter=recent')}
                    className="bg-white/25 hover:bg-white/35 text-white text-sm font-bookmania font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center drop-shadow-sm"
                  >
                    🆕 Son Eklenenler
                  </button>
                  <button 
                    onClick={() => router.push('/articles?filter=popular')}
                    className="bg-white/25 hover:bg-white/35 text-white text-sm font-bookmania font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center drop-shadow-sm"
                  >
                    🔥 En Popülerler
                  </button>
                  <button 
                    onClick={() => router.push('/categories')}
                    className="bg-white/25 hover:bg-white/35 text-white text-sm font-bookmania font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center drop-shadow-sm"
                  >
                    🗂 Kategoriler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
