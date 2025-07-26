'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategorySection from '@/components/ui/CategorySection';
import ImageSlider from '@/components/ui/ImageSlider';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  VideoCameraIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  ArrowRightIcon,
  SparklesIcon,
  DocumentTextIcon,
  PlayIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [selectedWorkCategory, setSelectedWorkCategory] = useState<string>('all');
  const [expandedWorkCard, setExpandedWorkCard] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Hero carousel data
  const [heroSlides] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Edebiyat ve Kültür Araştırmaları',
      description: 'Modern Türk edebiyatından klasik eserlere, kültürel analizlerden akademik araştırmalara...',
      ctaText: 'Araştırmalarımı İncele',
      ctaLink: '/articles'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Akademik Yayınlar',
      description: 'Kitaplarım, makalelerim ve bildirilerimle edebiyat dünyasına katkılarım...',
      ctaText: 'Yayınlarımı Gör',
      ctaLink: '/articles?category=publications'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      title: 'Eğitim ve Öğretim',
      description: 'Üniversitedeki derslerimden öğrenci projelerine, eğitim felsefemden örneklere...',
      ctaText: 'Eğitim Anlayışımı Öğren',
      ctaLink: '/resume/career'
    }
  ]);

  // Resume categories data for left section
  const [resumeCategories] = useState([
    {
      id: 1,
      name: 'Eğitim Hayatı',
      description: 'Akademik eğitim sürecim ve aldığım derecelerin detayları',
      shortDescription: 'Lisans, yüksek lisans ve doktora eğitim sürecim hakkında detaylı bilgiler.',
      color: '#3B82F6',
      icon: AcademicCapIcon,
      route: '/resume/education',
      stats: '4 Derece'
    },
    {
      id: 2,
      name: 'Akademik Kariyer',
      description: 'Öğretim üyeliği ve araştırma deneyimlerim',
      shortDescription: 'Araştırma görevliliğinden profesörlüğe kadar olan akademik kariyerim.',
      color: '#10B981',
      icon: BookOpenIcon,
      route: '/resume/career',
      stats: '15+ Yıl Deneyim'
    },
    {
      id: 3,
      name: 'Ödüller ve Başarılar',
      description: 'Aldığım ödüller ve akademik başarılarım',
      shortDescription: 'Ulusal ve uluslararası düzeyde aldığım ödüller ve akademik başarılarım.',
      color: '#F59E0B',
      icon: SparklesIcon,
      route: '/resume/awards',
      stats: '12 Ödül'
    }
  ]);

  // Quick stats data
  const [quickStats] = useState([
    { 
      id: 1, 
      icon: DocumentTextIcon, 
      count: '25+', 
      label: 'Akademik Yayın', 
      color: 'text-teal-dark', 
      bg: 'bg-teal-light/10',
      description: 'Makale, kitap ve bildiri'
    },
    { 
      id: 2, 
      icon: UserIcon, 
      count: '500+', 
      label: 'Öğrenci', 
      color: 'text-burgundy-medium', 
      bg: 'bg-burgundy-light/10',
      description: 'Mezun olan öğrenci sayısı'
    },
    { 
      id: 3, 
      icon: PlayIcon, 
      count: '50+', 
      label: 'Video İçerik', 
      color: 'text-brown-dark', 
      bg: 'bg-brown-light/10',
      description: 'Eğitim ve söyleşi videoları'
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

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        <div className="text-center font-bookmania">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-teal-light border-t-teal-dark mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full border-4 border-burgundy-light opacity-30 animate-pulse"></div>
          </div>
          <h2 className="text-brown-dark text-xl mb-2">Prof. Dr. Ahmed Ürkmez</h2>
          <p className="text-brown-light text-sm">Sayfa yükleniyor...</p>
          <div className="mt-4 flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-teal-medium rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-light/20 via-transparent to-burgundy-light/20"></div>
        <div className="grid grid-cols-12 gap-4 h-full animate-pulse">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="bg-brown-light rounded-full w-1 h-1"
              style={{ 
                animationDelay: `${i * 0.05}s`,
                opacity: Math.random() * 0.5 + 0.1 
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Side - Hero Content */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-teal-light/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-teal-dark border border-teal-light/30">
                  <SparklesIcon className="h-4 w-4" />
                  <span className="font-medium">Edebiyat ve Kültür Uzmanı</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bookmania-bold text-brown-dark leading-tight">
                  Prof. Dr. Ahmed 
                  <span className="block text-burgundy-medium">Ürkmez</span>
                </h1>
                <p className="text-lg text-brown-light leading-relaxed max-w-lg">
                  Modern Selçuklu sanatından ilham alan akademik yaklaşımla, 
                  edebiyat ve kültür araştırmalarında 15+ yıllık deneyim.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {quickStats.map((stat) => (
                  <div
                    key={stat.id}
                    className={`${stat.bg} rounded-xl p-4 text-center hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur-sm group cursor-pointer`}
                  >
                    <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <div className={`text-xl font-bookmania-bold ${stat.color}`}>{stat.count}</div>
                    <div className="text-xs text-brown-light mt-1">{stat.label}</div>
                    <div className="text-xs text-brown-light opacity-75 mt-1">{stat.description}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push('/articles')}
                  className="btn-primary flex items-center space-x-2 group"
                >
                  <span>Eserlerimi İncele</span>
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/resume')}
                  className="btn-secondary flex items-center space-x-2 group"
                >
                  <span>Özgeçmişim</span>
                  <UserIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Side - Hero Image Carousel */}
            <div className="relative animate-fade-in">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide
                        ? 'opacity-100 translate-x-0'
                        : index < currentSlide
                        ? 'opacity-0 -translate-x-full'
                        : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bookmania-bold mb-2 drop-shadow-lg">
                        {slide.title}
                      </h3>
                      <p className="text-sm opacity-90 mb-4 drop-shadow-md leading-relaxed">
                        {slide.description}
                      </p>
                      <button
                        onClick={() => router.push(slide.ctaLink)}
                        className="bg-teal-medium hover:bg-teal-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center space-x-2 group"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-teal-light scale-125 shadow-lg'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Section - Resume Cards */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-brown rounded-2xl shadow-xl p-6 border-2 border-brown-light/30 backdrop-blur-sm sticky top-8">
              <div className="flex items-center mb-6">
                <AcademicCapIcon className="h-8 w-8 text-white mr-3 drop-shadow-lg" />
                <h2 className="text-2xl text-white drop-shadow-lg font-bookmania-bold">Özgeçmiş</h2>
              </div>
              
              <div className="space-y-4">
                {resumeCategories.map((category, index) => (
                  <div key={category.id} className="group">
                    {/* Card Header */}
                    <div 
                      className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/30 hover:scale-[1.02]"
                      onClick={() => handleCardClick(category.id, category.route)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="p-2 rounded-lg bg-white/20"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <category.icon 
                              className="h-6 w-6 text-white" 
                              style={{ color: category.color }}
                            />
                          </div>
                          <div>
                            <h3 className="text-white font-bookmania font-semibold text-lg">
                              {category.name}
                            </h3>
                            <p className="text-white/80 text-sm">{category.stats}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigate(category.route);
                            }}
                            className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-all duration-200 flex items-center space-x-1"
                          >
                            <span>İncele</span>
                            <ArrowRightIcon className="h-3 w-3" />
                          </button>
                          {expandedCard === category.id ? (
                            <ChevronUpIcon className="h-5 w-5 text-white transition-transform duration-300" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-white transition-transform duration-300" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {expandedCard === category.id && (
                      <div className="mt-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl p-4 animate-slide-up">
                        <p className="text-gray-800 font-medium text-sm leading-relaxed mb-4">
                          {category.shortDescription}
                        </p>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleNavigate(category.route)}
                            className="bg-teal-dark hover:bg-teal-medium text-white px-4 py-2 rounded-full transition-colors duration-200 text-sm flex items-center space-x-2"
                          >
                            <span>Detayları Gör</span>
                            <ArrowRightIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Quick Links */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-white font-bookmania font-semibold mb-3">Hızlı Erişim</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => router.push('/contact')}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200"
                  >
                    📧 İletişim
                  </button>
                  <button 
                    onClick={() => router.push('/about')}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200"
                  >
                    👤 Hakkımda
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section - Featured Content */}
          <div className="lg:col-span-4 space-y-8">
            {/* Featured Slider */}
           

            {/* Recent Articles Preview */}
            <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-7 w-7 text-burgundy-medium" />
                  <h2 className="text-xl font-bookmania-bold text-brown-dark">Son Yazılar</h2>
                </div>
                <button
                  onClick={() => router.push('/articles')}
                  className="text-sm text-burgundy-medium hover:text-burgundy-dark flex items-center space-x-1 transition-colors"
                >
                  <span>Tümünü Gör</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { 
                    title: 'Modern Türk Edebiyatında Kimlik Sorunu', 
                    date: '15 Ocak 2024', 
                    category: 'Makale',
                    views: '1.2K',
                    likes: '45'
                  },
                  { 
                    title: 'Dijital Çağda Okuma Kültürü', 
                    date: '10 Ocak 2024', 
                    category: 'Araştırma',
                    views: '890',
                    likes: '32'
                  },
                  { 
                    title: 'Kültürlerarası İletişimde Dilin Rolü', 
                    date: '5 Ocak 2024', 
                    category: 'Bildiri',
                    views: '756',
                    likes: '28'
                  }
                ].map((article, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-colors cursor-pointer group"
                    onClick={() => router.push('/articles')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bookmania font-semibold text-brown-dark group-hover:text-burgundy-medium transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-brown-light">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{article.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="h-4 w-4" />
                            <span>{article.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HeartIcon className="h-4 w-4" />
                            <span>{article.likes}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs bg-burgundy-light/20 text-burgundy-dark px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Works Categories */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-teal rounded-2xl shadow-xl p-6 border-2 border-teal-light/30 backdrop-blur-sm sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BookOpenIcon className="h-8 w-8 text-white mr-3 drop-shadow-lg" />
                  <h2 className="text-2xl text-white drop-shadow-lg font-bookmania-bold">Eserler</h2>
                </div>
                <div className="text-white/80 text-sm">
                  {worksCategories.reduce((total, cat) => 
                    total + (cat.children ? 
                      cat.children.reduce((childTotal, child) => childTotal + child.articles.length, 0) + cat.articles.length :
                      cat.articles.length
                    ), 0
                  )} toplam
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedWorkCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedWorkCategory === 'all' 
                        ? 'bg-white text-teal-dark shadow-sm scale-105' 
                        : 'bg-white/25 text-white hover:bg-white/35 drop-shadow-sm'
                    }`}
                  >
                    Tümü
                  </button>
                  {worksCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedWorkCategory(category.id.toString())}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedWorkCategory === category.id.toString() 
                          ? 'bg-white text-teal-dark shadow-sm scale-105' 
                          : 'bg-white/25 text-white hover:bg-white/35 drop-shadow-sm'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Works Categories */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {worksCategories
                  .filter(category => selectedWorkCategory === 'all' || selectedWorkCategory === category.id.toString())
                  .map((category, index) => (
                  <div key={category.id} className="bg-white/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/30">
                    {/* Category Header */}
                    <div 
                      className="flex items-center justify-between mb-3 cursor-pointer"
                      onClick={() => handleWorkCardToggle(category.id)}
                    >
                      <h3 className="text-white font-bookmania font-semibold text-lg drop-shadow-sm">
                        {category.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-white/25 text-white font-medium px-2 py-1 rounded-full">
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
                          className="text-xs bg-white/25 hover:bg-white/35 text-white font-medium px-2 py-1 rounded-full transition-colors duration-200 flex items-center space-x-1"
                        >
                          <span>Detay</span>
                          <ArrowRightIcon className="h-3 w-3" />
                        </button>
                        {expandedWorkCard === category.id ? (
                          <ChevronUpIcon className="h-5 w-5 text-white transition-transform duration-300" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-white transition-transform duration-300" />
                        )}
                      </div>
                    </div>
                    
                    {/* Collapsible Content */}
                    {expandedWorkCard === category.id && (
                      <div className="space-y-3 animate-slide-up">
                        <p className="text-white text-sm leading-relaxed bg-gray-800/60 p-3 rounded-lg border border-gray-600/40">
                          {category.description}
                        </p>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-700/90 backdrop-blur-sm border border-gray-500/50 rounded-lg p-3 text-center">
                            <div className="text-white font-bookmania-bold text-lg">
                              {category.children ? 
                                category.children.reduce((total, child) => total + child.articles.length, 0) + category.articles.length :
                                category.articles.length
                              }
                            </div>
                            <div className="text-gray-200 text-xs">Toplam Eser</div>
                          </div>
                          <div className="bg-gray-700/90 backdrop-blur-sm border border-gray-500/50 rounded-lg p-3 text-center">
                            <div className="text-white font-bookmania-bold text-lg">
                              {(category.children ? 
                                category.children.flatMap(child => child.articles) : 
                                category.articles
                              ).reduce((total, article) => total + (article.viewCount || 0), 0).toLocaleString()}
                            </div>
                            <div className="text-gray-200 text-xs">Görüntülenme</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-white font-bookmania font-semibold mb-3">Hızlı Erişim</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => router.push('/articles')}
                    className="bg-white/25 hover:bg-white/35 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200"
                  >
                    📚 Tüm Eserler
                  </button>
                  <button 
                    onClick={() => router.push('/categories')}
                    className="bg-white/25 hover:bg-white/35 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200"
                  >
                    🗂 Kategoriler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section with Contact CTA */}
      <section className="bg-gradient-to-r from-brown-dark to-burgundy-dark py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bookmania-bold font-bookmania-bold text-brown-dark mb-4">
            Akademik İşbirliği ve İletişim
          </h2>
          <p className="font-bookmania-bold text-brown-dark/90 text-lg mb-8 max-w-2xl mx-auto">
            Edebiyat ve kültür araştırmaları konularında işbirliği yapmak, 
            projelerimden haberdar olmak veya sorularınızı sormak için benimle iletişime geçin.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/contact')}
              className="bg-teal-medium hover:bg-teal-dark font-bookmania-bold text-brown-dark px-8 py-3 rounded-full font-bookmania font-medium transition-all duration-300 flex items-center space-x-2 group shadow-lg"
            >
              <span className='text-white'>İletişime Geç</span>
              <ArrowRightIcon className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push('/articles')}
              className="bg-transparent border-2 border-white font-bookmania-bold text-brown-dark hover:bg-white hover:text-brown-dark px-8 py-3 rounded-full font-bookmania font-medium transition-all duration-300"
            >
              Tüm Çalışmalarımı İncele
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
