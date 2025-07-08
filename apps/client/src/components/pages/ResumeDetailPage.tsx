'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, AcademicCapIcon, BookOpenIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

interface ResumeDetailPageProps {
  slug: string;
}

const resumeData: { [key: string]: any } = {
  'egitim-hayatim': {
    title: 'Eğitim Hayatım',
    icon: AcademicCapIcon,
    color: 'var(--resume-primary)',
    content: `
      <h2>Lisans Eğitimi</h2>
      <p>İstanbul Üniversitesi Edebiyat Fakültesi Türk Dili ve Edebiyatı Bölümü'nde aldığım lisans eğitimi, akademik hayatımın temelini oluşturdu. Bu dönemde aldığım dersler ve katıldığım seminerler sayesinde edebiyatın teorik temellerini öğrenirken, aynı zamanda araştırma yöntemlerini de kavradım.</p>
      
      <h3>Aldığım Temel Dersler</h3>
      <ul>
        <li><strong>Eski Türk Edebiyatı:</strong> Klasik dönem metinleri ve edebî gelenekler</li>
        <li><strong>Yeni Türk Edebiyatı:</strong> Tanzimat'tan günümüze edebî akımlar</li>
        <li><strong>Edebiyat Teorisi:</strong> Modern eleştiri yaklaşımları</li>
        <li><strong>Türk Dili:</strong> Tarihi gelişim ve yapısal özellikler</li>
        <li><strong>Karşılaştırmalı Edebiyat:</strong> Dünya edebiyatları ile ilişkiler</li>
      </ul>
      
      <h2>Yüksek Lisans Süreci</h2>
      <p>Yüksek lisans eğitimimi aynı üniversitede "Modern Türk Şiirinde Kimlik Sorunu" konulu tez çalışması ile tamamladım. Bu süreç benim için hem araştırma becerilerimi geliştirdiğim hem de akademik yazım tarzımı oluşturduğum önemli bir dönem oldu.</p>
      
      <h3>Tez Çalışması Süreci</h3>
      <p>İki yıl süren yüksek lisans tez çalışmam boyunca, 20. yüzyıl Türk şiirinde kimlik arayışını inceledim. Nazım Hikmet, Orhan Veli, Cemal Süreya ve İlhan Berk gibi önemli şairlerin eserlerini analiz ederek, toplumsal değişimlerin şiire yansımalarını araştırdım.</p>
      
      <h2>Doktora Çalışmalarım</h2>
      <p>Doktora eğitimimde "Postmodern Türk Romanında Anlatı Teknikleri" konusunda derinlemesine araştırma yaptım. Bu süreç benim için hem teorik bilgi birikimimi artırdığım hem de özgün araştırma yapma becerisini kazandığım kritik bir dönemdi.</p>
      
      <h3>Araştırma Metodolojisi</h3>
      <p>Doktora çalışmam boyunca çeşitli araştırma metodolojilerini öğrendim ve uyguladım:</p>
      <ul>
        <li>Metin analizi teknikleri</li>
        <li>Karşılaştırmalı edebiyat yöntemleri</li>
        <li>Sosyolojik eleştiri yaklaşımları</li>
        <li>Psikanalitik edebiyat teorisi</li>
        <li>Yapısalcı ve post-yapısalcı analiz</li>
      </ul>
      
      <h3>Uluslararası Deneyimler</h3>
      <p>Doktora sürecimde altı ay boyunca Paris IV Sorbonne Üniversitesi'nde misafir araştırmacı olarak bulundum. Bu deneyim hem akademik perspektifimi genişletti hem de Fransız edebiyat geleneği hakkında derinlemesine bilgi edinmemi sağladı.</p>
      
      <h2>Akademik Başarılar</h2>
      <ul>
        <li>Lisans: Bölüm birincisi (3.78/4.00 GPA)</li>
        <li>Yüksek Lisans: Yüksek Onur (3.85/4.00 GPA)</li>
        <li>Doktora: Summa Cum Laude</li>
        <li>TÜBİTAK Doktora Bursu (2018-2021)</li>
        <li>Erasmus+ Değişim Programı Bursu (2020)</li>
      </ul>
    `,
    summary: 'Türk Dili ve Edebiyatı alanında aldığım lisans, yüksek lisans ve doktora eğitimi sürecim.'
  },
  'akademik-kariyerim': {
    title: 'Akademik Kariyerim',
    icon: BookOpenIcon,
    color: 'var(--center-primary)',
    content: `
      <h2>Öğretim Görevliliği Dönemi</h2>
      <p>Akademik kariyerime 2015 yılında İstanbul Üniversitesi'nde öğretim görevlisi olarak başladım. Bu dönemde hem lisans hem de lisansüstü seviyede dersler vererek öğretim deneyimi kazandım.</p>
      
      <h3>Verdiğim Dersler</h3>
      <ul>
        <li><strong>Türk Dili I-II:</strong> Lisans seviyesi temel dil dersleri</li>
        <li><strong>Edebiyat Tarihi:</strong> Yeni Türk Edebiyatı kronolojik gelişimi</li>
        <li><strong>Metin İncelemesi:</strong> Edebî metinlerin analiz teknikleri</li>
        <li><strong>Yazılı Anlatım:</strong> Akademik yazım becerileri</li>
        <li><strong>Araştırma Yöntemleri:</strong> Lisansüstü düzey metodoloji</li>
      </ul>
      
      <h2>Araştırma Görevliliği</h2>
      <p>2017-2021 yılları arasında araştırma görevlisi olarak çalıştığım dönemde, hem kendi doktora çalışmamı sürdürdüm hem de bölümün araştırma projelerine aktif olarak katıldım.</p>
      
      <h3>Katıldığım Projeler</h3>
      <ul>
        <li><strong>"Türk Edebiyatında Modernleşme Süreci" Projesi</strong> - TÜBİTAK destekli</li>
        <li><strong>"Çağdaş Türk Şairlerinin Arşivi" Dijitalleştirme Projesi</strong></li>
        <li><strong>"Karşılaştırmalı Edebiyat Veritabanı" Oluşturma Projesi</strong></li>
      </ul>
      
      <h2>Doçentlik Süreci</h2>
      <p>2021 yılında doktora derecemi aldıktan sonra, doçentlik başvurumu yaptım ve 2022 yılında doçent unvanını kazandım. Bu süreçte "Modern Türk Edebiyatında Anlatı Teknikleri" alanında uzmanlaştım.</p>
      
      <h3>Doçentlik Tezi</h3>
      <p>Doçentlik sürecimde sunduğum "Postmodern Türk Romanında Zaman ve Mekân Algısı" başlıklı çalışmam, alan uzmanları tarafından takdir gördü ve yayına hazırlanması önerildi.</p>
      
      <h2>Profesörlük</h2>
      <p>2024 yılında profesörlük unvanını kazanarak, akademik kariyerimde önemli bir aşamaya ulaştım. Şu anda İstanbul Üniversitesi Edebiyat Fakültesi'nde Profesör olarak görevimi sürdürüyorum.</p>
      
      <h3>Mevcut Sorumluluklar</h3>
      <ul>
        <li>Bölüm Başkan Yardımcılığı (2024-devam)</li>
        <li>Lisansüstü Eğitim Koordinatörlüğü</li>
        <li>Edebiyat Dergisi Editörlüğü</li>
        <li>Üniversite Akademik Kurulu Üyeliği</li>
      </ul>
      
      <h2>Uluslararası İş Birlikleri</h2>
      <p>Akademik kariyerim boyunca çeşitli uluslararası kuruluşlarla iş birliği içinde bulundum:</p>
      <ul>
        <li>Paris IV Sorbonne Üniversitesi - Karşılaştırmalı Edebiyat Bölümü</li>
        <li>Oxford Üniversitesi - Oriental Studies Enstitüsü</li>
        <li>Harvard Üniversitesi - Near Eastern Languages Department</li>
        <li>Leiden Üniversitesi - Turkish Studies Program</li>
      </ul>
    `,
    summary: 'Üniversitedeki öğretim görevliliğinden profesörlük sürecine kadar geçen akademik yolculuğum.'
  },
  'yayin-ve-eserlerim': {
    title: 'Yayın ve Eserlerim',
    icon: VideoCameraIcon,
    color: 'var(--works-primary)',
    content: `
      <h2>Akademik Kitaplar</h2>
      <p>Akademik kariyerim boyunca yazdığım kitaplar, edebiyat alanında önemli katkılar sağlamıştır. Her biri farklı konularda derinlemesine araştırma içeren bu eserler, hem akademik çevrelerde hem de edebiyat meraklıları arasında ilgi görmüştür.</p>
      
      <h3>Yayınlanmış Kitaplarım</h3>
      <ul>
        <li><strong>"Modern Türk Edebiyatında Kimlik Arayışı"</strong> (2022, İletişim Yayınları)
          <p>Bu kitapta, 20. yüzyıl Türk edebiyatında kimlik sorununun nasıl ele alındığını analiz ettim.</p>
        </li>
        <li><strong>"Postmodern Anlatı Teknikleri ve Türk Romanı"</strong> (2023, Yapı Kredi Yayınları)
          <p>Çağdaş Türk romanında kullanılan postmodern tekniklerin kapsamlı incelemesi.</p>
        </li>
        <li><strong>"Karşılaştırmalı Edebiyat Çalışmaları"</strong> (2024, Can Yayınları)
          <p>Türk edebiyatının dünya edebiyatları ile karşılaştırmalı analizi.</p>
        </li>
      </ul>
      
      <h2>Hakemli Dergi Makaleleri</h2>
      <p>Ulusal ve uluslararası hakemli dergilerde yayınladığım makalelerim, edebiyat araştırmalarına önemli katkılar sağlamıştır.</p>
      
      <h3>Seçilmiş Makaleler</h3>
      <ul>
        <li><strong>"Orhan Pamuk'un Romanlarında Postmodern Kimlik"</strong> - Türk Dili ve Edebiyatı Dergisi, 2021</li>
        <li><strong>"Nazım Hikmet'te Toplumsal Değişim ve Şiir"</strong> - Modern Turkish Literature Review, 2022</li>
        <li><strong>"Çağdaş Türk Şiirinde Kentleşme Teması"</strong> - Journal of Turkish Studies, 2023</li>
        <li><strong>"Dijital Çağda Edebiyat Eğitimi"</strong> - Eğitim ve Bilim Dergisi, 2024</li>
      </ul>
      
      <h2>Editörlük Çalışmaları</h2>
      <p>Çeşitli akademik yayınların editörlüğünü yaparak, edebiyat alanındaki araştırmaların yayınlanmasına katkı sağladım.</p>
      
      <h3>Editörlüğünü Yaptığım Eserler</h3>
      <ul>
        <li><strong>"Türk Edebiyatı Ansiklopedisi"</strong> (Koordinatör Editör, 2023)</li>
        <li><strong>"Modern Şiir Antolojisi"</strong> (2022)</li>
        <li><strong>"Genç Yazarlar Seçkisi"</strong> (2024)</li>
      </ul>
      
      <h2>Çeviri Çalışmaları</h2>
      <p>Fransız edebiyatından Türkçeye yaptığım çeviriler, kültürler arası köprü kurma misyonumu desteklemektedir.</p>
      
      <h3>Çeviri Kitaplar</h3>
      <ul>
        <li><strong>Roland Barthes - "Yazının Derecesi"</strong> (2021, Metis Yayınları)</li>
        <li><strong>Michel Foucault - "Edebiyat Üzerine"</strong> (2023, İthaki Yayınları)</li>
        <li><strong>Julia Kristeva - "İntertekstualite"</strong> (2024, Ayrıntı Yayınları)</li>
      </ul>
      
      <h2>Bildiri ve Konferanslar</h2>
      <p>Ulusal ve uluslararası akademik etkinliklerde sunduğum bildiriler, araştırmalarımı bilim dünyası ile paylaşmamı sağlamıştır.</p>
      
      <h3>Önemli Konferans Katılımları</h3>
      <ul>
        <li><strong>International Congress of Turkish Studies</strong> (2022, Oxford) - Davetli Konuşmacı</li>
        <li><strong>Karşılaştırmalı Edebiyat Kongresi</strong> (2023, İstanbul) - Oturum Başkanı</li>
        <li><strong>Modern Turkish Literature Symposium</strong> (2024, Harvard) - Ana Konuşmacı</li>
      </ul>
      
      <h2>Ödül ve Tanınırlık</h2>
      <ul>
        <li><strong>TDK Üstün Hizmet Ödülü</strong> (2023)</li>
        <li><strong>İstanbul Üniversitesi Bilim Ödülü</strong> (2022)</li>
        <li><strong>Türk Dil Kurumu Teşvik Ödülü</strong> (2021)</li>
        <li><strong>Yunus Emre Enstitüsü Kültür Elçisi Ödülü</strong> (2024)</li>
      </ul>
      
      <h2>Medya ve Popüler Yayınlar</h2>
      <p>Akademik çalışmalarımın yanı sıra, edebiyatı geniş kitlelere ulaştırmak için popüler yayınlarda da yer alıyorum.</p>
      
      <h3>Gazete ve Dergi Yazıları</h3>
      <ul>
        <li>Cumhuriyet Gazetesi - Haftalık edebiyat köşesi</li>
        <li>Virgül Dergisi - Aylık edebiyat değerlendirmeleri</li>
        <li>Kitap-lık Dergisi - Kitap tanıtımları ve eleştirileri</li>
      </ul>
    `,
    summary: 'Kitaplar, makaleler, bildiriler ve diğer akademik yayınlarım ile kültürel katkılarım.'
  }
};

