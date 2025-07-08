'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
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
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <header className="bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-tertiary)] shadow-lg border-b-2 border-teal-light">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-6">
          <div className="flex items-center">
            <Link href="/" className="group">
              <span className="heading-seljuk-large text-3xl lg:text-4xl transition-all duration-300 group-hover:text-teal-dark">
                Ahmed Ürkmez
              </span>
              <div className="h-0.5 bg-gradient-teal mt-1 w-0 group-hover:w-full transition-all duration-500"></div>
            </Link>
          </div>
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'text-base font-bookmania-medium transition-all duration-300 hover:text-teal-dark hover:scale-105 relative group',
                  pathname === link.href
                    ? 'text-teal-dark font-bookmania-bold'
                    : 'text-brown-dark'
                )}
              >
                {link.name}
                <div className={clsx(
                  'absolute -bottom-1 left-0 h-0.5 bg-gradient-teal transition-all duration-300',
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                )}></div>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="ml-10 hidden lg:block">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center space-x-2 text-brown-dark hover:text-teal-dark transition-all duration-300 group"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-bookmania-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] rounded-lg shadow-xl border border-teal-light py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm font-bookmania text-brown-dark hover:bg-teal-light hover:text-teal-dark transition-all duration-300"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm font-bookmania text-brown-dark hover:bg-burgundy-light hover:text-white transition-all duration-300"
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
                      className="block w-full text-left px-4 py-2 text-sm font-bookmania text-brown-dark hover:bg-burgundy-medium hover:text-white transition-all duration-300"
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
                  className="btn-secondary text-sm"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
          <div className="ml-10 space-x-4 lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-brown-dark hover:text-teal-dark transition-colors duration-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden border-t border-teal-light">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'text-base font-bookmania-medium transition-all duration-300 hover:text-teal-dark hover:scale-105',
                pathname === link.href
                  ? 'text-teal-dark font-bookmania-bold'
                  : 'text-brown-dark'
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
          <div className="fixed inset-0 z-10 bg-brown-dark bg-opacity-50 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] px-6 py-6 sm:max-w-sm border-l-2 border-teal-light">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="heading-seljuk text-xl">Ahmed Ürkmez</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-brown-dark hover:text-teal-dark transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-teal-light/30">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-bookmania-medium leading-7 transition-all duration-300",
                        pathname === item.href
                          ? "bg-teal-light text-teal-dark font-bookmania-bold"
                          : "text-brown-dark hover:bg-teal-light/50 hover:text-teal-dark"
                      )}
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
                      <div className="px-3 py-2 text-sm font-bookmania text-brown-light">
                        Hoş geldin, {user?.firstName}
                      </div>
                      <Link
                        href="/profile"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-bookmania-medium leading-7 text-brown-dark hover:bg-teal-light/50 hover:text-teal-dark transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profil
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-bookmania-medium leading-7 text-brown-dark hover:bg-burgundy-light hover:text-white transition-all duration-300"
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
                        className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-bookmania-medium leading-7 text-brown-dark hover:bg-burgundy-medium hover:text-white transition-all duration-300"
                      >
                        Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-bookmania-medium leading-7 text-brown-dark hover:bg-teal-light/50 hover:text-teal-dark transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        href="/register"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-bookmania-medium leading-7 text-white bg-gradient-primary hover:bg-gradient-teal-dark transition-all duration-300"
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
