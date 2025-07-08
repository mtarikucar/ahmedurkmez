'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Makaleler', href: '/articles' },
  { name: 'Kategoriler', href: '/categories' },
  { name: 'Hakkımda', href: '/about' },
  { name: 'İletişim', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/articles?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <header 
      className="sticky top-0 z-50 shadow-md border-b-2 border-center-secondary backdrop-blur-md" 
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-6">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-3xl font-bold font-bookmania text-center-secondary hover:text-center-tertiary transition-colors">
                Ahmed Ürkmez
              </span>
            </Link>
          </div>
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'text-lg font-medium font-bookmania transition-colors hover:text-center-secondary',
                  pathname === link.href
                    ? 'text-center-secondary font-semibold'
                    : 'text-text-secondary'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="ml-8 hidden lg:block">
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center space-x-2 text-text-secondary hover:text-center-secondary transition-colors font-bookmania"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="text-sm">Ara</span>
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-center-primary/20 p-4 z-50">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Makalelerde ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-center-secondary focus:border-transparent font-bookmania"
                        autoFocus
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="ml-10 hidden lg:block">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-text-secondary hover:text-center-secondary transition-colors font-bookmania"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 border border-center-primary"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm font-bookmania text-text-primary hover:bg-center-primary hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm font-bookmania text-text-primary hover:bg-center-primary hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm font-bookmania text-text-primary hover:bg-center-primary hover:text-white transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-text-secondary hover:text-center-secondary text-sm font-medium font-bookmania transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-center-secondary hover:bg-center-tertiary text-white px-4 py-2 rounded-md text-sm font-medium font-bookmania transition-colors shadow-md"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
          <div className="ml-10 space-x-4 lg:hidden">
            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-text-secondary hover:text-center-secondary transition-colors"
            >
              <span className="sr-only">Ara</span>
              <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-text-secondary hover:text-center-secondary transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="lg:hidden px-4 pb-4 border-t border-center-primary/20">
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Makalelerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-center-secondary focus:border-transparent font-bookmania"
                />
              </div>
            </form>
          </div>
        )}

        <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden border-t border-center-primary/20">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'text-base font-medium font-bookmania transition-colors hover:text-center-secondary',
                pathname === link.href
                  ? 'text-center-secondary font-semibold'
                  : 'text-text-secondary'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-10" />
          <div 
            className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 border-l-2 border-center-secondary"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="text-xl font-bold font-bookmania text-center-secondary">Ahmed Ürkmez</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-text-secondary hover:text-center-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-center-primary/20">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 font-bookmania text-text-primary hover:bg-center-primary hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                <div className="space-y-2 py-6">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 text-sm text-text-secondary font-bookmania">
                        Hoş geldin, {user?.firstName}
                      </div>
                      <Link
                        href="/profile"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 font-bookmania text-text-primary hover:bg-center-primary hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profil
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 font-bookmania text-text-primary hover:bg-center-primary hover:text-white transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 font-bookmania text-text-primary hover:bg-center-primary hover:text-white transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 font-bookmania text-text-primary hover:bg-center-primary hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        href="/register"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white bg-center-secondary hover:bg-center-tertiary font-bookmania transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Kayıt Ol
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
