'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { Article, Category } from '@/types';
import CategorySection from '@/components/ui/CategorySection';
import ResumeSection from '@/components/ui/ResumeSection';
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

  // Ana özgeçmiş kategorileri - sadeleştirilmiş
  const [resumeSections] = useState([
    {
      id: 1,
      title: 'Eğitim Hayatım',
      summary: 'Türk Dili ve Edebiyatı alanında aldığım lisans, yüksek lisans ve doktora eğitimi sürecim.',
      description: 'Akademik eğitim sürecimde attığım adımlar, aldığım dersler, tez çalışmalarım ve bu süreçte edindiğim deneyimler.',
      icon: AcademicCapIcon,
      color: 'var(--resume-primary)',
      gradient: 'from-resume-primary to-resume-secondary',
      slug: 'egitim-hayatim',
      details: `
        <h3>Lisans Eğitimi</h3>
        <p>Üniversite yıllarımda Türk Dili ve Edebiyatı bölümünde aldığım temel eğitim, edebiyat sevgimi akademik bir disiplin haline getirdi.</p>
        
        <h3>Yüksek Lisans</h3>
        <p>Modern Türk edebiyatı üzerine yaptığım yüksek lisans tez çalışmam, araştırma metodolojimi şekillendirdi.</p>
        
        <h3>Doktora Süreci</h3>
        <p>Doktora çalışmalarımda kimlik sorunu ve modern edebiyat ilişkisini derinlemesine inceledim.</p>
      `
    },
    {
      id: 2,
      title: 'Akademik Kariyerim',
      summary: 'Üniversitedeki öğretim görevliliğinden profesörlük sürecine kadar geçen akademik yolculuğum.',
      description: 'Akademik hayatta attığım adımlar, verdiğim dersler, yürüttüğüm projeler ve araştırma çalışmalarım.',
      icon: BookOpenIcon,
      color: 'var(--center-primary)',
      gradient: 'from-center-primary to-center-secondary',
      slug: 'akademik-kariyerim',
      details: `
        <h3>Öğretim Görevliliği</h3>
        <p>Akademik kariyerimin başlangıcında öğretim görevlisi olarak verdiğim dersler ve öğrencilerle kurduğum bağ.</p>
        
        <h3>Araştırma Projeleri</h3>
        <p>Yürüttüğüm akademik projeler ve bu projelerden elde ettiğim bulgular.</p>
        
        <h3>Profesörlük Süreci</h3>
        <p>Doçentlik ve profesörlük sürecinde geçirdiğim aşamalar ve akademik katkılarım.</p>
      `
    },
    {
      id: 3,
      title: 'Yayın ve Eserlerim',
      summary: 'Kitaplar, makaleler, bildiriler ve diğer akademik yayınlarım ile kültürel katkılarım.',
      description: 'Akademik ve popüler yayınlarım, editörlük çalışmalarım ve edebiyat dünyasına katkılarım.',
      icon: VideoCameraIcon,
      color: 'var(--works-primary)',
      gradient: 'from-works-primary to-works-secondary',
      slug: 'yayin-ve-eserlerim',
      details: `
        <h3>Akademik Yayınlar</h3>
        <p>Hakemli dergilerde yayınlanan makalelerim ve bilimsel araştırmalarım.</p>
        
        <h3>Kitap Çalışmaları</h3>
        <p>Yazdığım kitaplar, editörlüğünü yaptığım eserler ve çeviri çalışmalarım.</p>
        
        <h3>Popüler Yayınlar</h3>
        <p>Geniş kitleye hitap eden yazılarım, röportajlarım ve medya katkılarım.</p>
      `
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
        <div className="lg:col-span-5 rounded-xl shadow-elegant shadow-elegant-hover p-6 h-fit bg-gradient-resume">
          <div className="sticky top-24">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-10 w-10 text-white mr-3 drop-shadow-md" />
              <h2 className="text-3xl font-bold text-white drop-shadow-md">Özgeçmiş</h2>
            </div>
            <div className="space-y-6">
              {resumeSections.map((section) => (
                <ResumeSection key={section.id} section={section} />
              ))}
            </div>
          </div>
        </div>

        {/* Center Section - Slider and Title (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title Section */}
          <div className="bg-gradient-center rounded-xl shadow-elegant shadow-elegant-hover p-8 text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 font-bookmania drop-shadow-lg">Prof. Dr. Ahmed Ürkmez</h1>
            <p className="text-xl lg:text-2xl opacity-90 font-bookmania drop-shadow-md mb-8">Edebiyat ve Kültür Araştırmaları Uzmanı</p>
            <div className="mt-6 flex justify-center space-x-4 flex-wrap gap-y-2">
              <div className="bg-white/20 rounded-full px-6 py-3 backdrop-blur-sm border border-white/30">
                <span className="text-base font-medium font-bookmania">Akademisyen</span>
              </div>
              <div className="bg-white/20 rounded-full px-6 py-3 backdrop-blur-sm border border-white/30">
                <span className="text-base font-medium font-bookmania">Yazar</span>
              </div>
              <div className="bg-white/20 rounded-full px-6 py-3 backdrop-blur-sm border border-white/30">
                <span className="text-base font-medium font-bookmania">Araştırmacı</span>
              </div>
            </div>
          </div>

          {/* Image Slider */}
          <div className="rounded-xl shadow-elegant shadow-elegant-hover overflow-hidden border border-center-primary/20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
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
            <div className="rounded-xl shadow-elegant shadow-elegant-hover p-6 text-center border border-center-primary/20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <BookOpenIcon className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--center-secondary)' }} />
              <div className="text-3xl font-bold font-bookmania" style={{ color: 'var(--text-primary)' }}>25+</div>
              <div className="text-base font-bookmania" style={{ color: 'var(--text-secondary)' }}>Yayın</div>
            </div>
            <div className="rounded-xl shadow-elegant shadow-elegant-hover p-6 text-center border border-center-primary/20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <AcademicCapIcon className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--center-secondary)' }} />
              <div className="text-3xl font-bold font-bookmania" style={{ color: 'var(--text-primary)' }}>15+</div>
              <div className="text-base font-bookmania" style={{ color: 'var(--text-secondary)' }}>Yıl Deneyim</div>
            </div>
            <div className="rounded-xl shadow-elegant shadow-elegant-hover p-6 text-center border border-center-primary/20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <VideoCameraIcon className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--center-secondary)' }} />
              <div className="text-3xl font-bold font-bookmania" style={{ color: 'var(--text-primary)' }}>50+</div>
              <div className="text-base font-bookmania" style={{ color: 'var(--text-secondary)' }}>Video İçerik</div>
            </div>
          </div>
        </div>

        {/* Right Section - Works (5 columns) */}
        <div className="lg:col-span-5 rounded-xl shadow-elegant shadow-elegant-hover p-6 h-fit bg-gradient-works">
          <div className="sticky top-24">
            <div className="flex items-center mb-6">
              <BookOpenIcon className="h-10 w-10 text-white mr-3 drop-shadow-md" />
              <h2 className="text-3xl font-bold text-white font-bookmania drop-shadow-md">Eserler</h2>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
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
