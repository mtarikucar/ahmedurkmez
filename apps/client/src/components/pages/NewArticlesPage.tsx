'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon, DocumentTextIcon, FilmIcon, PaintBrushIcon, BookOpenIcon, MicrophoneIcon, CameraIcon } from '@heroicons/react/24/outline';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { extractArticlesArray, extractCategoriesArray, safeArrayStats, safeFilter, safeMap, safeFind } from '@/lib/arrayUtils';

const ArticlesPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalPlatforms: 0,
    experience: 15
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch articles and categories in parallel
        const [articlesResponse, categoriesResponse] = await Promise.all([
          articlesAPI.getAll({ status: 'published', limit: 100, simple: 'true' }),
          categoriesAPI.getAll()
        ]);

        // Use our robust array extraction utilities
        const validArticles = extractArticlesArray(articlesResponse);
        const validCategories = extractCategoriesArray(categoriesResponse);
        
        setArticles(validArticles);
        setCategories(validCategories);
        
        // Calculate stats using safe array operations
        const viewStats = safeArrayStats(validArticles, 'viewCount');
        const uniqueTypes = new Set(safeMap(validArticles, (article: any) => article.type || 'unknown'));
        
        setStats({
          totalArticles: viewStats.count,
          totalViews: viewStats.sum,
          totalPlatforms: uniqueTypes.size,
          experience: 15
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error to prevent crashes
        setArticles([]);
        setCategories([]);
        setStats({
          totalArticles: 0,
          totalViews: 0,
          totalPlatforms: 0,
          experience: 15
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group articles by category type for mapping to UI categories
  const getCategoryStats = (categoryType: string) => {
    const typeMapping: any = {
      'printed': ['blog_post', 'research_paper'],
      'audiovisual': ['video', 'podcast'],
      'social': ['blog_post', 'social_media']
    };
    
    const relevantTypes = typeMapping[categoryType] || [];
    return safeFilter(articles, (article: any) => 
      relevantTypes.includes(article.type) || 
      (safeFind(categories, (cat: any) => cat.id === article.categoryId)?.name?.toLowerCase().includes(categoryType))
    ).length;
  };

  // Ana kategoriler - Site renk şemasına uygun
  const mainCategories = [
    {
      id: 'printed',
      name: 'Basılı Yayınlar',
      description: 'Kitaplar, makaleler, araştırmalar ve akademik yayınlar',
      icon: BookOpenIcon,
      gradient: 'from-amber-600 via-amber-700 to-orange-800',
      color: 'amber',
      bgClass: 'bg-gradient-brown',
      borderClass: 'border-brown-light/30',
      itemCount: getCategoryStats('printed'),
      subcategories: ['Kitaplar', 'Makaleler', 'Araştırmalar', 'Akademik Yayınlar']
    },
    {
      id: 'audiovisual',
      name: 'Görsel-İşitsel Yayınlar',
      description: 'Video içerikler, podcast\'ler, televizyon programları',
      icon: FilmIcon,
      gradient: 'from-red-600 via-red-700 to-red-800',
      color: 'red',
      bgClass: 'bg-gradient-burgundy',
      borderClass: 'border-burgundy-light/30',
      itemCount: getCategoryStats('audiovisual'),
      subcategories: ['Video İçerikler', 'Podcast\'ler', 'TV Programları', 'Röportajlar']
    },
    {
      id: 'social',
      name: 'Sosyal ve Sanatsal Yayınlar',
      description: 'Blog yazıları, sosyal medya içerikleri, sanatsal projeler',
      icon: PaintBrushIcon,
      gradient: 'from-teal-600 via-teal-700 to-teal-800',
      color: 'teal',
      bgClass: 'bg-gradient-teal',
      borderClass: 'border-teal-light/30',
      itemCount: getCategoryStats('social'),
      subcategories: ['Blog Yazıları', 'Sosyal Medya', 'Sanatsal Projeler', 'Fotoğrafçılık']
    }
  ];

  // Get latest articles for preview using safe operations
  const latestArticles = safeMap(
    safeFilter(articles, () => true)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
    (article: any) => article
  );

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/articles/${categoryId}`);
  };

  const handleViewAll = () => {
    router.push('/articles/all');
  };

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Decorative Seljuk Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="bg-teal-medium rounded-full w-2 h-2 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-dark/20 via-burgundy-dark/20 to-brown-dark/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="heading-seljuk-large text-5xl font-bold text-brown-dark mb-6 drop-shadow-2xl">
              Eserler ve Yayınlar
            </h1>
            <p className="text-xl text-brown-light max-w-3xl mx-auto leading-relaxed font-bookmania">
              Yıllar içinde üretilen akademik çalışmalar, sanatsal projeler ve sosyal içeriklerin 
              kapsamlı koleksiyonu. Her kategori, farklı alanlardaki uzmanlığı ve yaratıcılığı yansıtır.
            </p>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="card-seljuk text-center">
              <div className="text-3xl font-bookmania-bold text-teal-dark mb-2">
                {loading ? '...' : stats.totalArticles}
              </div>
              <div className="text-brown-dark text-sm font-bookmania">Toplam Eser</div>
            </div>
            <div className="card-seljuk text-center">
              <div className="text-3xl font-bookmania-bold text-burgundy-medium mb-2">{stats.experience}</div>
              <div className="text-brown-dark text-sm font-bookmania">Yıllık Deneyim</div>
            </div>
            <div className="card-seljuk text-center">
              <div className="text-3xl font-bookmania-bold text-brown-dark mb-2">
                {loading ? '...' : stats.totalPlatforms}
              </div>
              <div className="text-brown-dark text-sm font-bookmania">Farklı Platform</div>
            </div>
            <div className="card-seljuk text-center">
              <div className="text-3xl font-bookmania-bold text-amber-600 mb-2">
                {loading ? '...' : stats.totalViews.toLocaleString()}
              </div>
              <div className="text-brown-dark text-sm font-bookmania">Toplam Görüntüleme</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Kategoriler */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mainCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`relative overflow-hidden rounded-xl cursor-pointer ${category.bgClass} border-2 ${category.borderClass} shadow-lg backdrop-blur-sm`}
              >
                {/* Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white/90 rounded-xl backdrop-blur-sm border border-gray-200/50 shadow-sm">
                      <IconComponent className="w-8 h-8 text-brown-dark" />
                    </div>
                    <div className="text-right bg-white/80 p-3 rounded-lg shadow-sm">
                      <div className="text-brown-light text-sm font-bookmania">Toplam</div>
                      <div className="text-2xl font-bookmania-bold text-brown-dark">{category.itemCount}</div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1">
                    <h3 className="text-2xl heading-seljuk font-bold text-brown-dark mb-4 bg-white/60 p-3 rounded-lg shadow-sm">
                      {category.name}
                    </h3>
                    <p className="text-brown-dark text-sm leading-relaxed mb-6 font-bookmania bg-white/70 p-4 rounded-lg shadow-sm">
                      {category.description}
                    </p>

                    {/* Subcategories */}
                    <div className="bg-gray-100/80 p-4 rounded-lg shadow-sm">
                      <div className="text-brown-dark text-sm font-bookmania font-medium mb-3">Alt Kategoriler:</div>
                      <div className="space-y-2">
                        {category.subcategories.map((sub, idx) => (
                          <div key={idx} className="flex items-center text-brown-dark text-sm font-bookmania bg-white/70 p-2 rounded shadow-sm">
                            <div className="w-2 h-2 bg-teal-400 rounded-full mr-3" />
                            {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-300/50 bg-white/70 p-3 rounded-lg shadow-sm">
                    <span className="text-brown-dark text-sm font-bookmania font-medium">Detayları Görüntüle</span>
                    <ChevronRightIcon className="w-5 h-5 text-brown-light" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tüm Eserler Butonu */}
        <div className="mt-16 text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center px-8 py-4 bg-gradient-teal text-white font-bookmania font-medium rounded-xl shadow-lg border-2 border-teal-light/30 backdrop-blur-sm"
          >
            <DocumentTextIcon className="w-5 h-5 mr-3" />
            Tüm Eserleri Görüntüle
            <ChevronRightIcon className="w-5 h-5 ml-3" />
          </button>
        </div>

        {/* Son Eklenenler Önizlemesi */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="heading-seljuk text-3xl font-bold text-brown-dark mb-4 drop-shadow-lg">
              Son Eklenen Eserler
            </h2>
            <p className="text-brown-light font-bookmania">En güncel çalışmalar ve yayınlar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="card-seljuk">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded-lg">
                      <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-300 rounded w-12"></div>
                    </div>
                    <div className="h-8 bg-gray-300 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : latestArticles.length > 0 ? (
              latestArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="card-seljuk cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/articles/${article.slug}`)}
                >
                  <div className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded-lg">
                    <span className="px-3 py-1 bg-teal-light/30 text-teal-dark text-sm font-bookmania font-medium rounded-full">
                      {article.type || 'Article'}
                    </span>
                    <span className="text-brown-dark text-sm font-bookmania font-medium bg-white px-2 py-1 rounded">
                      {new Date(article.createdAt).getFullYear()}
                    </span>
                  </div>
                  <h3 className="text-brown-dark font-bookmania font-medium mb-3 text-lg bg-gray-50 p-3 rounded-lg">
                    {article.title}
                  </h3>
                  <p className="text-brown-light text-sm font-bookmania bg-gray-100/50 p-2 rounded">
                    {safeFind(categories, (cat: any) => cat.id === article.categoryId)?.name || 'Genel'}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-brown-light font-bookmania">Henüz yayınlanmış makale bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
