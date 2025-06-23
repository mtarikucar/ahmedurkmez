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
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
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
              className="px-2 py-1 rounded-full text-white text-xs font-medium"
              style={{ backgroundColor: category.color || '#6366f1' }}
            >
              {category.name}
            </span>
          )}
          <time className="text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { 
              addSuffix: true, 
              locale: tr 
            })}
          </time>
        </div>
        <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
          <Link href={`/articles/${slug}`} className="hover:text-indigo-600 transition-colors">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {excerpt && (
          <p className="text-xs text-gray-600 line-clamp-3 mb-3">{excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span>{viewCount} görüntüleme</span>
            <span>{likeCount} beğeni</span>
          </div>
          <Link 
            href={`/articles/${slug}`}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Devamı →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
