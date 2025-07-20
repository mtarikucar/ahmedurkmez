'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  const academicSkills = [
    { name: 'Türk Dili ve Edebiyatı', level: 95, color: 'from-[#a68e81] to-[#8b7965]' },
    { name: 'Karşılaştırmalı Edebiyat', level: 90, color: 'from-[#b4987a] to-[#933853]' },
    { name: 'Kültür Araştırmaları', level: 85, color: 'from-[#7339b3] to-[#2d8b8b]' },
    { name: 'Eleştiri Teorisi', level: 88, color: 'from-[#933853] to-[#7a2f44]' },
    { name: 'Akademik Yazım', level: 92, color: 'from-[#8b7965] to-[#6f6048]' },
    { name: 'Çeviri Çalışmaları', level: 80, color: 'from-[#2d8b8b] to-[#1f5f5f]' },
    { name: 'Araştırma Metodolojisi', level: 85, color: 'from-[#7a2f44] to-[#933853]' },
    { name: 'Eğitim ve Öğretim', level: 90, color: 'from-[#6f6048] to-[#a68e81]' },
  ];

  const academicExperience = [
    {
      title: 'Doktor Öğretim Üyesi',
      institution: 'Üniversite Adı',
      period: '2020 - Günümüz',
      description: 'Türk Dili ve Edebiyatı bölümünde lisans ve lisansüstü dersler vermekte, tez danışmanlıkları yapmaktayım.',
      areas: ['Modern Türk Edebiyatı', 'Karşılaştırmalı Edebiyat', 'Kültürel Çalışmalar']
    },
    {
      title: 'Araştırma Görevlisi',
      institution: 'Üniversite Adı',
      period: '2015 - 2020',
      description: 'Doktora eğitimi süresince araştırma projelerinde yer aldım ve çeşitli derslerde asistanlık yaptım.',
      areas: ['Edebiyat Teorisi', 'Türk Romanı', 'Metin Çözümleme']
    },
    {
      title: 'Türkçe Öğretmeni',
      institution: 'Özel Okul',
      period: '2013 - 2015',
      description: 'Lise düzeyinde Türk Dili ve Edebiyatı dersleri verdim, öğrencilerin dil becerilerini geliştirdim.',
      areas: ['Dil Becerileri', 'Edebiyat Öğretimi', 'Yaratıcı Yazma']
    }
  ];

  const education = [
    {
      degree: 'Doktora - Türk Dili ve Edebiyatı',
      school: 'Üniversite Adı',
      period: '2015 - 2019',
      thesis: 'Modern Türk Edebiyatında Kimlik Arayışı'
    },
    {
      degree: 'Yüksek Lisans - Türk Dili ve Edebiyatı',
      school: 'Üniversite Adı',
      period: '2013 - 2015',
      thesis: 'Çağdaş Türk Şiirinde Toplumsal Değişim'
    },
    {
      degree: 'Lisans - Türk Dili ve Edebiyatı',
      school: 'Üniversite Adı',
      period: '2009 - 2013',
      gpa: '3.8/4.0'
    }
  ];

  const achievements = [
    'Ulusal ve uluslararası dergilerde 25+ akademik makale yayınladım',
    'TÜBİTAK destekli 2 araştırma projesinde yürütücü olarak görev aldım',
    '5 uluslararası konferansta bildiri sundum',
    'Türk Edebiyatı alanında 2 kitap yayınladım',
    'Çeşitli üniversitelerde misafir öğretim üyesi olarak ders verdim',
    'Edebiyat eleştirisi alanında ödül aldım'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f0] via-[#f1eedc] to-[#ede9d7] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="relative inline-block mb-8">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-[#a68e81] to-[#933853] p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#a68e81] to-[#933853] flex items-center justify-center text-white text-4xl font-bold">
                  AU
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl font-bold text-gray-900 mb-4">
            Dr. Ahmed Ürkmez
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Türk Dili ve Edebiyatı alanında uzmanlaşmış bir akademisyen olarak, modern Türk edebiyatı, 
            karşılaştırmalı edebiyat ve kültürel çalışmalar konularında araştırmalar yürütmekteyim.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
            <a href="mailto:ahmed@example.com" className="bg-[#933853] text-white px-6 py-3 rounded-lg hover:bg-[#7a2f44] transition-colors">
              İletişime Geç
            </a>
            <a href="/cv.pdf" className="border border-[#933853] text-[#933853] px-6 py-3 rounded-lg hover:bg-[#f1eedc] transition-colors">
              CV İndir
            </a>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Me */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold text-[#2d1810] mb-6 flex items-center">
                <div className="w-8 h-8 bg-[#933853] rounded-lg mr-3 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                Hakkımda
              </motion.h2>
              
              <motion.div variants={itemVariants} className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  Türk Dili ve Edebiyatı alanında 10+ yıllık akademik deneyime sahip bir öğretim üyesi olarak, 
                  hem araştırmacı hem de eğitimci kimliğimle edebiyat dünyasına katkıda bulunmaya devam ediyorum.
                </p>
                <p className="mb-4">
                  Araştırma alanlarım arasında modern Türk edebiyatı, karşılaştırmalı edebiyat, kültürel çalışmalar 
                  ve eleştiri teorisi yer almaktadır. Özellikle kimlik, toplumsal değişim ve edebiyatın toplumsal 
                  işlevi konularında derinlemesine çalışmalar yürütmekteyim.
                </p>
                <p>
                  Akademik çalışmalarımın yanında, edebiyat sevgisini genç nesillere aktarma konusunda da büyük 
                  bir tutku duyuyorum. Öğrencilerimle birlikte edebiyatın hayatımızdaki yerini keşfetmeye devam ediyoruz.
                </p>
              </motion.div>
            </motion.section>

            {/* Experience */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold text-[#2d1810] mb-6 flex items-center">
                <div className="w-8 h-8 bg-[#7339b3] rounded-lg mr-3 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                Akademik Deneyim
              </motion.h2>
              
              <div className="space-y-6">
                {academicExperience.map((exp, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="border-l-4 border-[#a68e81] pl-6 pb-6 last:pb-0"
                  >
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                      <span className="text-sm text-[#933853] bg-[#f1eedc] px-3 py-1 rounded-full">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{exp.institution}</p>
                    <p className="text-gray-600 mb-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.areas.map((area, areaIndex) => (
                        <span
                          key={areaIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Achievements */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold text-[#2d1810] mb-6 flex items-center">
                <div className="w-8 h-8 bg-[#b4987a] rounded-lg mr-3 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                Akademik Başarılar
              </motion.h2>
              
              <motion.ul variants={itemVariants} className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-[#2d1810] mb-6 flex items-center">
                <div className="w-6 h-6 bg-[#a68e81] rounded mr-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                Uzmanlık Alanları
              </motion.h2>
              
              <div className="space-y-4">
                {academicSkills.map((skill, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${skill.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Education */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-[#2d1810] mb-6 flex items-center">
                <div className="w-6 h-6 bg-[#2d8b8b] rounded mr-3 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z" />
                  </svg>
                </div>
                Eğitim
              </motion.h2>
              
              {education.map((edu, index) => (
                <motion.div key={index} variants={itemVariants} className="border-l-4 border-[#7339b3] pl-4 mb-6 last:mb-0">
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.period}</p>
                  {edu.thesis && <p className="text-sm text-[#7339b3] mt-1">Tez: {edu.thesis}</p>}
                  {edu.gpa && <p className="text-sm text-[#7339b3] mt-1">Not Ortalaması: {edu.gpa}</p>}
                </motion.div>
              ))}
            </motion.section>

            {/* Contact Info */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="bg-gradient-to-r from-[#933853] to-[#7a2f44] rounded-2xl p-6 text-white shadow-lg"
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6">İletişime Geçin</motion.h2>
              
              <motion.div variants={itemVariants} className="space-y-4">
                <a href="mailto:ahmed@example.com" className="flex items-center group">
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  ahmed@example.com
                </a>
                
                <a href="https://scholar.google.com" className="flex items-center group">
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z" />
                  </svg>
                  Google Scholar
                </a>
                
                <a href="https://orcid.org" className="flex items-center group">
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  ORCID
                </a>
              </motion.div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
