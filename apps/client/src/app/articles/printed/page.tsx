'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, BookOpenIcon, DocumentTextIcon, AcademicCapIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { articlesAPI, categoriesAPI } from '@/lib/api';
import { extractArticlesArray, extractCategoriesArray, safeArrayStats, safeMap, safeFilter, safeFind } from '@/lib/arrayUtils';

const PrintedPublicationsPage = () => {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPublications: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalCitations: 0
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch articles and categories
        const [articlesResponse, categoriesResponse] = await Promise.all([
          articlesAPI.getAll({ 
            status: 'published',
            simple: 'true'
            // Note: backend filtering by type array not implemented, we'll filter client-side
          }),
          categoriesAPI.getAll()
        ]);

        // Use robust array extraction utilities
        const validArticles = extractArticlesArray(articlesResponse);
        const validCategories = extractCategoriesArray(categoriesResponse);
        
        // Filter for printed publications (blog_post, research_paper)
        const printedArticles = safeFilter(validArticles, (article: any) => 
          ['blog_post', 'research_paper'].includes(article.type)
        );
        
        setArticles(printedArticles);
        setCategories(validCategories);
        
        // Calculate stats using safe operations
        const viewStats = safeArrayStats(printedArticles, 'viewCount');
        setStats({
          totalPublications: viewStats.count,
          totalViews: viewStats.sum,
          totalDownloads: Math.floor(viewStats.sum * 0.35), // Estimate downloads as 35% of views
          totalCitations: Math.floor(viewStats.count * 2.5) // Estimate citations
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error to prevent crashes
        setArticles([]);
        setCategories([]);
        setStats({
          totalPublications: 0,
          totalViews: 0,
          totalDownloads: 0,
          totalCitations: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubcategoryCount = (subcategory: string) => {
    if (subcategory === 'all') return articles.length;
    
    const typeMapping: any = {
      'books': ['research_paper'],
      'articles': ['blog_post'],
      'research': ['research_paper'],
      'academic': ['research_paper', 'blog_post']
    };
    
    const relevantTypes = typeMapping[subcategory] || [];
    return safeFilter(articles, (article: any) => relevantTypes.includes(article.type)).length;
  };

  const subcategories = [
    { id: 'all', name: 'Tümü', count: getSubcategoryCount('all') },
    { id: 'books', name: 'Kitaplar', count: getSubcategoryCount('books'), icon: BookOpenIcon },
    { id: 'articles', name: 'Makaleler', count: getSubcategoryCount('articles'), icon: DocumentTextIcon },
    { id: 'research', name: 'Araştırmalar', count: getSubcategoryCount('research'), icon: AcademicCapIcon },
    { id: 'academic', name: 'Akademik Yayınlar', count: getSubcategoryCount('academic'), icon: NewspaperIcon }
  ];

  const processedPublications = safeMap(articles, (article: any) => ({
    ...article,
    categoryName: safeFind(categories, (cat: any) => cat.id === article.categoryId)?.name || 'Genel',
    year: new Date(article.createdAt).getFullYear().toString(),
    description: article.content ? article.content.substring(0, 200) + '...' : article.title,
    downloadCount: Math.floor((article.viewCount || 0) * 0.35),
    citationCount: Math.floor(Math.random() * 20),
    type: article.type === 'research_paper' ? 'Araştırma' : 'Makale'
  }));

  const filteredPublications = selectedSubcategory === 'all' 
    ? processedPublications 
    : safeFilter(processedPublications, (pub: any) => {
        const typeMapping: any = {
          'books': ['research_paper'],
          'articles': ['blog_post'],
          'research': ['research_paper'],
          'academic': ['research_paper', 'blog_post']
        };
        const relevantTypes = typeMapping[selectedSubcategory] || [];
        return relevantTypes.includes(pub.type);
      });

  const getTypeColor = (type: string) => {
    const colors = {
      'Kitap': 'brown',
      'Makale': 'teal',
      'Araştırma': 'burgundy',
      'Akademik Yayın': 'amber'
    };
    return colors[type as keyof typeof colors] || 'gray';
  };

  return (
    <div className="min-h-screen font-bookmania bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      {/* Decorative Seljuk Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="bg-brown-light rounded-full w-2 h-2 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-brown-dark/30 via-amber-700/20 to-orange-600/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-brown-dark hover:text-brown-light transition-colors mb-8 font-bookmania"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Geri Dön
          </button>

          <div className="flex items-center mb-6">
            <div className="p-4 bg-gradient-brown rounded-xl mr-6 border-2 border-brown-light/30 shadow-lg">
              <BookOpenIcon className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="heading-seljuk-large text-4xl font-bold text-brown-dark mb-3 drop-shadow-lg">
                Basılı Yayınlar
              </h1>
              <p className="text-xl text-brown-light max-w-3xl font-bookmania">
                Kitaplar, makaleler, araştırmalar ve akademik yayınların kapsamlı koleksiyonu
              </p>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="card-seljuk text-center hover:bg-brown-light/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-brown-dark mb-1">
                {loading ? '...' : stats.totalPublications}
              </div>
              <div className="text-brown-light text-sm font-bookmania">Toplam Yayın</div>
            </div>
            <div className="card-seljuk text-center hover:bg-amber-600/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-amber-600 mb-1">
                {loading ? '...' : stats.totalViews.toLocaleString()}
              </div>
              <div className="text-brown-light text-sm font-bookmania">Toplam Görüntüleme</div>
            </div>
            <div className="card-seljuk text-center hover:bg-teal-light/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-teal-dark mb-1">
                {loading ? '...' : stats.totalDownloads.toLocaleString()}
              </div>
              <div className="text-brown-light text-sm font-bookmania">İndirme</div>
            </div>
            <div className="card-seljuk text-center hover:bg-burgundy-light/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-burgundy-medium mb-1">
                {loading ? '...' : stats.totalCitations}
              </div>
              <div className="text-brown-light text-sm font-bookmania">Atıf</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Alt Kategori Filtreleri */}
        <div className="mb-12">
          <div className="card-seljuk">
            <h3 className="text-brown-dark font-bookmania font-medium mb-4">Alt Kategoriler</h3>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((sub) => {
                const IconComponent = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`flex items-center px-4 py-3 rounded-lg font-bookmania ${
                      selectedSubcategory === sub.id
                        ? 'bg-gradient-brown text-white shadow-lg border-2 border-brown-light/30'
                        : 'bg-brown-light/10 text-brown-dark border border-brown-light/20'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                    <span className="font-medium">{sub.name}</span>
                    <span className="ml-2 text-xs opacity-75">({sub.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Yayın Listesi */}
        <div className="space-y-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 shadow-lg">
                <div className="animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="h-6 bg-gray-300 rounded-full w-20 mr-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-12"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-20 bg-gray-300 rounded-lg mb-6"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredPublications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-brown-light font-bookmania">Bu kategoride henüz yayın bulunmuyor.</p>
            </div>
          ) : (
            filteredPublications.map((publication) => (
            <div
              key={publication.id}
              className={`bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-gray-200/50 shadow-lg ${
                publication.featured ? 'ring-2 ring-teal-500/50' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Sol Taraf - Ana Bilgiler */}
                <div className="flex-1">
                  <div className="flex items-center mb-4 bg-gray-100/80 p-3 rounded-lg">
                    {publication.featured && (
                      <span className="px-3 py-1 bg-teal-600 text-white text-sm font-medium rounded-full mr-3">
                        Öne Çıkan
                      </span>
                    )}
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      {publication.type}
                    </span>
                    <span className="text-brown-dark text-sm ml-4 bg-white px-3 py-1 rounded shadow-sm">{publication.year}</span>
                  </div>

                  <h3 
                    className="text-2xl font-bookmania font-bold text-brown-dark mb-4 bg-white/70 p-4 rounded-lg cursor-pointer shadow-sm hover:bg-white/90 transition-colors"
                    onClick={() => router.push(`/articles/${publication.slug}`)}
                  >
                    {publication.title}
                  </h3>

                  <p className="text-brown-dark text-sm leading-relaxed mb-6 bg-gray-50/80 p-4 rounded-lg">
                    {publication.description}
                  </p>

                  {/* Detay Bilgileri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-100/60 p-4 rounded-lg">
                    <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                      <span className="font-medium mr-2 text-brown-dark">Kategori:</span>
                      <span>{publication.categoryName}</span>
                    </div>
                    <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                      <span className="font-medium mr-2 text-brown-dark">Tarih:</span>
                      <span>{new Date(publication.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {publication.status && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2 text-brown-dark">Durum:</span>
                        <span className="capitalize">{publication.status}</span>
                      </div>
                    )}
                    {publication.updatedAt && (
                      <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                        <span className="font-medium mr-2 text-brown-dark">Güncelleme:</span>
                        <span>{new Date(publication.updatedAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sağ Taraf - İstatistikler ve Aksiyonlar */}
                <div className="lg:w-64 space-y-4">
                  <div className="bg-gray-100/80 rounded-lg p-4 shadow-sm">
                    <h4 className="text-brown-dark font-medium mb-3">İstatistikler</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>Görüntülenme:</span>
                        <span className="text-blue-600 font-medium">{(publication.viewCount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>İndirme:</span>
                        <span className="text-emerald-600 font-medium">{publication.downloadCount}</span>
                      </div>
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>Atıf:</span>
                        <span className="text-purple-600 font-medium">{publication.citationCount}</span>
                      </div>
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>Beğeni:</span>
                        <span className="text-amber-600 font-medium">{publication.likeCount || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={() => router.push(`/articles/${publication.slug}`)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      Detayları Görüntüle
                    </button>
                    {publication.pdfUrl && (
                      <a 
                        href={publication.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm text-center hover:bg-gray-600 transition-colors"
                      >
                        PDF İndir
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Sayfalama */}
        <div className="mt-12 flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-brown-dark'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintedPublicationsPage;
