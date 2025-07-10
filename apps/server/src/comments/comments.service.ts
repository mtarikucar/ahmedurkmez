import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment, CommentStatus } from '../entities/comment.entity';
import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';

export interface CreateCommentDto {
  content: string;
  articleId: number;
  parentId?: number;
  authorName?: string;
  authorEmail?: string;
  authorWebsite?: string;
  isGuest?: boolean;
  userId?: number;
}

export interface UpdateCommentDto {
  content?: string;
  status?: CommentStatus;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Comment> {
    // Verify article exists and allows comments
    const article = await this.articleRepository.findOne({
      where: { id: createCommentDto.articleId },
    });

    if (!article) {
      throw new BadRequestException('Article not found');
    }

    if (!article.allowComments) {
      throw new BadRequestException(
        'Comments are not allowed for this article',
      );
    }

    // If parentId is provided, verify parent comment exists
    if (createCommentDto.parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: createCommentDto.parentId },
      });

      if (!parentComment) {
        throw new BadRequestException('Parent comment not found');
      }
    }

    // If userId is provided, verify user exists
    if (createCommentDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: createCommentDto.userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      ipAddress,
      userAgent,
      status: CommentStatus.PENDING, // All comments start as pending
    });

    return this.commentRepository.save(comment);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: CommentStatus;
    articleId?: number;
  }): Promise<{
    comments: Comment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.replies', 'replies');

    if (options?.status) {
      queryBuilder.andWhere('comment.status = :status', {
        status: options.status,
      });
    }

    if (options?.articleId) {
      queryBuilder.andWhere('comment.articleId = :articleId', {
        articleId: options.articleId,
      });
    }

    queryBuilder.orderBy('comment.createdAt', 'DESC');

    const [comments, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      comments,
      total,
      page,
      limit,
    };
  }

  async findByArticle(articleId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        articleId,
        status: CommentStatus.APPROVED,
        parentId: IsNull(), // Only get top-level comments
      },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'article', 'parent', 'replies'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async approve(id: number): Promise<Comment> {
    return this.update(id, { status: CommentStatus.APPROVED });
  }

  async reject(id: number): Promise<Comment> {
    return this.update(id, { status: CommentStatus.REJECTED });
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepository.remove(comment);
  }

  async incrementLike(id: number): Promise<Comment> {
    await this.commentRepository.increment({ id }, 'likeCount', 1);
    return this.findOne(id);
  }

  async getPendingCount(): Promise<number> {
    return this.commentRepository.count({
      where: { status: CommentStatus.PENDING },
    });
  }
}
