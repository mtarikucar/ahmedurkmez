export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  avatar?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  type: 'academic_paper' | 'blog_post' | 'research' | 'essay' | 'review';
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  pdfFile?: string;
  doi?: string;
  journal?: string;
  publishedDate?: string;
  tags?: string[];
  keywords?: string[];
  authors?: string[];
  viewCount: number;
  likeCount: number;
  allowComments: boolean;
  isFeatured: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  categoryId: number;
  category: Category;
  comments?: Comment[];
  media?: ArticleMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  authorName?: string;
  authorEmail?: string;
  authorWebsite?: string;
  isGuest: boolean;
  likeCount: number;
  parentId?: number;
  parent?: Comment;
  replies?: Comment[];
  userId?: number;
  user?: User;
  articleId: number;
  article?: Article;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleMedia {
  id: number;
  filename: string;
  originalName: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'youtube' | 'vimeo';
  url: string;
  thumbnailUrl?: string;
  mimeType?: string;
  fileSize?: number;
  duration?: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  externalId?: string;
  embedCode?: string;
  articleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
  type: 'general' | 'collaboration' | 'interview' | 'feedback' | 'technical';
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  bio?: string;
}

export interface CreateCommentRequest {
  content: string;
  articleId: number;
  parentId?: number;
  authorName?: string;
  authorEmail?: string;
  authorWebsite?: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
  type?: 'general' | 'collaboration' | 'interview' | 'feedback' | 'technical';
}
