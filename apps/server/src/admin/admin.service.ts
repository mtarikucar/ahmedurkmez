import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Article, ArticleStatus } from '../entities/article.entity';
import { Comment, CommentStatus } from '../entities/comment.entity';
import { Contact, ContactStatus } from '../entities/contact.entity';
import { Category } from '../entities/category.entity';
import { ArticleMedia } from '../entities/article-media.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ArticleMedia)
    private mediaRepository: Repository<ArticleMedia>,
  ) {}

  async getDashboardStats(): Promise<{
    users: {
      total: number;
      active: number;
      admins: number;
    };
    articles: {
      total: number;
      published: number;
      draft: number;
      archived: number;
    };
    comments: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
    contacts: {
      total: number;
      new: number;
      read: number;
      replied: number;
    };
    categories: {
      total: number;
      active: number;
    };
    media: {
      total: number;
      totalSize: number;
    };
  }> {
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      totalArticles,
      publishedArticles,
      draftArticles,
      archivedArticles,
      totalComments,
      pendingComments,
      approvedComments,
      rejectedComments,
      totalContacts,
      newContacts,
      readContacts,
      repliedContacts,
      totalCategories,
      activeCategories,
      totalMedia,
      mediaFiles,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      this.articleRepository.count(),
      this.articleRepository.count({ where: { status: ArticleStatus.PUBLISHED } }),
      this.articleRepository.count({ where: { status: ArticleStatus.DRAFT } }),
      this.articleRepository.count({ where: { status: ArticleStatus.ARCHIVED } }),
      this.commentRepository.count(),
      this.commentRepository.count({ where: { status: CommentStatus.PENDING } }),
      this.commentRepository.count({ where: { status: CommentStatus.APPROVED } }),
      this.commentRepository.count({ where: { status: CommentStatus.REJECTED } }),
      this.contactRepository.count(),
      this.contactRepository.count({ where: { status: ContactStatus.NEW } }),
      this.contactRepository.count({ where: { status: ContactStatus.READ } }),
      this.contactRepository.count({ where: { status: ContactStatus.REPLIED } }),
      this.categoryRepository.count(),
      this.categoryRepository.count({ where: { isActive: true } }),
      this.mediaRepository.count(),
      this.mediaRepository.find({ select: ['fileSize'] }),
    ]);

    const totalMediaSize = mediaFiles.reduce((sum, file) => sum + (file.fileSize || 0), 0);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
      },
      articles: {
        total: totalArticles,
        published: publishedArticles,
        draft: draftArticles,
        archived: archivedArticles,
      },
      comments: {
        total: totalComments,
        pending: pendingComments,
        approved: approvedComments,
        rejected: rejectedComments,
      },
      contacts: {
        total: totalContacts,
        new: newContacts,
        read: readContacts,
        replied: repliedContacts,
      },
      categories: {
        total: totalCategories,
        active: activeCategories,
      },
      media: {
        total: totalMedia,
        totalSize: totalMediaSize,
      },
    };
  }

  async getRecentActivity(): Promise<{
    recentArticles: Article[];
    recentComments: Comment[];
    recentContacts: Contact[];
  }> {
    const [recentArticles, recentComments, recentContacts] = await Promise.all([
      this.articleRepository.find({
        relations: ['category'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.commentRepository.find({
        relations: ['article', 'user'],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.contactRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    return {
      recentArticles,
      recentComments,
      recentContacts,
    };
  }

  async getPopularArticles(limit: number = 10): Promise<Article[]> {
    return this.articleRepository.find({
      where: { status: ArticleStatus.PUBLISHED },
      relations: ['category'],
      order: { viewCount: 'DESC' },
      take: limit,
    });
  }

  async getArticlesByMonth(): Promise<any[]> {
    const query = `
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM articles 
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;
    
    return this.articleRepository.query(query);
  }

  async getCommentsByMonth(): Promise<any[]> {
    const query = `
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*) as count
      FROM comments 
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;
    
    return this.commentRepository.query(query);
  }

  async getTopCategories(): Promise<any[]> {
    const query = `
      SELECT 
        c.name,
        c.id,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a."categoryId"
      WHERE c."isActive" = true
      GROUP BY c.id, c.name
      ORDER BY article_count DESC
      LIMIT 10
    `;
    
    return this.categoryRepository.query(query);
  }
}