export default function ResumeDetailPage({ slug }: ResumeDetailPageProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const data = resumeData[slug];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center font-bookmania">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: 'var(--center-secondary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }} className="text-lg">Sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center font-bookmania">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Sayfa Bulunamadı
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            Aradığınız özgeçmiş bölümü mevcut değil.
          </p>
          <Link 
            href="/"
            className="btn-elegant btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = data.icon;

  return (
    <div className="min-h-screen font-bookmania" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 mb-8 btn-elegant btn-secondary"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        {/* Page Header */}
        <div className="rounded-2xl shadow-elegant shadow-elegant-hover overflow-hidden border-2 mb-8" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--center-primary)' }}>
          <div className="p-8 lg:p-12">
            {/* Icon and Title */}
            <div className="flex items-center mb-6">
              <div 
                className="p-4 rounded-xl mr-6"
                style={{ backgroundColor: data.color, color: 'white' }}
              >
                <IconComponent className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold font-bookmania" style={{ color: 'var(--text-primary)' }}>
                  {data.title}
                </h1>
                <p className="text-xl lg:text-2xl mt-2 font-bookmania" style={{ color: 'var(--text-secondary)' }}>
                  {data.summary}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 mb-8" style={{ borderColor: 'var(--center-primary)' }}></div>

            {/* Content */}
            <div 
              className="prose prose-lg lg:prose-xl max-w-none font-bookmania article-content"
              style={{ color: 'var(--text-primary)' }}
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
