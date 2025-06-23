import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PostCard from './PostCard';

interface Article {
  id: number;
  title: string;
  excerpt?: string;
  slug: string;
  createdAt: string;
  category: {
    name: string;
    color?: string;
  };
  viewCount?: number;
  likeCount?: number;
  imageUrl?: string;
}

interface CategoryData {
  id: number;
  name: string;
  description?: string;
  color?: string;
  articles: Article[];
  children?: CategoryData[];
}

interface CategorySectionProps {
  category: CategoryData;
  level?: number;
  isSticky?: boolean;
}

export default function CategorySection({ 
  category, 
  level = 0, 
  isSticky = false 
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const hasChildren = category.children && category.children.length > 0;
  const hasArticles = category.articles && category.articles.length > 0;

  return (
    <div className="mb-6">
      {/* Category Header */}
      <div
        className={`
          flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all font-bookmania
          ${isSticky && level === 0 ? 'sticky top-4 z-10' : ''}
          hover:shadow-md
        `}
        style={{
          marginLeft: `${level * 16}px`,
          backgroundColor: level === 0
            ? 'rgba(255, 255, 255, 0.2)'
            : level === 1
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: level > 0 ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {hasChildren && (
            isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 text-white" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-white" />
            )
          )}
          <div>
            <h3 className={`font-semibold font-bookmania text-white ${level === 0 ? 'text-lg' : 'text-sm'}`}>
              {category.name}
            </h3>
            {category.description && level === 0 && (
              <p className="text-xs opacity-90 mt-1 text-white font-bookmania">{category.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {category.color && level > 0 && (
            <div
              className="w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: category.color }}
            />
          )}
          <span className="text-xs opacity-75 text-white font-bookmania">
            {category.articles?.length || 0} yazı
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4" style={{ marginLeft: `${level * 16}px` }}>
          {/* Articles Grid */}
          {hasArticles && (
            <div className="grid grid-cols-1 gap-4 mb-6">
              {category.articles.slice(0, 3).map((article) => (
                <PostCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  slug={article.slug}
                  createdAt={article.createdAt}
                  category={article.category}
                  viewCount={article.viewCount}
                  likeCount={article.likeCount}
                  imageUrl={article.imageUrl}
                />
              ))}
            </div>
          )}

          {/* Child Categories */}
          {hasChildren && (
            <div className="space-y-4">
              {category.children.map((childCategory) => (
                <CategorySection
                  key={childCategory.id}
                  category={childCategory}
                  level={level + 1}
                  isSticky={false}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
