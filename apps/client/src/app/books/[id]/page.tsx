'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { booksAPI } from '@/lib/api';
import EBookViewer from '@/components/ui/EBookViewer';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarIcon,
  TagIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface Book {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  content: string;
  bookType: string;
  pdfFile?: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEBookViewer, setShowEBookViewer] = useState(false);
  const [currentEBook, setCurrentEBook] = useState<{url: string, title: string} | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBook(params.id as string);
    }
  }, [params.id]);

  const fetchBook = async (id: string) => {
    try {
      setLoading(true);
      const response = await booksAPI.getById(parseInt(id));
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBookTypeLabel = (type: string) => {
    return type === 'theoretical' ? 'Teorik' : 'Pratik';
  };

  const handleOpenEBook = (pdfUrl: string, title: string) => {
    setCurrentEBook({ url: pdfUrl, title });
    setShowEBookViewer(true);
  };

  // Add event listener for embedded e-book buttons
  useEffect(() => {
    const handleEBookClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('ebook-open-btn')) {
        e.preventDefault();
        const src = target.getAttribute('data-src');
        const title = target.getAttribute('data-title');
        if (src && title) {
          setCurrentEBook({ url: src, title });
          setShowEBookViewer(true);
        }
      }
    };

    document.addEventListener('click', handleEBookClick);
    return () => document.removeEventListener('click', handleEBookClick);
  }, [book]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Kitap bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aradığınız kitap mevcut değil veya kaldırılmış olabilir.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-teal-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 truncate max-w-md">
                  {book.title}
                </h1>
                <p className="text-sm text-gray-600">Kitap Detayı</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Book Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpenIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {book.title}
                    </h1>
                    {book.subtitle && (
                      <h2 className="text-lg text-gray-600 mb-3">
                        {book.subtitle}
                      </h2>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(book.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {book.viewCount} görüntülenme
                      </div>
                      {book.category && (
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 mr-1" />
                          {book.category.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Description */}
              {book.description && (
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Açıklama</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Book Content */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">İçerik</h3>
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: book.content }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kitap Bilgileri</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tür:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {getBookTypeLabel(book.bookType)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Yayın Tarihi:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {formatDate(book.createdAt)}
                  </span>
                </div>
                {book.category && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Kategori:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {book.category.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* E-Book Viewer Preview */}
            {book.pdfFile && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  E-Kitap
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 text-center shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer" 
                     onClick={() => handleOpenEBook(book.pdfFile!, book.title)}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 shadow-lg">
                    <BookOpenIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {book.title}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    İnteraktif sayfa çevirme ile okuyun
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg hover:transform hover:translateY(-1px)">
                    E-Kitabı Aç
                  </button>
                </div>
                
                <div className="mt-4">
                  <a
                    href={book.pdfFile}
                    download={book.title}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                    PDF İndir
                  </a>
                </div>
              </div>
            )}

            {/* Tags */}
            {book.tags && book.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* E-Book Viewer Modal */}
      {showEBookViewer && currentEBook && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={() => setShowEBookViewer(false)}
            className="absolute top-4 right-4 z-60 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <EBookViewer
            pdfUrl={currentEBook.url}
            title={currentEBook.title}
            onClose={() => setShowEBookViewer(false)}
          />
        </div>
      )}
    </div>
  );
}
