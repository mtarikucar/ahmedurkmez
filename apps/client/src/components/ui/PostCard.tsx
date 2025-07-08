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
    <Card className="card-seljuk hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full font-bookmania group border-2 border-white/20 hover:border-teal-light">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between text-xs mb-2">
          {category && (
            <span
              className="px-3 py-1 rounded-full text-white text-xs font-bookmania-medium shadow-sm"
              style={{ backgroundColor: category.color || 'var(--burgundy-medium)' }}
            >
              {category.name}
            </span>
          )}
          <time className="font-bookmania text-brown-light">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: tr
            })}
          </time>
        </div>
        <CardTitle className="text-sm font-bookmania-bold leading-tight line-clamp-2 text-brown-dark group-hover:text-teal-dark transition-colors duration-300">
          <Link href={`/articles/${slug}`} className="transition-colors">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {excerpt && (
          <p className="text-xs line-clamp-3 mb-3 font-bookmania text-brown-light">{excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3 font-bookmania text-brown-light">
            <span>{viewCount} görüntüleme</span>
            <span>{likeCount} beğeni</span>
          </div>
          <Link
            href={`/articles/${slug}`}
            className="font-bookmania-medium transition-all duration-300 text-burgundy-medium hover:text-teal-dark hover:scale-105 transform"
          >
            Devamı →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
