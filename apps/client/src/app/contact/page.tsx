'use client';

import { useState } from 'react';
import { contactAPI } from '@/lib/api';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactAPI.create(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mesaj gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              İletişim
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Sorularınız, önerileriniz veya işbirliği teklifleriniz için benimle iletişime geçin
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <EnvelopeIcon className="h-6 w-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">E-posta</h3>
                  <p className="text-gray-600">ahmed.urkmez@example.com</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Akademik işbirliği ve genel sorular için
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <PhoneIcon className="h-6 w-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Telefon</h3>
                  <p className="text-gray-600">+90 (XXX) XXX XX XX</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mesai saatleri içinde ulaşabilirsiniz
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPinIcon className="h-6 w-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Adres</h3>
                  <p className="text-gray-600">
                    Üniversite Adı<br />
                    Fakülte/Bölüm<br />
                    Şehir, Türkiye
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Akademik İşbirliği</h3>
              <p className="text-gray-600">
                Araştırma projeleri, ortak yayınlar veya akademik etkinlikler 
                konusunda işbirliği yapmak istiyorsanız, lütfen detaylı bilgi 
                ile birlikte iletişime geçin.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mesaj Gönder</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">
                  Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağım.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-posta *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Konu Türü
                </label>
                <select
                  id="type"
                  name="type"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="general">Genel Soru</option>
                  <option value="academic">Akademik İşbirliği</option>
                  <option value="research">Araştırma Projesi</option>
                  <option value="publication">Yayın Teklifi</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Konu *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Mesaj *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
