import Link from 'next/link';

const navigation = {
  main: [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Makaleler', href: '/articles' },
    { name: 'Kategoriler', href: '/categories' },
    { name: 'Hakkımda', href: '/about' },
    { name: 'İletişim', href: '/contact' },
  ],
  social: [
    {
      name: 'Twitter',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: 'Academia',
      href: '#',
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm0 4.5L8.4 7.2v1.44L12 6.48l3.6 2.16V7.2L12 4.5zm0 15L2.4 14.4V8.64L12 14.4l9.6-5.76v5.76L12 19.5z" />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)' }} className="border-t-2 border-center-secondary">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-6">
              <Link 
                href={item.href} 
                className="text-sm leading-6 font-bookmania text-text-secondary hover:text-center-secondary transition-colors"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="text-text-light hover:text-center-secondary transition-colors"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 font-bookmania text-text-secondary">
          &copy; {new Date().getFullYear()} Ahmed Ürkmez. Tüm hakları saklıdır.
        </p>
        <p className="mt-2 text-center text-xs leading-5 font-bookmania text-text-light">
          Edebiyat, akademik araştırma ve kültürel çalışmalar
        </p>
      </div>
    </footer>
  );
}
