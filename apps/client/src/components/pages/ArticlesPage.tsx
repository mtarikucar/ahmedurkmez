'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { Article, Category } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const searchParams = useSearchParams();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-seljuk-large text-4xl sm:text-5xl lg:text-6xl mb-6">
            Makaleler
          </h1>
          <p className="text-lg font-bookmania text-brown-light max-w-2xl mx-auto">
            Edebiyat, akademik araştırma ve kültürel çalışmalar üzerine yazılarım
          </p>

          {/* Decorative Seljuk Pattern */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-teal-light rounded-full"></div>
              <div className="w-2 h-2 bg-burgundy-light rounded-full mt-0.5"></div>
              <div className="w-4 h-4 bg-brown-light rounded-full -mt-0.5"></div>
              <div className="w-2 h-2 bg-burgundy-light rounded-full mt-0.5"></div>
              <div className="w-3 h-3 bg-teal-light rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-seljuk p-6 mb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative max-w-md flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <MagnifyingGlassIcon className="h-5 w-5 text-brown-light" aria-hidden="true" />
              </div>
              <Input
                type="text"
                placeholder="Makalelerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </form>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter(null)}
              >
                Tümü
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 text-sm font-bookmania text-brown-light bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
          {totalArticles} makale bulundu
          {searchTerm && ` "${searchTerm}" için`}
          {selectedCategory && ` ${categories.find(c => c.id === selectedCategory)?.name} kategorisinde`}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                {article.featuredImage && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-indigo-600 font-medium">
                      {article.category.name}
                    </span>
                    <time className="text-gray-500">
                      {formatDistanceToNow(new Date(article.createdAt), { 
                        addSuffix: true, 
                        locale: tr 
                      })}
                    </time>
                  </div>
                  <CardTitle className="text-xl">
                    <Link href={`/articles/${article.slug}`} className="hover:text-indigo-600">
                      {article.title}
                    </Link>
                  </CardTitle>
                  {article.subtitle && (
                    <CardDescription>{article.subtitle}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  
                  {/* Article Type Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.type === 'academic_paper' 
                        ? 'bg-blue-100 text-blue-800'
                        : article.type === 'blog_post'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {article.type === 'academic_paper' && 'Akademik Makale'}
                      {article.type === 'blog_post' && 'Blog Yazısı'}
                      {article.type === 'research' && 'Araştırma'}
                      {article.type === 'essay' && 'Deneme'}
                      {article.type === 'review' && 'İnceleme'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{article.viewCount} görüntüleme</span>
                      <span>{article.likeCount} beğeni</span>
                    </div>
                    <Link href={`/articles/${article.slug}`}>
                      <Button variant="outline" size="sm">Oku</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center py-12">
            <p className="text-gray-500 text-lg">Henüz makale bulunmuyor.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Önceki
            </Button>
            
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
