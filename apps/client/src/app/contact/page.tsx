'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset status after 3 seconds
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      title: 'E-posta',
      value: 'ahmed@example.com',
      description: 'Akademik sorularınız için bana e-posta gönderin',
      color: 'from-[#933853] to-[#7a2f44]'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Ofis',
      value: 'Üniversite Kampüsü',
      description: 'Randevu alarak ofisimde ziyaret edebilirsiniz',
      color: 'from-[#7339b3] to-[#2d8b8b]'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Yanıt Süresi',
      value: '48 saat',
      description: 'Akademik mesajlara genellikle 48 saat içinde yanıt veriyorum',
      color: 'from-[#a68e81] to-[#8b7965]'
    }
  ];

  const socialLinks = [
    {
      name: 'Google Scholar',
      url: 'https://scholar.google.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.75 2.524z" />
        </svg>
      ),
      color: 'hover:bg-[#933853]'
    },
    {
      name: 'ORCID',
      url: 'https://orcid.org',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      ),
      color: 'hover:bg-[#7339b3]'
    },
    {
      name: 'Academia.edu',
      url: 'https://academia.edu',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'hover:bg-[#a68e81]'
    }
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
          <motion.h1 variants={itemVariants} className="text-5xl font-bold text-[#2d1810] mb-4">
            İletişim
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Akademik çalışmalarım, projelerim veya işbirliği fırsatları hakkında benimle iletişime geçmekten 
            çekinmeyin. Her türlü soru ve önerinizi memnuniyetle karşılarım.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="lg:col-span-1 space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${info.color} text-white mb-4`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#2d1810] mb-2">{info.title}</h3>
                <p className="text-lg text-gray-700 font-medium mb-1">{info.value}</p>
                <p className="text-gray-600">{info.description}</p>
              </motion.div>
            ))}

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-[#2d1810] mb-4">Akademik Ağlar</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gray-100 rounded-lg text-gray-600 transition-all hover:text-white ${social.color} transform hover:scale-110`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-[#7339b3] to-[#2d8b8b] rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="font-semibold">Akademik İşbirliği İçin Müsaitim</span>
              </div>
              <p className="text-blue-100">
                Araştırma projeleri, yayın işbirlikleri ve akademik çalışmalar için 
                benimle iletişime geçebilirsiniz.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="lg:col-span-2"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold text-[#2d1810] mb-8">Mesaj Gönderin</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="email@orneksite.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Mesajınızın konusu"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Akademik çalışmalarım, projelerim veya işbirliği konularında mesajınızı yazın..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : submitStatus === 'success'
                      ? 'bg-green-500'
                      : 'bg-gradient-to-r from-[#933853] to-[#7a2f44] hover:from-[#7a2f44] hover:to-[#933853] shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gönderiliyor...
                    </div>
                  ) : submitStatus === 'success' ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Mesaj Gönderildi!
                    </div>
                  ) : (
                    'Mesaj Gönder'
                  )}
                </motion.button>
              </form>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-700">
                    Mesajınız için teşekkür ederim! En kısa sürede size geri dönüş yapacağım.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2d1810] mb-4">Sık Sorulan Sorular</h2>
            <p className="text-gray-600">Yaygın sorulara hızlı yanıtlar</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Yanıt süreniz nedir?",
                answer: "Hafta içi akademik mesajlara genellikle 48 saat içinde yanıt vermeye çalışıyorum. Acil durumlar için e-posta yoluyla ulaşabilirsiniz."
              },
              {
                question: "Araştırma işbirliği yapar mısınız?",
                answer: "Evet! Edebiyat, kültür ve karşılaştırmalı edebiyat alanlarında araştırma işbirliklerine açığım."
              },
              {
                question: "Hangi konularda uzmanınız?",
                answer: "Modern Türk edebiyatı, karşılaştırmalı edebiyat, kültür araştırmaları ve eleştiri teorisi alanlarında uzmanım."
              },
              {
                question: "Öğrenci danışmanlığı yapıyor musunuz?",
                answer: "Evet, lisans ve lisansüstü öğrencilerine tez danışmanlığı yapıyorum. Başvuru süreçleri için iletişime geçebilirsiniz."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-lg p-6 shadow-lg"
              >
                <h3 className="font-semibold text-[#2d1810] mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
