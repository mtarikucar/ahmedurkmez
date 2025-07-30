'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, MagnifyingGlassIcon, FunnelIcon, BookOpenIcon, FilmIcon, PaintBrushIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { extractArticlesArray, extractCategoriesArray, safeMap, safeFilter, safeFind } from '@/lib/arrayUtils';

const AllArticlesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedArticles, setLikedArticles] = useState<number[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch articles and categories in parallel
        const [articlesResponse, categoriesResponse] = await Promise.all([
          articlesAPI.getAll({ status: 'published', limit: 100 }),
          categoriesAPI.getAll()
        ]);

        // Use robust array extraction utilities
        const validArticles = extractArticlesArray(articlesResponse);
        const validCategories = extractCategoriesArray(categoriesResponse);
        
        setArticles(validArticles);
        setCategories(validCategories);
        
        // Load liked articles from localStorage
        const liked = JSON.parse(localStorage.getItem('likedArticles') || '[]');
        setLikedArticles(liked);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error to prevent crashes
        setArticles([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Like functionality
  const handleLike = async (article: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation to article
    
    try {
      const isLiked = likedArticles.includes(article.id);
      
      if (isLiked) {
        // Unlike
        setLikedArticles(prev => prev.filter(id => id !== article.id));
        localStorage.setItem('likedArticles', JSON.stringify(likedArticles.filter(id => id !== article.id)));
        
        // Update article in state
        setArticles(prev => prev.map(a => 
          a.id === article.id ? { ...a, likeCount: Math.max(0, (a.likeCount || 0) - 1) } : a
        ));
      } else {
        // Like
        await articlesAPI.like(article.id);
        setLikedArticles(prev => [...prev, article.id]);
        localStorage.setItem('likedArticles', JSON.stringify([...likedArticles, article.id]));
        
        // Update article in state
        setArticles(prev => prev.map(a => 
          a.id === article.id ? { ...a, likeCount: (a.likeCount || 0) + 1 } : a
        ));
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  // Share functionality
  const handleShare = async (article: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation to article
    
    const articleUrl = `${window.location.origin}/articles/${article.slug}`;
    const shareData = {
      title: article.title,
      text: article.description || `${article.title} - Ahmed Ürkmez`,
      url: articleUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(articleUrl);
        // Could show a toast notification here
      }
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const categoryFilters = [
    { id: 'all', name: 'Tümü', icon: null },
    { id: 'printed', name: 'Basılı Yayınlar', icon: BookOpenIcon },
    { id: 'audiovisual', name: 'Görsel-İşitsel', icon: FilmIcon },
    { id: 'social', name: 'Sosyal & Sanatsal', icon: PaintBrushIcon }
  ];

  // Get unique years from articles using safe operations
  const years = Array.from(new Set(
    safeMap(articles, (article: any) => new Date(article.createdAt).getFullYear())
  )).sort((a, b) => b - a);

  // Map category types for filtering
  const getCategoryType = (article: any) => {
    const typeMapping: any = {
      'blog_post': 'social',
      'research_paper': 'printed',
      'video': 'audiovisual',
      'podcast': 'audiovisual',
      'social_media': 'social'
    };
    
    return typeMapping[article.type] || 'printed';
  };
  
  const processedArticles = safeMap(articles, (article: any, index: number) => ({
    ...article,
    categoryType: getCategoryType(article),
    categoryName: safeFind(categories, (cat: any) => cat.id === article.categoryId)?.name || 'Genel',
    year: new Date(article.createdAt).getFullYear().toString(),
    description: article.content ? article.content.substring(0, 150) + '...' : article.title,
    featured: article.featured || false,
    color: index % 4 === 0 ? 'blue' : index % 4 === 1 ? 'purple' : index % 4 === 2 ? 'emerald' : 'brown'
  }));

  const filteredArticles = safeFilter(processedArticles, (article: any) => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.categoryType === selectedCategory;
    const matchesYear = selectedYear === 'all' || article.year === selectedYear.toString();
    
    return matchesSearch && matchesCategory && matchesYear;
  }).sort((a: any, b: any) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'mostViewed':
        return (b.viewCount || 0) - (a.viewCount || 0);
      case 'alphabetical':
        return a.title?.localeCompare(b.title) || 0;
      default:
        return 0;
    }
  });

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

      {/* Header */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-dark/20 via-burgundy-dark/20 to-brown-dark/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-brown-dark mb-8 font-bookmania"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Geri Dön
          </button>

          <div className="text-center mb-12">
            <h1 className="heading-seljuk-large text-5xl font-bold text-brown-dark mb-6 drop-shadow-2xl">
              Tüm Eserler
            </h1>
            <p className="text-xl text-brown-light max-w-3xl mx-auto leading-relaxed font-bookmania">
              Yıllar içinde üretilmiş tüm akademik çalışmalar, sanatsal projeler ve yayınların 
              kapsamlı arşivi. Arama ve filtreleme seçenekleriyle istediğiniz içeriği kolayca bulun.
            </p>
          </div>

          {/* Arama ve Filtreler */}
          <div className="card-seljuk mb-12">
            {/* Arama Çubuğu */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brown-light" />
              <input
                type="text"
                placeholder="Eser başlığı veya açıklama arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-brown-light/10 border border-brown-light/20 rounded-xl text-brown-dark placeholder-brown-light focus:outline-none focus:ring-2 focus:ring-teal-medium focus:border-transparent font-bookmania"
              />
            </div>

            {/* Filtreler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Kategori */}
              <div>
                <label className="block text-brown-dark text-sm font-medium mb-2">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg text-brown-dark focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {categoryFilters.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Yıl */}
              <div>
                <label className="block text-brown-dark text-sm font-medium mb-2">Yıl</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg text-brown-dark focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="all">Tüm Yıllar</option>
                  {years.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-brown-dark text-sm font-medium mb-2">Sıralama</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 bg-white/80 border border-gray-300 rounded-lg text-brown-dark focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="mostViewed">En Çok Görüntülenen</option>
                  <option value="alphabetical">Alfabetik</option>
                </select>
              </div>

              {/* Sonuç Sayısı */}
              <div className="flex items-end">
                <div className="bg-white/80 rounded-lg p-3 w-full text-center shadow-sm">
                  <div className="text-2xl font-bold text-brown-dark">{filteredArticles.length}</div>
                  <div className="text-brown-light text-sm">Sonuç</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* İçerik Listesi */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="card-seljuk">
                <div className="animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-brown-light/20 rounded-full w-24"></div>
                    <div className="h-4 bg-brown-light/20 rounded w-12"></div>
                  </div>
                  <div className="h-6 bg-brown-light/20 rounded mb-2"></div>
                  <div className="h-6 bg-brown-light/20 rounded w-3/4 mb-4"></div>
                  <div className="h-16 bg-brown-light/20 rounded mb-4"></div>
                  <div className="border-t border-brown-light/20 pt-4 mb-4">
                    <div className="flex space-x-4">
                      <div className="h-4 bg-brown-light/20 rounded w-12"></div>
                      <div className="h-4 bg-brown-light/20 rounded w-12"></div>
                      <div className="h-4 bg-brown-light/20 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-brown-light/20 rounded-lg"></div>
                      <div className="h-8 w-8 bg-brown-light/20 rounded-lg"></div>
                    </div>
                    <div className="h-8 bg-brown-light/20 rounded-lg w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="card-seljuk max-w-md mx-auto">
              <FunnelIcon className="w-16 h-16 text-brown-light mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-brown-dark mb-2 font-bookmania-bold">Sonuç Bulunamadı</h3>
              <p className="text-brown-light font-bookmania">
                {articles.length === 0 
                  ? "Henüz yayınlanmış makale bulunmuyor."
                  : "Arama kriterlerinize uygun eser bulunamadı. Lütfen farklı filtreler deneyin."
                }
              </p>
              {articles.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedYear('all');
                  }}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-medium to-teal-dark text-white rounded-lg hover:from-teal-dark hover:to-teal-medium transition-all duration-300"
                >
                  Filtreleri Temizle
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className={`card-seljuk hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                  article.featured ? 'ring-2 ring-teal-medium/50 shadow-teal-medium/20' : ''
                }`}
                onClick={() => router.push(`/articles/${article.slug || article.id}`)}
              >
                {/* Featured Badge */}
                {article.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-teal-medium to-teal-dark text-white text-xs font-medium rounded-full shadow-sm">
                      Öne Çıkan
                    </span>
                  </div>
                )}

                {/* Category and Year */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    article.categoryType === 'printed' ? 'bg-amber-100 text-amber-800' :
                    article.categoryType === 'audiovisual' ? 'bg-purple-100 text-purple-800' :
                    'bg-teal-100 text-teal-800'
                  }`}>
                    {article.categoryName}
                  </span>
                  <span className="text-brown-light text-sm font-bookmania">{article.year}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bookmania-bold text-brown-dark mb-3 line-clamp-2 group-hover:text-teal-dark transition-colors duration-300">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-brown-light text-sm leading-relaxed mb-6 line-clamp-3 font-bookmania">
                  {article.excerpt || article.description || `${article.title} hakkında detaylı bilgi için makaleyi okuyun.`}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-brown-light/20">
                  <div className="flex items-center space-x-4 text-xs text-brown-light">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span>{(article.viewCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                      </svg>
                      <span>{article.likeCount || 0}</span>
                    </div>
                    <span className="text-xs">
                      {new Date(article.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => handleLike(article, e)}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        likedArticles.includes(article.id) 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-gray-100 text-brown-light hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      {likedArticles.includes(article.id) ? (
                        <HeartIconSolid className="h-4 w-4" />
                      ) : (
                        <HeartIcon className="h-4 w-4" />
                      )}
                    </button>
                    
                    <button 
                      onClick={(e) => handleShare(article, e)}
                      className="p-2 rounded-lg bg-gray-100 text-brown-light hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-medium to-teal-dark text-white text-sm font-medium rounded-lg hover:from-teal-dark hover:to-teal-medium transition-all duration-300 shadow-sm hover:shadow-md">
                    Oku
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sayfalama (eğer çok fazla sonuç varsa) */}
        {filteredArticles.length > 12 && (
          <div className="mt-16 flex justify-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArticlesPage;
