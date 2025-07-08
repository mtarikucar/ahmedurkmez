'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
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
            Hesabınıza giriş yapın
          </h2>
          <p className="text-sm font-bookmania text-brown-light">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="font-bookmania-medium text-teal-dark hover:text-burgundy-medium transition-colors duration-300">
              Kayıt olun
            </Link>
          </p>
        </div>
        <div className="card-seljuk p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                  placeholder="E-posta adresinizi girin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-teal-light bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] text-brown-dark placeholder:text-brown-light font-bookmania focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-teal-medium transition-all duration-300"
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-burgundy-light/20 border border-burgundy-medium p-4">
                <div className="text-sm font-bookmania text-burgundy-dark">{error}</div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base"
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
