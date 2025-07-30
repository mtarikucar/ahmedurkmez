'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { articlesAPI } from '@/lib/api';
import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  EyeIcon, 
  HeartIcon,
  ShareIcon,
  CalendarIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import EBookViewer from '@/components/ui/EBookViewer';

interface ArticleDetailPageProps {
  slug: string;
}

export default function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [showEBookViewer, setShowEBookViewer] = useState(false);
  const [currentEBook, setCurrentEBook] = useState<{url: string, title: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Gerçek API'den makale çek
        const response = await articlesAPI.getBySlug(slug);
        setArticle(response.data);
        setLikeCount(response.data.likeCount || 0);
        
        // Check if user has already liked this article (from localStorage for demo)
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        setIsLiked(likedArticles.includes(response.data.id));
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Makale yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

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
  }, [article]); // Re-run when article content changes

  // Like functionality
  const handleLike = async () => {
    if (!article || isLiking) return;

    try {
      setIsLiking(true);
      
      if (isLiked) {
        // Unlike (decrease count)
        setLikeCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
        
        // Remove from localStorage
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        const updatedLiked = likedArticles.filter((id: number) => id !== article.id);
        localStorage.setItem('likedArticles', JSON.stringify(updatedLiked));
      } else {
        // Like (increase count and call API)
        await articlesAPI.like(article.id);
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
        
        // Add to localStorage
        const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        likedArticles.push(article.id);
        localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
      }
    } catch (error) {
      console.error('Error liking article:', error);
      // Revert optimistic update on error
      if (isLiked) {
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      } else {
        setLikeCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      }
    } finally {
      setIsLiking(false);
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (!article) return;

    const articleUrl = `${window.location.origin}/articles/${article.slug}`;
    const shareData = {
      title: article.title,
      text: article.excerpt || `${article.title} - Ahmed Ürkmez`,
      url: articleUrl,
    };

    try {
      setIsSharing(true);

      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareMessage('Makale başarıyla paylaşıldı!');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(articleUrl);
        setShareMessage('Makale linki panoya kopyalandı!');
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setShareMessage(''), 3000);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing article:', error);
        setShareMessage('Paylaşım sırasında bir hata oluştu.');
        setTimeout(() => setShareMessage(''), 3000);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Social media share functions
  const shareToTwitter = () => {
    if (!article) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    if (!article) return;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=580,height=296');
  };

  const shareToLinkedIn = () => {
    if (!article) return;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=520,height=570');
  };

  const shareToWhatsApp = () => {
    if (!article) return;
    const text = `${article.title} - ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center font-bookmania">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderColor: 'var(--center-secondary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }} className="text-lg">Makale yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center font-bookmania">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Makale Bulunamadı
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            {error || 'Aradığınız makale mevcut değil.'}
          </p>
          <Link 
            href="/articles"
            className="btn-elegant btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Makalelere Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-bookmania" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link 
          href="/articles"
          className="inline-flex items-center space-x-2 mb-8 btn-elegant btn-secondary"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Makalelere Dön</span>
        </Link>

        {/* Article Header */}
        <article className="rounded-2xl shadow-elegant shadow-elegant-hover overflow-hidden border-2" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--center-primary)' }}>
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Meta and Title */}
          <div className="p-8 lg:p-12">
            {/* Category */}
            <div className="mb-6">
              <Link
                href={`/categories/${article.category.slug}`}
                className="inline-block px-4 py-2 rounded-full text-white text-sm font-semibold font-bookmania transition-colors hover:opacity-80"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-bold mb-6 font-bookmania leading-tight" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl lg:text-2xl mb-8 font-bookmania leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {article.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm" style={{ color: 'var(--text-light)' }}>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5" />
                <time className="font-bookmania">
                  {formatDistanceToNow(new Date(article.createdAt), {
                    addSuffix: true,
                    locale: tr
                  })}
                </time>
              </div>
              
              <div className="flex items-center space-x-2">
                <EyeIcon className="h-5 w-5" />
                <span className="font-bookmania">{article.viewCount} görüntüleme</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {isLiked ? (
                  <HeartIconSolid className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span className="font-bookmania">{likeCount} beğeni</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span className="font-bookmania">~{Math.ceil(article.content.length / 1000)} dk okuma</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 mb-8" style={{ borderColor: 'var(--center-primary)' }}></div>

            {/* Article Content */}
            <div 
              className="prose prose-lg lg:prose-xl max-w-none font-bookmania article-content"
              style={{ color: 'var(--text-primary)' }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />


            {/* Actions */}
            <div className="mt-12 pt-8 border-t-2" style={{ borderColor: 'var(--center-primary)' }}>
              {/* Share Message */}
              {shareMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2" />
                  {shareMessage}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`btn-elegant flex items-center space-x-2 transition-all duration-300 ${
                      isLiked 
                        ? 'btn-secondary bg-red-50 hover:text-white' 
                        : 'btn-secondary hover:bg-red-50 hover:text-red-600'
                    } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLiked ? (
                      <HeartIconSolid className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                    <span>{isLiked ? 'Beğenildi' : 'Beğen'} ({likeCount})</span>
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={handleShare}
                      disabled={isSharing}
                      className={`btn-elegant btn-secondary flex items-center space-x-2 ${
                        isSharing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ShareIcon className="h-5 w-5" />
                      <span>{isSharing ? 'Paylaşılıyor...' : 'Paylaş'}</span>
                    </button>
                  </div>
                </div>

                {/* Social Media Share Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={shareToTwitter}
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    title="Twitter'da Paylaş"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>

                  <button
                    onClick={shareToFacebook}
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Facebook'ta Paylaş"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>

                  <button
                    onClick={shareToLinkedIn}
                    className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                    title="LinkedIn'de Paylaş"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>

                  <button
                    onClick={shareToWhatsApp}
                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                    title="WhatsApp'ta Paylaş"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--center-primary)' }}>
                <p className="text-sm font-bookmania" style={{ color: 'var(--text-light)' }}>Yazar</p>
                <p className="font-semibold font-bookmania" style={{ color: 'var(--text-primary)' }}>
                  {article.authors && article.authors.length > 0 ? article.authors[0] : 'Ahmed Ürkmez'}
                </p>
              </div>
            </div>
          </div>
        </article>

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
    </div>
  );
}
