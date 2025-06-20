import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { ArticleMedia } from './article-media.entity';

export enum ArticleType {
  ACADEMIC_PAPER = 'academic_paper', // IEEE style with PDF
  BLOG_POST = 'blog_post', // Medium style article
  RESEARCH = 'research',
  ESSAY = 'essay',
  REVIEW = 'review'
}

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string; // Short description/summary

  @Column({ type: 'text' })
  content: string; // Rich text content for blog posts

  @Column({
    type: 'enum',
    enum: ArticleType,
    default: ArticleType.BLOG_POST
  })
  type: ArticleType;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT
  })
  status: ArticleStatus;

  @Column({ nullable: true })
  featuredImage: string;

  @Column({ nullable: true })
  pdfFile: string; // For academic papers

  @Column({ nullable: true })
  doi: string; // Digital Object Identifier for academic papers

  @Column({ nullable: true })
  journal: string; // Journal name for academic papers

  @Column({ nullable: true })
  publishedDate: Date; // Original publication date

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-array', nullable: true })
  keywords: string[]; // For academic papers

  @Column({ type: 'simple-array', nullable: true })
  authors: string[]; // Co-authors

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: true })
  allowComments: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  // SEO fields
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @ManyToOne(() => Category, category => category.articles)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  @OneToMany(() => ArticleMedia, media => media.article)
  media: ArticleMedia[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
