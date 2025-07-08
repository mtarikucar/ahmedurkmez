import { notFound } from 'next/navigation';
import ArticleDetailPage from '@/components/pages/ArticleDetailPage';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  if (!params.slug) {
    notFound();
  }

  return <ArticleDetailPage slug={params.slug} />;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  // Bu kısım gerçek API'den makale bilgisi çekerek dinamik meta data oluşturacak
  return {
    title: `Makale - Ahmed Ürkmez`,
    description: 'Ahmed Ürkmez\'in edebiyat ve akademik araştırma makalesi',
  };
}
