'use client';

import { AcademicCapIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function EducationPage() {
  const router = useRouter();

  const educationData = [
    {
      id: 1,
      degree: 'Doktora',
      field: 'Türk Dili ve Edebiyatı',
      university: 'İstanbul Üniversitesi',
      year: '2015-2020',
      thesis: 'Modern Türk Edebiyatında Postmodern Söylem Analizi',
      supervisor: 'Prof. Dr. Mehmet Kaplan',
      grade: 'Yüksek Onur',
      description: 'Doktora tezimde, 1980 sonrası Türk edebiyatında postmodern anlatı tekniklerinin kullanımını ve bu tekniklerin geleneksel anlatı yapılarına etkisini inceledim.',
      achievements: [
        'Tez savunmasında tam not',
        'En iyi doktora tezi ödülü',
        'Uluslararası konferanslarda sunum'
      ]
    },
    {
      id: 2,
      degree: 'Yüksek Lisans',
      field: 'Türk Dili ve Edebiyatı',
      university: 'Ankara Üniversitesi',
      year: '2013-2015',
      thesis: 'Cumhuriyet Dönemi Şiirinde Modernleşme Temelleri',
      supervisor: 'Doç. Dr. Ayşe Sırrı',
      grade: 'Teşekkür',
      description: 'Yüksek lisans çalışmamda, Cumhuriyet döneminin ilk yıllarında şiirde görülen modernleşme eğilimlerini ve bu eğilimlerin toplumsal dönüşümle ilişkisini araştırdım.',
      achievements: [
        'Yüksek lisans tez yarışması 2. lik',
        'Akademik dergilerde makale yayınları',
        'Bölüm birinciliği'
      ]
    },
    {
      id: 3,
      degree: 'Lisans',
      field: 'Türk Dili ve Edebiyatı',
      university: 'Boğaziçi Üniversitesi',
      year: '2009-2013',
      thesis: 'Tanzimat Dönemi Romanında Kadın Figürü',
      supervisor: 'Prof. Dr. Zehra Toska',
      grade: 'Onur Öğrencisi',
      description: 'Lisans bitirme tezimde, Tanzimat döneminde yazılan romanlarda kadın karakterlerin toplumsal konumunu ve bu karakterlerin dönemin değişen değer yargılarını nasıl yansıttığını inceledim.',
      achievements: [
        'Fakülte birinciliği',
        'Rektörlük onur ödülü',
        'Erasmus değişim programı'
      ]
    }
  ];

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-gradient-brown shadow-xl">
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
                <AcademicCapIcon className="h-8 w-8 text-white" />
                <h1 className="heading-seljuk text-3xl text-white">Eğitim Hayatı</h1>
              </div>
            </div>
          </div>
          <p className="text-white/90 mt-4 text-lg font-bookmania">
            Akademik eğitim sürecim ve aldığım derecelerin detayları
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {educationData.map((education, index) => (
            <div
              key={education.id}
              className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl p-8 hover:bg-white/90 transition-colors duration-200"
            >
              <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column - Basic Info */}
                <div className="md:col-span-1">
                  <div className="bg-gradient-teal rounded-lg p-6 text-white">
                    <h2 className="text-2xl font-bookmania-bold mb-2">{education.degree}</h2>
                    <p className="text-lg mb-2">{education.field}</p>
                    <p className="text-base opacity-90 mb-4">{education.university}</p>
                    <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                      <span className="font-bookmania-bold">{education.year}</span>
                    </div>
                    <div className="mt-4 bg-white/20 rounded-lg px-4 py-2 text-center">
                      <span className="text-sm">Başarı Derecesi</span>
                      <div className="font-bookmania-bold">{education.grade}</div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2 space-y-6">
                  {/* Thesis Info */}
                  <div className="bg-gradient-burgundy rounded-lg p-6 text-white">
                    <h3 className="text-xl font-bookmania-bold mb-3">Tez Bilgileri</h3>
                    <p className="text-lg italic mb-2">"{education.thesis}"</p>
                    <p className="text-sm opacity-90">Danışman: {education.supervisor}</p>
                  </div>

                  {/* Description */}
                  <div className="bg-brown-light/20 rounded-lg p-6">
                    <h3 className="text-xl font-bookmania-bold text-brown-dark mb-3">Açıklama</h3>
                    <p className="text-brown-dark leading-relaxed font-medium">{education.description}</p>
                  </div>

                  {/* Achievements */}
                  <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="text-xl font-bookmania-bold text-brown-dark mb-4">Başarılar</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {education.achievements.map((achievement, idx) => (
                        <div
                          key={idx}
                          className="bg-teal-light/30 rounded-lg p-3 text-brown-dark text-center transition-colors duration-200 hover:bg-teal-light/40"
                        >
                          <span className="text-sm font-bookmania font-medium">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Summary */}
        <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-white/30">
          <h2 className="text-2xl font-bookmania-bold text-brown-dark text-center mb-8">Eğitim Zaman Çizelgesi</h2>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {educationData.reverse().map((education, index) => (
              <div key={education.id} className="text-center">
                <div className="bg-gradient-teal rounded-full w-16 h-16 flex items-center justify-center text-white font-bookmania-bold text-lg mb-2 mx-auto">
                  {education.year.split('-')[1]}
                </div>
                <h3 className="font-bookmania-bold text-brown-dark">{education.degree}</h3>
                <p className="text-sm text-brown-medium">{education.university}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
