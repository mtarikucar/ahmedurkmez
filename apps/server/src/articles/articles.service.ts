import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import {
  Article,
  ArticleStatus,
  ArticleType,
} from '../entities/article.entity';
import { Category } from '../entities/category.entity';
import { ArticleMedia, MediaType } from '../entities/article-media.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ArticleMedia)
    private articleMediaRepository: Repository<ArticleMedia>,
    private uploadService: UploadService,
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
  }): Promise<{
    data: Article[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.media', 'media');

    // Apply filters
    if (options?.status) {
      queryBuilder.andWhere('article.status = :status', {
        status: options.status,
      });
    }

    if (options?.type) {
      queryBuilder.andWhere('article.type = :type', { type: options.type });
    }

    if (options?.categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', {
        categoryId: options.categoryId,
      });
    }

    if (options?.featured !== undefined) {
      queryBuilder.andWhere('article.isFeatured = :featured', {
        featured: options.featured,
      });
    }

    if (options?.search) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.content ILIKE :search OR article.excerpt ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    // Order by featured first, then by creation date
    queryBuilder
      .orderBy('article.isFeatured', 'DESC')
      .addOrderBy('article.sortOrder', 'ASC')
      .addOrderBy('article.createdAt', 'DESC');

    const [articles, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: articles,
      meta: {
        total,
        page,
        limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
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

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.findOne(id);

    // If title is being updated, regenerate slug
    if (
      'title' in updateArticleDto &&
      updateArticleDto.title &&
      updateArticleDto.title !== article.title
    ) {
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
        status: ArticleStatus.PUBLISHED,
      },
      relations: ['category'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async findAllSimple(options?: {
    status?: ArticleStatus;
    type?: ArticleType;
    categoryId?: number;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<Article[]> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.media', 'media');

    // Apply filters
    if (options?.status) {
      queryBuilder.andWhere('article.status = :status', {
        status: options.status,
      });
    }

    if (options?.type) {
      queryBuilder.andWhere('article.type = :type', { type: options.type });
    }

    if (options?.categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', {
        categoryId: options.categoryId,
      });
    }

    if (options?.featured !== undefined) {
      queryBuilder.andWhere('article.isFeatured = :featured', {
        featured: options.featured,
      });
    }

    if (options?.search) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.content ILIKE :search OR article.excerpt ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    // Order by featured first, then by creation date
    queryBuilder
      .orderBy('article.isFeatured', 'DESC')
      .addOrderBy('article.sortOrder', 'ASC')
      .addOrderBy('article.createdAt', 'DESC');

    if (options?.limit) {
      queryBuilder.take(options.limit);
    }

    return queryBuilder.getMany();
  }

  async getRelatedArticles(
    articleId: number,
    limit: number = 5,
  ): Promise<Article[]> {
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

  async uploadPDF(
    articleId: number,
    file: Express.Multer.File,
  ): Promise<{ message: string; media: any; pdfFile: string }> {
    const article = await this.findOne(articleId);

    // Upload the PDF file
    const mediaDto = {
      articleId,
      type: MediaType.DOCUMENT,
    };

    const uploadedMedia = await this.uploadService.uploadFile(file, mediaDto);

    return {
      message: 'PDF uploaded successfully',
      media: uploadedMedia,
      pdfFile: uploadedMedia.url,
    };
  }

  async uploadImage(
    articleId: number,
    file: Express.Multer.File,
  ): Promise<{ message: string; media: any; url: string }> {
    const article = await this.findOne(articleId);

    // Upload the image file
    const mediaDto = {
      articleId,
      type: MediaType.IMAGE,
    };

    const uploadedMedia = await this.uploadService.uploadFile(file, mediaDto);

    return {
      message: 'Image uploaded successfully',
      media: uploadedMedia,
      url: uploadedMedia.url,
    };
  }

  async embedVideo(
    articleId: number,
    embedData: { url: string; title?: string },
  ): Promise<ArticleMedia> {
    const article = await this.findOne(articleId);

    // Determine video type and extract ID
    let mediaType: MediaType;
    let externalId: string;
    let embedUrl: string;

    const { url, title } = embedData;

    // YouTube detection
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    );
    if (youtubeMatch) {
      mediaType = MediaType.YOUTUBE;
      externalId = youtubeMatch[1];
      embedUrl = `https://www.youtube.com/embed/${externalId}`;
    } else {
      // Vimeo detection
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        mediaType = MediaType.VIMEO;
        externalId = vimeoMatch[1];
        embedUrl = `https://player.vimeo.com/video/${externalId}`;
      } else {
        // Direct video URL
        mediaType = MediaType.VIDEO;
        externalId = '';
        embedUrl = url;
      }
    }

    // Create media entry
    const media = this.articleMediaRepository.create({
      articleId,
      filename: `video_${Date.now()}`,
      originalName: title || `Video from ${url}`,
      type: mediaType,
      url: embedUrl,
      externalId,
      embedCode: `<iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`,
    });

    return this.articleMediaRepository.save(media);
  }
}
