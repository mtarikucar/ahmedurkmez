'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { Article, Category } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ClockIcon, EyeIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: 12,
          status: 'published',
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (selectedCategory) {
          params.categoryId = selectedCategory;
        }

        const response = await articlesAPI.getAll(params);
        const data = response.data;

        setArticles(data.articles || data);
        setTotalPages(Math.ceil((data.total || data.length) / 12));
        setTotalArticles(data.total || data.length);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, searchTerm, selectedCategory]);

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const getArticleTypeLabel = (type: string) => {
    const types: { [key: string]: { label: string; color: string } } = {
      academic_paper: { label: 'Akademik Makale', color: 'bg-blue-100 text-blue-800' },
      blog_post: { label: 'Blog Yazısı', color: 'bg-green-100 text-green-800' },
      research: { label: 'Araştırma', color: 'bg-purple-100 text-purple-800' },
      essay: { label: 'Deneme', color: 'bg-orange-100 text-orange-800' },
      review: { label: 'İnceleme', color: 'bg-pink-100 text-pink-800' }
    };
    return types[type] || { label: 'Makale', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="py-24 sm:py-32 font-bookmania" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight font-bookmania mb-6" style={{ color: 'var(--text-primary)' }}>
            Makaleler
          </h1>
          <p className="text-xl lg:text-2xl leading-relaxed font-bookmania mb-8" style={{ color: 'var(--text-secondary)' }}>
            Edebiyat, akademik araştırma ve kültürel çalışmalar üzerine yazılarım
          </p>
          
          {searchTerm && (
            <div className="mb-8 p-4 rounded-lg border border-center-primary/20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-lg font-bookmania" style={{ color: 'var(--text-primary)' }}>
                "<span className="font-semibold text-center-secondary">{searchTerm}</span>" için arama sonuçları
              </p>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-6 py-3 rounded-full font-bookmania transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-center-secondary text-white shadow-lg transform scale-105'
                : 'bg-white text-text-secondary border border-center-primary/20 hover:border-center-secondary hover:text-center-secondary shadow-sm'
            }`}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-6 py-3 rounded-full font-bookmania transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-center-secondary text-white shadow-lg transform scale-105'
                  : 'bg-white text-text-secondary border border-center-primary/20 hover:border-center-secondary hover:text-center-secondary shadow-sm'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="mt-8 text-center">
          <p className="text-lg font-bookmania" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold text-center-secondary">{totalArticles}</span> makale bulundu
            {selectedCategory && (
              <span> • <span className="font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span> kategorisinde</span>
            )}
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-2xl mb-6"></div>
                <div className="bg-gray-200 h-6 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded-lg w-3/4"></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article 
                key={article.id} 
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-center-secondary/30 transform hover:-translate-y-2"
              >
                {article.featuredImage && (
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium font-bookmania"
                      style={{ backgroundColor: 'var(--center-primary)', color: 'white' }}
                    >
                      {article.category.name}
                    </span>
                    <div className="flex items-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatDistanceToNow(new Date(article.createdAt), { 
                        addSuffix: true, 
                        locale: tr 
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl lg:text-2xl font-bold font-bookmania mb-3 leading-tight group-hover:text-center-secondary transition-colors">
                    <Link href={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  {/* Subtitle */}
                  {article.subtitle && (
                    <p className="text-lg font-bookmania mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {article.subtitle}
                    </p>
                  )}

                  {/* Excerpt */}
                  <p className="text-base leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                    {article.excerpt}
                  </p>
                  
                  {/* Article Type Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-bookmania ${getArticleTypeLabel(article.type).color}`}>
                      {getArticleTypeLabel(article.type).label}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        <span>{article.viewCount}</span>
                      </div>
                      <div className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        <span>{article.likeCount}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium font-bookmania text-white bg-center-secondary hover:bg-center-tertiary transition-colors shadow-md hover:shadow-lg"
                    >
                      Oku
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <UserIcon className="w-12 h-12" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <h3 className="text-2xl font-bold font-bookmania mb-3" style={{ color: 'var(--text-primary)' }}>
                Henüz makale bulunmuyor
              </h3>
              <p className="text-lg font-bookmania" style={{ color: 'var(--text-secondary)' }}>
                {searchTerm ? 'Aramanızla eşleşen makale bulunamadı.' : 'Bu kategoride henüz makale yayınlanmamış.'}
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-bookmania transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-text-secondary border border-center-primary/20 hover:border-center-secondary hover:text-center-secondary shadow-sm'
                }`}
              >
                Önceki
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-bookmania transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-center-secondary text-white shadow-lg transform scale-110'
                            : 'bg-white text-text-secondary border border-center-primary/20 hover:border-center-secondary hover:text-center-secondary shadow-sm'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 text-text-secondary">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-bookmania transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-text-secondary border border-center-primary/20 hover:border-center-secondary hover:text-center-secondary shadow-sm'
                }`}
              >
                Sonraki
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
