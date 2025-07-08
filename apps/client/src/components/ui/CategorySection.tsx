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
          flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 font-bookmania group
          ${isSticky && level === 0 ? 'sticky top-4 z-10' : ''}
          hover:shadow-xl hover:scale-105 transform
          ${level === 0
            ? 'bg-white/25 backdrop-blur-sm border-2 border-white/40'
            : level === 1
            ? 'bg-white/20 backdrop-blur-sm border border-white/30'
            : 'bg-white/15 backdrop-blur-sm border border-white/20'
          }
        `}
        style={{
          marginLeft: `${level * 16}px`,
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {hasChildren && (
            isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
            )
          )}
          <div>
            <h3 className={`font-bookmania-bold text-white ${level === 0 ? 'text-lg' : 'text-sm'} group-hover:text-cream transition-colors duration-300`}>
              {category.name}
            </h3>
            {category.description && level === 0 && (
              <p className="text-xs opacity-90 mt-1 text-white font-bookmania italic">{category.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {category.color && level > 0 && (
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: category.color }}
            />
          )}
          <div className="bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
            <span className="text-xs font-bookmania-medium text-white">
              {category.articles?.length || 0} yazı
            </span>
          </div>
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
