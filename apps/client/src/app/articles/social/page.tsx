'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, PaintBrushIcon, DocumentTextIcon, ShareIcon, PhotoIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { articlesAPI, categoriesAPI } from '@/lib/api';

const SocialArtisticPublicationsPage = () => {
  const router = useRouter();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPublications: 0,
    totalViews: 0,
    totalShares: 0,
    engagement: 0
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
            type: ['blog_post', 'social_media'] // Filter for social and artistic publications
          }),
          categoriesAPI.getAll()
        ]);

        const articlesData = articlesResponse.data.data || articlesResponse.data;
        const categoriesData = categoriesResponse.data.data || categoriesResponse.data;
        
        setArticles(articlesData);
        setCategories(categoriesData);
        
        // Calculate stats
        const totalViews = articlesData.reduce((sum: number, article: any) => sum + (article.viewCount || 0), 0);
        setStats({
          totalPublications: articlesData.length,
          totalViews: totalViews,
          totalShares: Math.floor(totalViews * 0.25), // Estimate shares
          engagement: Math.floor(totalViews * 0.08) // Estimate engagement
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubcategoryCount = (subcategory: string) => {
    if (subcategory === 'all') return articles.length;
    
    const typeMapping: any = {
      'blogs': ['blog_post'],
      'social': ['social_media'],
      'artistic': ['blog_post'],
      'photography': ['blog_post']
    };
    
    const relevantTypes = typeMapping[subcategory] || [];
    return articles.filter(article => relevantTypes.includes(article.type)).length;
  };

  const subcategories = [
    { id: 'all', name: 'Tümü', count: getSubcategoryCount('all') },
    { id: 'blogs', name: 'Blog Yazıları', count: getSubcategoryCount('blogs'), icon: DocumentTextIcon },
    { id: 'social', name: 'Sosyal Medya', count: getSubcategoryCount('social'), icon: ShareIcon },
    { id: 'artistic', name: 'Sanatsal Projeler', count: getSubcategoryCount('artistic'), icon: PaintBrushIcon },
    { id: 'photography', name: 'Fotoğrafçılık', count: getSubcategoryCount('photography'), icon: PhotoIcon }
  ];

  const processedPublications = articles.map((article) => ({
    ...article,
    categoryName: categories.find(cat => cat.id === article.categoryId)?.name || 'Genel',
    year: new Date(article.createdAt).getFullYear().toString(),
    description: article.content ? article.content.substring(0, 200) + '...' : article.title,
    type: article.type === 'blog_post' ? 'Blog Yazısı' : article.type === 'social_media' ? 'Sosyal Medya' : 'İçerik',
    platform: 'Medium, Instagram, LinkedIn',
    comments: Math.floor(Math.random() * 100)
  }));

  const filteredPublications = selectedSubcategory === 'all' 
    ? processedPublications 
    : processedPublications.filter(pub => {
        const typeMapping: any = {
          'blogs': ['blog yazısı'],
          'social': ['sosyal medya'],
          'artistic': ['blog yazısı'],
          'photography': ['blog yazısı']
        };
        const relevantTypes = typeMapping[selectedSubcategory] || [];
        return relevantTypes.includes(pub.type.toLowerCase());
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
        <div className="absolute inset-0 bg-gradient-to-br from-teal-dark/30 via-green-700/20 to-blue-600/20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-brown-dark hover:text-brown-light transition-colors mb-8 font-bookmania"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Geri Dön
          </button>

          <div className="flex items-center mb-6">
            <div className="p-4 bg-gradient-teal rounded-xl mr-6 border-2 border-teal-light/30 shadow-lg">
              <PaintBrushIcon className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="heading-seljuk-large text-4xl font-bold text-brown-dark mb-3 drop-shadow-lg">
                Sosyal ve Sanatsal Yayınlar
              </h1>
              <p className="text-xl text-brown-light max-w-3xl font-bookmania">
                Blog yazıları, sosyal medya içerikleri ve sanatsal projelerin yaratıcı koleksiyonu
              </p>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="card-seljuk text-center hover:bg-teal-light/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-teal-dark mb-1">
                {loading ? '...' : stats.totalPublications}
              </div>
              <div className="text-brown-light text-sm font-bookmania">Toplam İçerik</div>
            </div>
            <div className="card-seljuk text-center hover:bg-green-600/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-green-600 mb-1">
                {loading ? '...' : stats.totalViews.toLocaleString()}
              </div>
              <div className="text-brown-light text-sm font-bookmania">Toplam Görüntüleme</div>
            </div>
            <div className="card-seljuk text-center hover:bg-blue-600/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-blue-600 mb-1">
                {loading ? '...' : stats.totalShares.toLocaleString()}
              </div>
              <div className="text-brown-light text-sm font-bookmania">Paylaşım</div>
            </div>
            <div className="card-seljuk text-center hover:bg-amber-600/5 transition-colors">
              <div className="text-2xl font-bookmania-bold text-amber-600 mb-1">
                {loading ? '...' : stats.engagement.toLocaleString()}
              </div>
              <div className="text-brown-light text-sm font-bookmania">Etkileşim</div>
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
                        ? 'bg-gradient-teal text-white shadow-lg border-2 border-teal-light/30'
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
              <p className="text-brown-light font-bookmania">Bu kategoride henüz içerik bulunmuyor.</p>
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
                    <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
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
                      <span className="font-medium mr-2 text-brown-dark">Platform:</span>
                      <span>{publication.platform}</span>
                    </div>
                    <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                      <span className="font-medium mr-2 text-brown-dark">Yorum:</span>
                      <span>{publication.comments}</span>
                    </div>
                    <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                      <span className="font-medium mr-2 text-brown-dark">Kategori:</span>
                      <span>{publication.categoryName}</span>
                    </div>
                    <div className="flex items-center text-brown-dark bg-white/80 p-2 rounded shadow-sm">
                      <span className="font-medium mr-2 text-brown-dark">Tarih:</span>
                      <span>{new Date(publication.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>

                {/* Sağ Taraf - İstatistikler ve Aksiyonlar */}
                <div className="lg:w-64 space-y-4">
                  <div className="bg-gray-100/80 rounded-lg p-4 shadow-sm">
                    <h4 className="text-brown-dark font-medium mb-3">Etkileşim</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>Görüntülenme:</span>
                        <span className="text-blue-600 font-medium">{(publication.viewCount || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>Beğeni:</span>
                        <span className="text-emerald-600 font-medium">{publication.likeCount || 0}</span>
                      </div>
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>Yorum:</span>
                        <span className="text-purple-600 font-medium">{publication.comments}</span>
                      </div>
                      <div className="flex justify-between text-brown-dark bg-white/70 p-2 rounded">
                        <span>Paylaşım:</span>
                        <span className="text-amber-600 font-medium">{Math.floor(Math.random() * 50)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button 
                      onClick={() => router.push(`/articles/${publication.slug}`)}
                      className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:bg-teal-700 transition-colors"
                    >
                      Okumaya Devam Et
                    </button>
                    <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-600 transition-colors">
                      Paylaş
                    </button>
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
                      ? 'bg-teal-600 text-white'
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

export default SocialArtisticPublicationsPage;