'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategorySection from '@/components/ui/CategorySection';
import ImageSlider from '@/components/ui/ImageSlider';
import { articlesAPI, categoriesAPI, adminAPI } from '@/lib/api';
import { extractArticlesArray, extractCategoriesArray, safeArrayStats, safeFilter } from '@/lib/arrayUtils';
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
  
  // API Data States
  const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [categoryArticles, setCategoryArticles] = useState<{[key: string]: any[]}>({});
  
  const router = useRouter();

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load featured articles (for hero section)
        const featuredResponse = await articlesAPI.getAll({ 
          featured: true, 
          limit: 5, 
          status: 'published',
          simple: true 
        });
        const featuredData = extractArticlesArray(featuredResponse);
        setFeaturedArticles(featuredData);
        
        // Load recent articles
        const recentResponse = await articlesAPI.getAll({ 
          limit: 6, 
          status: 'published',
          simple: true 
        });
        const recentData = extractArticlesArray(recentResponse);
        setRecentArticles(recentData);
        
        // Load categories
        const categoriesResponse = await categoriesAPI.getAll();
        const categoriesData = extractCategoriesArray(categoriesResponse);
        setCategories(categoriesData);
        
        // Load articles for each category to show counts
        const categoryArticlesMap: {[key: string]: any[]} = {};
        for (const category of categoriesData.slice(0, 5)) { // Limit to first 5 categories for performance
          try {
            const categoryArticlesResponse = await articlesAPI.getAll({ 
              categoryId: category.id, 
              limit: 10,
              status: 'published',
              simple: true 
            });
            const articlesList = extractArticlesArray(categoryArticlesResponse);
            categoryArticlesMap[category.id] = articlesList;
          } catch (error) {
            console.warn(`Could not load articles for category ${category.id}:`, error);
            categoryArticlesMap[category.id] = [];
          }
        }
        setCategoryArticles(categoryArticlesMap);
        
        // Load dashboard stats
        try {
          const statsResponse = await adminAPI.getDashboardStats();
          // Safely extract stats data
          const statsData = statsResponse?.data || statsResponse || {};
          setDashboardStats({
            totalArticles: statsData.articles?.total || recentData.length || 0,
            totalCategories: statsData.categories?.total || categoriesData.length || 0,
            totalViews: statsData.totalViews || recentData.reduce((sum: number, article: any) => sum + (parseInt(article.viewCount || article.views || '0') || 0), 0),
            totalLikes: statsData.totalLikes || recentData.reduce((sum: number, article: any) => sum + (parseInt(article.likeCount || article.likes || '0') || 0), 0)
          });
        } catch (error) {
          console.warn('Dashboard stats not available:', error);
          // Fallback to calculated stats from articles
          const totalViews = recentData.reduce((sum: number, article: any) => {
            const views = parseInt(article.viewCount || article.views || '0') || 0;
            return sum + views;
          }, 0);
          const totalLikes = recentData.reduce((sum: number, article: any) => {
            const likes = parseInt(article.likeCount || article.likes || '0') || 0;
            return sum + likes;
          }, 0);
          
          setDashboardStats({
            totalArticles: recentData.length || 0,
            totalCategories: categoriesData.length || 0,
            totalViews: totalViews,
            totalLikes: totalLikes
          });
        }
        
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Auto-slide for hero section
  useEffect(() => {
    if (featuredArticles.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredArticles.length]);

  // Generate hero slides from featured articles
  const heroSlides = featuredArticles.map((article, index) => ({
    id: article.id || index + 1,
    url: article.featuredImage || `https://images.unsplash.com/photo-150700321116${index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80`,
    title: article.title || 'Featured Article',
    description: article.excerpt || article.content?.substring(0, 100) + '...' || 'Discover more content',
    ctaText: 'Makaleyi Oku',
    ctaLink: `/articles/${article.slug || article.id}`
  }));

  // Resume categories data for left section
  const [resumeCategories] = useState([
    {
      id: 1,
      name: 'Eğitim Hayatı',
      description: 'Hafızlık, lisans, yüksek lisans ve doktora eğitim sürecim',
      shortDescription: '1998 Selçuk Üniversitesi İlahiyat Fakültesi mezunu. 2000 yüksek lisans, 2007 doktora (Hadis Anabilim Dalı). 1991 hafızlık diploması.',
      color: '#3B82F6',
      icon: AcademicCapIcon,
      route: '/resume/education',
      stats: 'Hafız - Dr.'
    },
    {
      id: 2,
      name: 'Akademik Kariyer',
      description: 'Öğretmenlikten profesörlüğe uzanan akademik yolculuğum',
      shortDescription: '2001-2011 MEB öğretmeni, 2011-2017 İnönü/Kırıkkale Üni., 2017-2022 Pamukkale Üni. Doçent, 2022-günümüz ASBÜ Profesörü.',
      color: '#10B981',
      icon: BookOpenIcon,
      route: '/resume/career',
      stats: '23+ Yıl Deneyim'
    },
    {
      id: 3,
      name: 'Yayınlar ve Projeler',
      description: 'Kitaplarım, makalelerim ve akademik projelerim',
      shortDescription: '7 kitap, çok sayıda makale, Hadislerle İslam projesi yazarlığı, Hafızlık Destekli Sınıf Projesi ve sempozyum katılımları.',
      color: '#F59E0B',
      icon: SparklesIcon,
      route: '/resume/awards',
      stats: '7 Kitap'
    }
  ]);

  // Generate quick stats from dashboard data or fallback
  const quickStats = dashboardStats ? [
    { 
      id: 1, 
      icon: DocumentTextIcon, 
      count: `${parseInt(dashboardStats.totalArticles) || 0}+`, 
      label: 'Akademik Yayın', 
      color: 'text-teal-dark', 
      bg: 'bg-teal-light/10',
      description: 'Makale, kitap ve bildiri'
    },
    { 
      id: 2, 
      icon: EyeIcon, 
      count: `${Math.floor((parseInt(dashboardStats.totalViews) || 0) / 1000) || 0}K+`, 
      label: 'Toplam Görüntüleme', 
      color: 'text-burgundy-medium', 
      bg: 'bg-burgundy-light/10',
      description: 'İçeriklere yapılan ziyaretler'
    },
    { 
      id: 3, 
      icon: HeartIcon, 
      count: `${parseInt(dashboardStats.totalLikes) || 0}+`, 
      label: 'Beğeni', 
      color: 'text-brown-dark', 
      bg: 'bg-brown-light/10',
      description: 'Kullanıcı etkileşimleri'
    }
  ] : [
    { 
      id: 1, 
      icon: DocumentTextIcon, 
      count: '7+', 
      label: 'Yayınlanmış Kitap', 
      color: 'text-teal-dark', 
      bg: 'bg-teal-light/10',
      description: 'Hadis ve İslami İlimler'
    },
    { 
      id: 2, 
      icon: UserIcon, 
      count: '23+', 
      label: 'Yıl Deneyim', 
      color: 'text-burgundy-medium', 
      bg: 'bg-burgundy-light/10',
      description: 'Eğitim ve akademik alanda'
    },
    { 
      id: 3, 
      icon: AcademicCapIcon, 
      count: '4+', 
      label: 'Üniversite', 
      color: 'text-brown-dark', 
      bg: 'bg-brown-light/10',
      description: 'Görev yaptığı kurumlar'
    }
  ];

  // Generate slider images from recent articles
  const sliderImages = recentArticles.slice(0, 3).map((article, index) => ({
    id: article.id || index + 1,
    url: article.featuredImage || `https://images.unsplash.com/photo-148162783487${index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`,
    title: article.title || 'Featured Content',
    description: article.excerpt || 'İçeriği keşfedin'
  }));

  // Generate works categories from API categories
  const worksCategories = categories.length > 0 ? categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description || 'Bu kategorideki içerikleri keşfedin',
    color: '#F59E0B',
    articles: categoryArticles[category.id] || [],
    children: [],
    articleCount: (categoryArticles[category.id] || []).length
  })) : [
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
  ];

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
                  <span className="font-medium">Hadis İlmi Uzmanı</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bookmania-bold text-brown-dark leading-tight">
                  Prof. Dr. Ahmed 
                  <span className="block text-burgundy-medium">Ürkmez</span>
                </h1>
                <p className="text-lg text-brown-light leading-relaxed max-w-lg">
                  Hadis İlmi alanında uzman, İslami İlimler Fakültesi Profesörü. 
                  Akademik araştırma, eğitim ve yayıncılık alanlarında 20+ yıllık deneyim.
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
                {recentArticles.length > 0 ? recentArticles.slice(0, 3).map((article, index) => (
                  <div 
                    key={article.id || index}
                    className="p-4 bg-gradient-to-br from-[var(--bg-secondary)]/80 to-[var(--bg-tertiary)]/80 rounded-xl border border-teal-light/50 hover:from-[var(--bg-secondary)] hover:to-[var(--bg-tertiary)] transition-colors cursor-pointer group"
                    onClick={() => router.push(`/articles/${article.slug || article.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bookmania font-semibold text-brown-dark group-hover:text-burgundy-medium transition-colors">
                          {article.title || 'Başlıksız Makale'}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-brown-light">
                          <div className="flex items-center space-x-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{new Date(article.createdAt || Date.now()).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="h-4 w-4" />
                            <span>{parseInt(article.views || article.viewCount || '0') || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <HeartIcon className="h-4 w-4" />
                            <span>{parseInt(article.likes || article.likeCount || '0') || 0}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs bg-burgundy-light/20 text-burgundy-dark px-2 py-1 rounded-full">
                        {article.category?.name || article.type || 'Makale'}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-brown-light/50 mx-auto mb-4" />
                    <p className="text-brown-light">Henüz makale yüklenmemiş</p>
                    <button
                      onClick={() => router.push('/articles')}
                      className="mt-2 text-burgundy-medium hover:text-burgundy-dark transition-colors"
                    >
                      Tüm makaleleri görüntüle →
                    </button>
                  </div>
                )}
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
                  {worksCategories.reduce((total: number, cat: any) => 
                    total + (cat.articleCount || cat.articles?.length || 0), 0
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
                  {worksCategories.map((category: any) => (
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
                  .filter((category: any) => selectedWorkCategory === 'all' || selectedWorkCategory === category.id.toString())
                  .map((category: any, index: number) => (
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
                          {category.articleCount || category.articles?.length || 0} eser
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/articles?category=${category.id}`);
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
                              {category.articleCount || category.articles?.length || 0}
                            </div>
                            <div className="text-gray-200 text-xs">Toplam Eser</div>
                          </div>
                          <div className="bg-gray-700/90 backdrop-blur-sm border border-gray-500/50 rounded-lg p-3 text-center">
                            <div className="text-white font-bookmania-bold text-lg">
                              {(category.articles || []).reduce((total: number, article: any) => {
                                const views = parseInt(article.viewCount || article.views || '0') || 0;
                                return total + views;
                              }, 0).toLocaleString()}
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
            Hadis İlmi, İslami araştırmalar ve din eğitimi konularında işbirliği yapmak, 
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
