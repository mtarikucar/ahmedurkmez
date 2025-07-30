import { notFound } from 'next/navigation';
import ArticleDetailPage from '@/components/pages/ArticleDetailPage';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  return <ArticleDetailPage slug={slug} />;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  
  // Bu kısım gerçek API'den makale bilgisi çekerek dinamik meta data oluşturacak
  return {
    title: `Makale - Ahmed Ürkmez`,
    description: 'Ahmed Ürkmez\'in edebiyat ve akademik araştırma makalesi',
  };
}
