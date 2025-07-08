'use client';

import { useEffect, useState } from 'react';
import CategorySection from '@/components/ui/CategorySection';
import ImageSlider from '@/components/ui/ImageSlider';
import { AcademicCapIcon, BookOpenIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

// CSS Animation classes will be used instead of Framer Motion for now

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with real API calls
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

  // Resume categories data for left section
  const [resumeCategories] = useState([
    {
      id: 1,
      name: 'Eğitim Hayatı',
      description: 'Akademik eğitim sürecim',
      color: '#3B82F6',
      articles: [
        {
          id: 1,
          title: 'Lisans Eğitimim',
          excerpt: 'Türk Dili ve Edebiyatı lisans eğitimim hakkında...',
          slug: 'lisans-egitimim',
          createdAt: '2023-01-15',
          category: { name: 'Eğitim', color: '#3B82F6' },
          viewCount: 150,
          likeCount: 25
        },
        {
          id: 2,
          title: 'Yüksek Lisans Sürecim',
          excerpt: 'Yüksek lisans tez çalışmam ve araştırma sürecim...',
          slug: 'yuksek-lisans-surecim',
          createdAt: '2023-02-20',
          category: { name: 'Eğitim', color: '#3B82F6' },
          viewCount: 120,
          likeCount: 18
        },
        {
          id: 3,
          title: 'Doktora Deneyimim',
          excerpt: 'Doktora tezi ve akademik araştırma sürecim...',
          slug: 'doktora-deneyimim',
          createdAt: '2023-03-10',
          category: { name: 'Eğitim', color: '#3B82F6' },
          viewCount: 180,
          likeCount: 30
        }
      ],
      children: []
    },
    {
      id: 2,
      name: 'Akademik Kariyer',
      description: 'Öğretim üyeliği ve araştırma deneyimim',
      color: '#10B981',
      articles: [
        {
          id: 4,
          title: 'Araştırma Görevliliği',
          excerpt: 'Akademik kariyerimin başlangıç dönemi...',
          slug: 'arastirma-gorevliligi',
          createdAt: '2023-04-01',
          category: { name: 'Kariyer', color: '#10B981' },
          viewCount: 140,
          likeCount: 22
        },
        {
          id: 5,
          title: 'Öğretim Üyeliği',
          excerpt: 'Profesörlük sürecim ve deneyimlerim...',
          slug: 'ogretim-uyeligi',
          createdAt: '2023-05-15',
          category: { name: 'Kariyer', color: '#10B981' },
          viewCount: 200,
          likeCount: 35
        }
      ],
      children: []
    },
    {
      id: 3,
      name: 'Ödüller ve Başarılar',
      description: 'Aldığım ödüller ve akademik başarılarım',
      color: '#F59E0B',
      articles: [
        {
          id: 6,
          title: 'Akademik Ödüllerim',
          excerpt: 'Çeşitli kuruluşlardan aldığım ödüller...',
          slug: 'akademik-odullerim',
          createdAt: '2023-06-01',
          category: { name: 'Ödül', color: '#F59E0B' },
          viewCount: 160,
          likeCount: 28
        },
        {
          id: 7,
          title: 'Yayın Başarılarım',
          excerpt: 'Uluslararası dergilerde yayınlanan çalışmalarım...',
          slug: 'yayin-basarilarim',
          createdAt: '2023-07-01',
          category: { name: 'Başarı', color: '#F59E0B' },
          viewCount: 190,
          likeCount: 32
        }
      ],
      children: []
    }
  ]);

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
        <div className="lg:col-span-5 rounded-xl shadow-2xl p-6 h-fit bg-gradient-brown border-2 border-brown-light/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-slide-up">
          <div className="sticky top-4">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-8 w-8 text-white mr-3 drop-shadow-lg hover:rotate-12 transition-transform duration-300" />
              <h2 className="heading-seljuk text-2xl text-white drop-shadow-lg">Özgeçmiş</h2>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {resumeCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CategorySection
                    category={category}
                    level={0}
                    isSticky={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Section - Slider and Title (5 columns) */}
        <div className="lg:col-span-5 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Title Section */}
          <div className="bg-gradient-burgundy rounded-xl shadow-2xl p-8 text-center text-white border-2 border-burgundy-light/30 hover:scale-105 hover:shadow-elegant-hover transition-all duration-500">
            <h1 className="heading-seljuk-large text-4xl lg:text-5xl mb-4 text-white drop-shadow-2xl animate-fade-in">
              Prof. Dr. Ahmed Ürkmez
            </h1>
            <p className="text-lg opacity-90 font-bookmania mb-2 drop-shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Edebiyat ve Kültür Araştırmaları Uzmanı
            </p>
            <p className="text-sm opacity-75 font-bookmania italic drop-shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Modern Selçuklu Sanatı Esinlenmesi
            </p>
            <div className="mt-6 flex justify-center space-x-4 flex-wrap gap-y-2">
              {['Akademisyen', 'Yazar', 'Araştırmacı'].map((role, index) => (
                <div
                  key={role}
                  className="bg-white/20 rounded-full px-6 py-3 backdrop-blur-sm border border-white/30 hover:scale-110 hover:bg-white/30 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <span className="text-base font-medium font-bookmania">{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Slider */}
          <div className="rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border-2 border-teal-light/30 hover:scale-105 hover:shadow-elegant-hover transition-all duration-500 animate-fade-in" style={{ animationDelay: '0.8s' }}>
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
                className={`card-seljuk text-center group ${stat.bg} transition-all duration-300 hover:scale-105 hover:shadow-elegant animate-fade-in`}
                style={{ animationDelay: `${1.2 + index * 0.1}s` }}
              >
                <div className="hover:scale-110 hover:rotate-6 transition-transform duration-300">
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <div className="text-2xl font-bookmania-bold text-brown-dark">{stat.count}</div>
                <div className="text-sm font-bookmania text-brown-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Works (5 columns) */}
        <div className="lg:col-span-5 rounded-xl shadow-2xl p-6 h-fit bg-gradient-teal border-2 border-teal-light/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="sticky top-4">
            <div className="flex items-center mb-6">
              <BookOpenIcon className="h-8 w-8 text-white mr-3 drop-shadow-lg hover:-rotate-12 transition-transform duration-300" />
              <h2 className="heading-seljuk text-2xl text-white drop-shadow-lg">Eserler</h2>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {worksCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <CategorySection
                    category={category}
                    level={0}
                    isSticky={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
