'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { Article, Category } from '@/types';
import CategorySection from '@/components/ui/CategorySection';
import ImageSlider from '@/components/ui/ImageSlider';
import { AcademicCapIcon, BookOpenIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

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

  // Mock category data with recursive structure
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
          title: 'Doktora Çalışmalarım',
          excerpt: 'Doktora tez konusu ve araştırma metodolojim...',
          slug: 'doktora-calismalarim',
          createdAt: '2023-03-10',
          category: { name: 'Eğitim', color: '#3B82F6' },
          viewCount: 200,
          likeCount: 35
        }
      ],
      children: []
    },
    {
      id: 2,
      name: 'Öğretmenlik Günleri',
      description: 'Eğitim deneyimlerim',
      color: '#10B981',
      articles: [
        {
          id: 4,
          title: 'İlk Öğretmenlik Deneyimim',
          excerpt: 'Mesleğe başladığım ilk yıllar ve deneyimlerim...',
          slug: 'ilk-ogretmenlik-deneyimim',
          createdAt: '2023-04-05',
          category: { name: 'Öğretmenlik', color: '#10B981' },
          viewCount: 180,
          likeCount: 30
        },
        {
          id: 5,
          title: 'Öğrenci İlişkileri',
          excerpt: 'Öğrencilerle kurduğum bağ ve eğitim felsefem...',
          slug: 'ogrenci-iliskileri',
          createdAt: '2023-04-15',
          category: { name: 'Öğretmenlik', color: '#10B981' },
          viewCount: 160,
          likeCount: 28
        },
        {
          id: 6,
          title: 'Eğitim Metodlarım',
          excerpt: 'Sınıfta uyguladığım öğretim teknikleri...',
          slug: 'egitim-metodlarim',
          createdAt: '2023-04-25',
          category: { name: 'Öğretmenlik', color: '#10B981' },
          viewCount: 140,
          likeCount: 22
        }
      ],
      children: []
    },
    {
      id: 3,
      name: 'Akademik Görevlerim',
      description: 'Üniversitedeki görevlerim',
      color: '#8B5CF6',
      articles: [
        {
          id: 7,
          title: 'Araştırma Görevliliği',
          excerpt: 'Üniversitede araştırma görevlisi olarak çalışmalarım...',
          slug: 'arastirma-gorevliligi',
          createdAt: '2023-05-01',
          category: { name: 'Akademik', color: '#8B5CF6' },
          viewCount: 190,
          likeCount: 32
        },
        {
          id: 8,
          title: 'Ders Verme Deneyimim',
          excerpt: 'Üniversitede verdiğim dersler ve öğretim deneyimim...',
          slug: 'ders-verme-deneyimim',
          createdAt: '2023-05-10',
          category: { name: 'Akademik', color: '#8B5CF6' },
          viewCount: 170,
          likeCount: 26
        },
        {
          id: 9,
          title: 'Akademik Projelerim',
          excerpt: 'Yürüttüğüm araştırma projeleri ve çalışmalar...',
          slug: 'akademik-projelerim',
          createdAt: '2023-05-20',
          category: { name: 'Akademik', color: '#8B5CF6' },
          viewCount: 210,
          likeCount: 38
        }
      ],
      children: []
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

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        <div className="text-center font-bookmania">
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
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Decorative Seljuk Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="bg-teal-medium rounded-full w-2 h-2 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>

      {/* 15 Column Grid Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-15 gap-6 p-6 max-w-[1920px] mx-auto min-h-screen">

        {/* Left Section - Resume (5 columns) */}
        <div className="lg:col-span-5 rounded-xl shadow-2xl p-6 h-fit bg-gradient-brown border-2 border-brown-light/30">
          <div className="sticky top-4">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-8 w-8 text-white mr-3" />
              <h2 className="heading-seljuk text-2xl text-white">Özgeçmiş</h2>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {resumeCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  level={0}
                  isSticky={false}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center Section - Slider and Title (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title Section */}
          <div className="bg-gradient-burgundy rounded-xl shadow-2xl p-8 text-center text-white border-2 border-burgundy-light/30">
            <h1 className="heading-seljuk-large text-4xl lg:text-5xl mb-4 text-white">Prof. Dr. Ahmed Ürkmez</h1>
            <p className="text-lg opacity-90 font-bookmania mb-2">Edebiyat ve Kültür Araştırmaları Uzmanı</p>
            <p className="text-sm opacity-75 font-bookmania italic">Modern Selçuklu Sanatı Esinlenmesi</p>

            {/* Decorative Seljuk Pattern */}
            <div className="flex justify-center my-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full mt-0.5"></div>
                <div className="w-4 h-4 bg-white/40 rounded-full -mt-0.5"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full mt-0.5"></div>
                <div className="w-3 h-3 bg-white/30 rounded-full"></div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm border border-white/30">
                <span className="text-sm font-bookmania-medium">Akademisyen</span>
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm border border-white/30">
                <span className="text-sm font-bookmania-medium">Yazar</span>
              </div>
              <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm border border-white/30">
                <span className="text-sm font-bookmania-medium">Araştırmacı</span>
              </div>
            </div>
          </div>

          {/* Image Slider */}
          <div className="rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border-2 border-teal-light/30">
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
            <div className="card-seljuk text-center group hover:bg-teal-light/20 transition-all duration-300">
              <BookOpenIcon className="h-8 w-8 mx-auto mb-2 text-teal-dark group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bookmania-bold text-brown-dark">25+</div>
              <div className="text-sm font-bookmania text-brown-light">Yayın</div>
            </div>
            <div className="card-seljuk text-center group hover:bg-burgundy-light/20 transition-all duration-300">
              <AcademicCapIcon className="h-8 w-8 mx-auto mb-2 text-burgundy-medium group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bookmania-bold text-brown-dark">15+</div>
              <div className="text-sm font-bookmania text-brown-light">Yıl Deneyim</div>
            </div>
            <div className="card-seljuk text-center group hover:bg-brown-light/20 transition-all duration-300">
              <VideoCameraIcon className="h-8 w-8 mx-auto mb-2 text-brown-dark group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bookmania-bold text-brown-dark">50+</div>
              <div className="text-sm font-bookmania text-brown-light">Video İçerik</div>
            </div>
          </div>
        </div>

        {/* Right Section - Works (5 columns) */}
        <div className="lg:col-span-5 rounded-xl shadow-2xl p-6 h-fit bg-gradient-teal border-2 border-teal-light/30">
          <div className="sticky top-4">
            <div className="flex items-center mb-6">
              <BookOpenIcon className="h-8 w-8 text-white mr-3" />
              <h2 className="heading-seljuk text-2xl text-white">Eserler</h2>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {worksCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  level={0}
                  isSticky={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
