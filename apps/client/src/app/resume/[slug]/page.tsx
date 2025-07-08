import { notFound } from 'next/navigation';
import ResumeDetailPage from '@/components/pages/ResumeDetailPage';

interface ResumePageProps {
  params: {
    slug: string;
  };
}

export default function ResumePage({ params }: ResumePageProps) {
  if (!params.slug) {
    notFound();
  }

  return <ResumeDetailPage slug={params.slug} />;
}

export async function generateMetadata({ params }: ResumePageProps) {
  const titles: { [key: string]: string } = {
    'egitim-hayatim': 'Eğitim Hayatım - Ahmed Ürkmez',
    'akademik-kariyerim': 'Akademik Kariyerim - Ahmed Ürkmez',
    'yayin-ve-eserlerim': 'Yayın ve Eserlerim - Ahmed Ürkmez'
  };

  return {
    title: titles[params.slug] || 'Özgeçmiş - Ahmed Ürkmez',
    description: 'Ahmed Ürkmez\'in akademik ve mesleki yaşam öyküsü',
  };
}
