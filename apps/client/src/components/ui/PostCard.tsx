import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PostCardProps {
  id: number;
  title: string;
  excerpt?: string;
  slug: string;
  createdAt: string;
  category?: {
    name: string;
    color?: string;
  };
  viewCount?: number;
  likeCount?: number;
  imageUrl?: string;
}

export default function PostCard({
  id,
  title,
  excerpt,
  slug,
  createdAt,
  category,
  viewCount = 0,
  likeCount = 0,
  imageUrl
}: PostCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full font-bookmania" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between text-xs mb-2">
          {category && (
            <span
              className="px-2 py-1 rounded-full text-white text-xs font-medium font-bookmania"
              style={{ backgroundColor: category.color || 'var(--center-secondary)' }}
            >
              {category.name}
            </span>
          )}
          <time style={{ color: 'var(--text-secondary)' }} className="font-bookmania">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: tr
            })}
          </time>
        </div>
        <CardTitle className="text-sm font-semibold leading-tight line-clamp-2 font-bookmania" style={{ color: 'var(--text-primary)' }}>
          <Link href={`/articles/${slug}`} className="transition-colors" style={{ color: 'var(--text-primary)' }}>
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {excerpt && (
          <p className="text-xs line-clamp-3 mb-3 font-bookmania" style={{ color: 'var(--text-secondary)' }}>{excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3 font-bookmania" style={{ color: 'var(--text-light)' }}>
            <span>{viewCount} görüntüleme</span>
            <span>{likeCount} beğeni</span>
          </div>
          <Link
            href={`/articles/${slug}`}
            className="font-medium transition-colors font-bookmania"
            style={{ color: 'var(--center-secondary)' }}
          >
            Devamı →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
