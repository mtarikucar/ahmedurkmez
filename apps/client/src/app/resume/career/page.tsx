'use client';

import { BookOpenIcon, ChevronLeftIcon, BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function CareerPage() {
  const router = useRouter();

  const careerData = [
    {
      id: 1,
      position: 'Profesör',
      department: 'Türk Dili ve Edebiyatı Bölümü',
      institution: 'İstanbul Üniversitesi',
      startDate: '2022',
      endDate: 'Devam Ediyor',
      description: 'Bölüm başkanı yardımcılığı görevini de yürütmekteyim. Lisans ve lisansüstü düzeyde dersler vermekte, tez danışmanlıkları yapmaktayım.',
      responsibilities: [
        'Lisans ve lisansüstü ders verme',
        'Tez danışmanlığı (12 aktif öğrenci)',
        'Bölüm yönetim kurulu üyeliği',
        'Akademik komisyonlarda görev alma',
        'Ulusal ve uluslararası projelerde yer alma'
      ],
      achievements: [
        '15+ tez danışmanlığı tamamladı',
        '25+ bilimsel makale yayınladı',
        'Bölümde eğitim reformu başlattı'
      ]
    },
    {
      id: 2,
      position: 'Doçent',
      department: 'Türk Dili ve Edebiyatı Bölümü',
      institution: 'Ankara Üniversitesi',
      startDate: '2018',
      endDate: '2022',
      description: 'Doçentlik dönemimde araştırma faaliyetlerimi yoğunlaştırdım. Modern Türk edebiyatı alanında önemli çalışmalar yürüttüm.',
      responsibilities: [
        'Lisans düzeyinde ders verme',
        'Yüksek lisans dersleri',
        'Araştırma projesi yürütme',
        'Akademik yayın faaliyetleri',
        'Konferans organizasyonları'
      ],
      achievements: [
        'Doçentlik unvanını aldı',
        '10+ tez danışmanlığı',
        'TÜBİTAK projesi yürüttü',
        'Uluslararası işbirliği geliştirdi'
      ]
    },
    {
      id: 3,
      position: 'Doktor Öğretim Üyesi',
      department: 'Türk Dili ve Edebiyatı Bölümü',
      institution: 'Boğaziçi Üniversitesi',
      startDate: '2015',
      endDate: '2018',
      description: 'Akademik kariyerimin başlangıç dönemi. Öğretim becerilerin geliştirirken araştırma alanımı da şekillendirdim.',
      responsibilities: [
        'Lisans dersleri',
        'Öğrenci danışmanlığı',
        'Araştırma faaliyetleri',
        'Akademik yazım',
        'Seminer organizasyonu'
      ],
      achievements: [
        'İlk akademik makalelerini yayınladı',
        'Genç araştırmacı ödülü aldı',
        'Eğitim kalitesini artırdı'
      ]
    },
    {
      id: 4,
      position: 'Araştırma Görevlisi',
      department: 'Türk Dili ve Edebiyatı Bölümü',
      institution: 'İstanbul Üniversitesi',
      startDate: '2013',
      endDate: '2015',
      description: 'Akademik hayatıma araştırma görevlisi olarak başladım. Bu dönemde doktora eğitimimi de sürdürdüm.',
      responsibilities: [
        'Araştırma projeleri',
        'Ders asistanlığı',
        'Doktora çalışmaları',
        'Veri toplama ve analiz',
        'Literatür taraması'
      ],
      achievements: [
        'Doktora programını başarıyla tamamladı',
        'İlk akademik yayınları',
        'Konferanslarda sunum yaptı'
      ]
    }
  ];

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Profesör':
        return 'from-purple-600 to-purple-800';
      case 'Doçent':
        return 'from-blue-600 to-blue-800';
      case 'Doktor Öğretim Üyesi':
        return 'from-green-600 to-green-800';
      case 'Araştırma Görevlisi':
        return 'from-orange-600 to-orange-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-gradient-teal shadow-xl">
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
                <BookOpenIcon className="h-8 w-8 text-white" />
                <h1 className="heading-seljuk text-3xl text-white">Akademik Kariyer</h1>
              </div>
            </div>
          </div>
          <p className="text-white/90 mt-4 text-lg font-bookmania">
            Öğretim üyeliği ve araştırma deneyimlerim
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Career Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-medium to-burgundy-medium"></div>
          
          <div className="space-y-12">
            {careerData.map((career, index) => (
              <div
                key={career.id}
                className={`relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 bg-gradient-to-r from-teal-medium to-burgundy-medium rounded-full border-4 border-white shadow-lg z-10"></div>
                
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <div className="bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/90 transition-colors duration-200">
                    {/* Position Header */}
                    <div className={`bg-gradient-to-r ${getPositionColor(career.position)} rounded-lg p-4 text-white mb-4`}>
                      <h2 className="text-xl font-bookmania-bold mb-1">{career.position}</h2>
                      <div className="flex items-center space-x-2 text-sm opacity-90">
                        <BuildingOfficeIcon className="h-4 w-4" />
                        <span>{career.institution}</span>
                      </div>
                      <p className="text-sm mt-1">{career.department}</p>
                      <div className="mt-2 bg-white/20 rounded px-3 py-1 text-xs inline-block">
                        {career.startDate} - {career.endDate}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-brown-dark leading-relaxed font-medium">{career.description}</p>
                    </div>

                    {/* Responsibilities */}
                    <div className="mb-4">
                      <h3 className="font-bookmania-bold text-brown-dark mb-2 flex items-center">
                        <UserGroupIcon className="h-5 w-5 mr-2" />
                        Sorumluluklar
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {career.responsibilities.map((responsibility, idx) => (
                          <div
                            key={idx}
                            className="bg-teal-light/30 rounded-lg px-3 py-2 text-sm text-brown-dark font-medium"
                          >
                            • {responsibility}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="font-bookmania-bold text-brown-dark mb-2">Başarılar</h3>
                      <div className="space-y-2">
                        {career.achievements.map((achievement, idx) => (
                          <div
                            key={idx}
                            className="bg-burgundy-light/30 rounded-lg px-3 py-2 text-sm text-brown-dark font-medium"
                          >
                            ✓ {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Statistics */}
        <div className="mt-16 bg-white/50 backdrop-blur-sm rounded-xl p-8 border border-white/30">
          <h2 className="text-2xl font-bookmania-bold text-brown-dark text-center mb-8">Kariyer İstatistikleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Toplam Deneyim', value: '10+ Yıl', color: 'bg-gradient-teal' },
              { label: 'Tez Danışmanlığı', value: '25+', color: 'bg-gradient-burgundy' },
              { label: 'Yayın Sayısı', value: '40+', color: 'bg-gradient-brown' },
              { label: 'Proje Sayısı', value: '8', color: 'bg-gradient-to-r from-teal-medium to-burgundy-medium' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`${stat.color} rounded-lg p-6 text-white text-center hover:opacity-90 transition-opacity duration-200`}
              >
                <div className="text-2xl font-bookmania-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
