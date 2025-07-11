'use client';

import { TrophyIcon, ChevronLeftIcon, StarIcon, AcademicCapIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function AwardsPage() {
  const router = useRouter();

  const awardCategories = [
    {
      id: 1,
      title: 'Akademik Ödüller',
      icon: AcademicCapIcon,
      color: 'from-yellow-500 to-yellow-700',
      awards: [
        {
          id: 1,
          name: 'En İyi Doktora Tezi Ödülü',
          institution: 'Türk Dil Kurumu',
          year: '2020',
          description: 'Modern Türk edebiyatında postmodern söylem analizi konulu doktora tezim ile aldığım ödül.',
          criteria: 'Orijinallik, metodoloji ve katkı açısından değerlendirildi.',
          impact: 'Akademik çevrelerde geniş yankı uyandırdı ve 15+ atıf aldı.'
        },
        {
          id: 2,
          name: 'Genç Araştırmacı Ödülü',
          institution: 'Türk Edebiyatı Vakfı',
          year: '2018',
          description: 'Edebiyat alanındaki genç araştırmacılara verilen prestijli ödül.',
          criteria: '35 yaş altı araştırmacılar arasında değerlendirildi.',
          impact: 'Akademik kariyerimde önemli bir dönüm noktası oldu.'
        },
        {
          id: 3,
          name: 'Üstün Başarı Ödülü',
          institution: 'İstanbul Üniversitesi',
          year: '2022',
          description: 'Öğretim üyeliği döneminde gösterdiğim akademik başarı için.',
          criteria: 'Yayın kalitesi, öğretim başarısı ve sosyal katkı.',
          impact: 'Üniversitede örnek öğretim üyesi olarak tanınmama vesile oldu.'
        }
      ]
    },
    {
      id: 2,
      title: 'Yayın Başarıları',
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-700',
      awards: [
        {
          id: 4,
          name: 'En Çok Atıf Alan Makale',
          institution: 'Edebiyat Fakültesi Dergisi',
          year: '2021',
          description: 'Postmodern edebiyatta kimlik sorunu başlıklı makalem en çok atıf aldı.',
          criteria: 'Yıllık atıf sayısı ve akademik etki değeri.',
          impact: '50+ atıf alarak alanında referans kaynak haline geldi.'
        },
        {
          id: 5,
          name: 'Uluslararası Yayın Ödülü',
          institution: 'International Journal of Turkish Literature',
          year: '2019',
          description: 'İngilizce yayınladığım makale ile uluslararası tanınırlık kazandım.',
          criteria: 'Uluslararası hakemli dergilerde yayın kalitesi.',
          impact: 'Türk edebiyatını dünya literatürüne tanıttı.'
        },
        {
          id: 6,
          name: 'Kitap Yayın Teşvik Ödülü',
          institution: 'Kültür ve Turizm Bakanlığı',
          year: '2023',
          description: 'Modern Türk Edebiyatı Üzerine kitabım için aldığım devlet ödülü.',
          criteria: 'Kültürel katkı ve bilimsel değer.',
          impact: 'Ders kitabı olarak 10+ üniversitede okutulmaya başlandı.'
        }
      ]
    },
    {
      id: 3,
      title: 'Eğitim ve Öğretim Ödülleri',
      icon: StarIcon,
      color: 'from-green-500 to-green-700',
      awards: [
        {
          id: 7,
          name: 'Yılın Öğretim Üyesi',
          institution: 'İstanbul Üniversitesi',
          year: '2023',
          description: 'Öğrencilerden aldığım geri dönüşler ve başarı oranları ile kazandım.',
          criteria: 'Öğrenci değerlendirmeleri ve akademik başarı.',
          impact: 'Öğretim yöntemlerim diğer bölümlerde de uygulanmaya başladı.'
        },
        {
          id: 8,
          name: 'İnovatif Eğitim Ödülü',
          institution: 'Yükseköğretim Kurulu',
          year: '2022',
          description: 'Dijital platformlarda geliştirdiğim eğitim materyalleri için.',
          criteria: 'Teknoloji entegrasyonu ve öğrenme etkinliği.',
          impact: 'Pandemi döneminde online eğitim kalitesini artırdı.'
        }
      ]
    }
  ];

  const getIconColor = (color: string) => {
    if (color.includes('yellow')) return 'text-yellow-600';
    if (color.includes('blue')) return 'text-blue-600';
    if (color.includes('green')) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
              >
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <TrophyIcon className="h-8 w-8 text-white" />
                <h1 className="heading-seljuk text-3xl text-white">Ödüller ve Başarılar</h1>
              </div>
            </div>
          </div>
          <p className="text-white/90 mt-4 text-lg font-bookmania">
            Ulusal ve uluslararası düzeyde aldığım ödüller ve akademik başarılarım
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Toplam Ödül', value: '8', icon: TrophyIcon, color: 'bg-gradient-to-r from-yellow-500 to-yellow-700' },
            { label: 'Akademik Ödül', value: '3', icon: AcademicCapIcon, color: 'bg-gradient-to-r from-blue-500 to-blue-700' },
            { label: 'Yayın Başarısı', value: '3', icon: DocumentTextIcon, color: 'bg-gradient-to-r from-green-500 to-green-700' },
            { label: 'Eğitim Ödülü', value: '2', icon: StarIcon, color: 'bg-gradient-to-r from-purple-500 to-purple-700' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`${stat.color} rounded-xl p-6 text-white text-center transition-colors duration-200 hover:opacity-90`}
            >
              <stat.icon className="h-8 w-8 mx-auto mb-3" />
              <div className="text-3xl font-bookmania-bold mb-2">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Award Categories */}
        <div className="space-y-12">
          {awardCategories.map((category, categoryIndex) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="flex items-center mb-8">
                <div className={`bg-gradient-to-r ${category.color} rounded-full p-3 mr-4`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bookmania-bold text-brown-dark">{category.title}</h2>
              </div>

              {/* Awards Grid */}
              <div className="grid gap-6">
                {category.awards.map((award, awardIndex) => (
                  <div
                    key={award.id}
                    className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/90 transition-colors duration-200"
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Award Info */}
                      <div className="md:col-span-1">
                        <div className={`bg-gradient-to-r ${category.color} rounded-lg p-4 text-white mb-4`}>
                          <h3 className="text-lg font-bookmania-bold mb-2">{award.name}</h3>
                          <p className="text-sm opacity-90 mb-2">{award.institution}</p>
                          <div className="bg-white/20 rounded px-3 py-1 text-sm inline-block">
                            {award.year}
                          </div>
                        </div>
                      </div>

                      {/* Award Details */}
                      <div className="md:col-span-2 space-y-4">
                        {/* Description */}
                        <div className="bg-brown-light/10 rounded-lg p-4">
                          <h4 className="font-bookmania-bold text-brown-dark mb-2">Açıklama</h4>
                          <p className="text-brown-dark text-sm leading-relaxed">{award.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Criteria */}
                          <div className="bg-teal-light/30 rounded-lg p-4">
                            <h4 className="font-bookmania-bold text-brown-dark mb-2">Değerlendirme Kriterleri</h4>
                            <p className="text-brown-dark text-sm">{award.criteria}</p>
                          </div>

                          {/* Impact */}
                          <div className="bg-burgundy-light/30 rounded-lg p-4">
                            <h4 className="font-bookmania-bold text-brown-dark mb-2">Etki ve Sonuçlar</h4>
                            <p className="text-brown-dark text-sm">{award.impact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline of Awards */}
        <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-white/30">
          <h2 className="text-2xl font-bookmania-bold text-brown-dark text-center mb-8">Ödül Zaman Çizelgesi</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-yellow-500 to-yellow-700"></div>
            <div className="space-y-8">
              {awardCategories.flatMap(cat => cat.awards)
                .sort((a, b) => parseInt(b.year) - parseInt(a.year))
                .map((award, index) => (
                  <div key={award.id} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className="bg-white/90 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <div className="font-bookmania-bold text-brown-dark text-lg">{award.name}</div>
                        <div className="text-brown-medium text-sm">{award.institution}</div>
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs inline-block mt-2">
                          {award.year}
                        </div>
                      </div>
                    </div>
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
