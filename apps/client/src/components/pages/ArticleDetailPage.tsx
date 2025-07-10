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
  CalendarIcon
} from '@heroicons/react/24/outline';
import ArticlePDFSection from '@/components/article/ArticlePDFSection';

interface ArticleDetailPageProps {
  slug: string;
}

export default function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // Gerçek API'den makale çek
        const response = await articlesAPI.getBySlug(slug);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Makale yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

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
                <HeartIcon className="h-5 w-5" />
                <span className="font-bookmania">{article.likeCount} beğeni</span>
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

            {/* PDF Section for Academic Papers */}
            {article.pdfFile && (
              <div className="my-12">
                <ArticlePDFSection article={article} />
              </div>
            )}

            {/* Actions */}
            <div className="mt-12 pt-8 border-t-2 flex items-center justify-between" style={{ borderColor: 'var(--center-primary)' }}>
              <div className="flex items-center space-x-4">
                <button className="btn-elegant btn-secondary flex items-center space-x-2">
                  <HeartIcon className="h-5 w-5" />
                  <span>Beğen ({article.likeCount})</span>
                </button>
                
                <button className="btn-elegant btn-secondary flex items-center space-x-2">
                  <ShareIcon className="h-5 w-5" />
                  <span>Paylaş</span>
                </button>
              </div>

              {/* Author Info */}
              <div className="text-right">
                <p className="text-sm font-bookmania" style={{ color: 'var(--text-light)' }}>Yazar</p>
                <p className="font-semibold font-bookmania" style={{ color: 'var(--text-primary)' }}>
                  {article.authors && article.authors.length > 0 ? article.authors[0] : 'Ahmed Ürkmez'}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
