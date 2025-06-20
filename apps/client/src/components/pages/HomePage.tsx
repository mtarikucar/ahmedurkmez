'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { Article, Category } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, recentRes, categoriesRes] = await Promise.all([
          articlesAPI.getFeatured(3),
          articlesAPI.getAll({ limit: 6, status: 'published' }),
          categoriesAPI.getAll(),
        ]);

        setFeaturedArticles(featuredRes.data);
        setRecentArticles(recentRes.data.articles || recentRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Ahmed Ürkmez
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Edebiyat, akademik araştırma ve kültürel çalışmalar alanında uzman. 
              Makaleler, araştırmalar ve düşüncelerimi paylaştığım kişisel alanım.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/articles">
                <Button size="lg">Makaleleri İncele</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Hakkımda <span aria-hidden="true">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Öne Çıkan Makaleler
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              En çok okunan ve beğenilen yazılarım
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <article key={article.id} className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={article.createdAt} className="text-gray-500">
                    {formatDistanceToNow(new Date(article.createdAt), { 
                      addSuffix: true, 
                      locale: tr 
                    })}
                  </time>
                  <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    {article.category.name}
                  </span>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={`/articles/${article.slug}`}>
                      <span className="absolute inset-0" />
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {article.excerpt}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">Ahmed Ürkmez</p>
                    <p className="text-gray-600">{article.viewCount} görüntüleme</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Recent Articles */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Son Makaleler
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              En son yayınlanan yazılarım
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {recentArticles.slice(0, 4).map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.category.name}</span>
                    <time className="text-sm text-gray-500">
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
                  <p className="text-gray-600 line-clamp-3">{article.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{article.viewCount} görüntüleme</span>
                      <span>{article.likeCount} beğeni</span>
                    </div>
                    <Link href={`/articles/${article.slug}`}>
                      <Button variant="outline" size="sm">Devamını Oku</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/articles">
              <Button variant="outline" size="lg">Tüm Makaleleri Görüntüle</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Kategoriler
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              İlgi alanlarıma göre düzenlenmiş konular
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {category.name}
                      {category.color && (
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                    </CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Benimle İletişime Geçin
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
              Sorularınız, önerileriniz veya işbirliği teklifleriniz için bana ulaşabilirsiniz.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  İletişim
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
