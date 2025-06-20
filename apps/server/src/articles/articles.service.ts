import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Article, ArticleStatus, ArticleType } from '../entities/article.entity';
import { Category } from '../entities/category.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    // Verify category exists
    const category = await this.categoryRepository.findOne({
      where: { id: createArticleDto.categoryId },
    });
    
    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Generate slug from title
    const slug = this.generateSlug(createArticleDto.title);
    
    // Check if slug already exists
    const existingArticle = await this.articleRepository.findOne({
      where: { slug },
    });
    
    if (existingArticle) {
      throw new BadRequestException('Article with this title already exists');
    }

    const articleData: any = {
      ...createArticleDto,
      slug,
    };

    if (createArticleDto.publishedDate) {
      articleData.publishedDate = new Date(createArticleDto.publishedDate);
    }

    const article = this.articleRepository.create(articleData);
    await this.articleRepository.save(article);

    // Return the saved article with relations using slug since it's unique
    const result = await this.articleRepository.findOne({
      where: { slug: articleData.slug },
      relations: ['category'],
    });

    if (!result) {
      throw new BadRequestException('Failed to create article');
    }

    return result;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: ArticleStatus;
    type?: ArticleType;
    categoryId?: number;
    search?: string;
    featured?: boolean;
  }): Promise<{ articles: Article[]; total: number; page: number; limit: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.media', 'media');

    // Apply filters
    if (options?.status) {
      queryBuilder.andWhere('article.status = :status', { status: options.status });
    }

    if (options?.type) {
      queryBuilder.andWhere('article.type = :type', { type: options.type });
    }

    if (options?.categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId: options.categoryId });
    }

    if (options?.featured !== undefined) {
      queryBuilder.andWhere('article.isFeatured = :featured', { featured: options.featured });
    }

    if (options?.search) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.content ILIKE :search OR article.excerpt ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    // Order by featured first, then by creation date
    queryBuilder.orderBy('article.isFeatured', 'DESC')
                .addOrderBy('article.sortOrder', 'ASC')
                .addOrderBy('article.createdAt', 'DESC');

    const [articles, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      articles,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['category', 'media', 'comments'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug, status: ArticleStatus.PUBLISHED },
      relations: ['category', 'media'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Increment view count
    await this.articleRepository.increment({ id: article.id }, 'viewCount', 1);

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);

    // If title is being updated, regenerate slug
    if ('title' in updateArticleDto && updateArticleDto.title && updateArticleDto.title !== article.title) {
      const newSlug = this.generateSlug(updateArticleDto.title);
      const existingArticle = await this.articleRepository.findOne({
        where: { slug: newSlug },
      });

      if (existingArticle && existingArticle.id !== id) {
        throw new BadRequestException('Article with this title already exists');
      }

      (updateArticleDto as any).slug = newSlug;
    }

    // If category is being updated, verify it exists
    if ('categoryId' in updateArticleDto && updateArticleDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateArticleDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    Object.assign(article, updateArticleDto);

    if ('publishedDate' in updateArticleDto && updateArticleDto.publishedDate) {
      article.publishedDate = new Date(updateArticleDto.publishedDate);
    }

    return this.articleRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    const article = await this.findOne(id);
    await this.articleRepository.remove(article);
  }

  async incrementLike(id: number): Promise<Article> {
    await this.articleRepository.increment({ id }, 'likeCount', 1);
    return this.findOne(id);
  }

  async getFeaturedArticles(limit: number = 5): Promise<Article[]> {
    return this.articleRepository.find({
      where: { 
        isFeatured: true, 
        status: ArticleStatus.PUBLISHED 
      },
      relations: ['category'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRelatedArticles(articleId: number, limit: number = 5): Promise<Article[]> {
    const article = await this.findOne(articleId);
    
    return this.articleRepository.find({
      where: {
        categoryId: article.categoryId,
        status: ArticleStatus.PUBLISHED,
        id: Not(articleId),
      },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
