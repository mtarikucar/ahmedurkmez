'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Decorative Seljuk Pattern */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-teal-light rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-burgundy-light rounded-full mt-0.5 animate-pulse delay-75"></div>
            <div className="w-4 h-4 bg-brown-light rounded-full -mt-0.5 animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-burgundy-light rounded-full mt-0.5 animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-teal-light rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="heading-seljuk text-3xl lg:text-4xl mb-4">
            Hesap oluşturun
          </h2>
          <p className="text-sm font-bookmania text-brown-light">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="font-bookmania-medium text-teal-dark hover:text-burgundy-medium transition-colors duration-300">
              Giriş yapın
            </Link>
          </p>
        </div>
        <div className="card-seljuk p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                    Ad
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-teal-light bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] text-brown-dark placeholder:text-brown-light font-bookmania focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium transition-all duration-300"
                  placeholder="Adınız"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                    Soyad
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-teal-light bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] text-brown-dark placeholder:text-brown-light font-bookmania focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium transition-all duration-300"
                    placeholder="Soyadınız"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                  E-posta adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-teal-light bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] text-brown-dark placeholder:text-brown-light font-bookmania focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium transition-all duration-300"
                  placeholder="E-posta adresiniz"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
              <div>
                <label htmlFor="password" className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-teal-light bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] text-brown-dark placeholder:text-brown-light font-bookmania focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium transition-all duration-300"
                  placeholder="Şifreniz"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bookmania-medium text-brown-dark mb-2">
                  Şifre Tekrarı
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-teal-light bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] text-brown-dark placeholder:text-brown-light font-bookmania focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium transition-all duration-300"
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-gradient-to-r from-burgundy-light/20 to-burgundy-medium/20 border-2 border-burgundy-medium p-4">
                <div className="text-sm font-bookmania text-burgundy-dark">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
