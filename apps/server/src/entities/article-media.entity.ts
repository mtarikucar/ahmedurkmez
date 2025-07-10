import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  YOUTUBE = 'youtube',
  VIMEO = 'vimeo',
}

@Entity('article_media')
export class ArticleMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Column()
  url: string; // File path or external URL

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  fileSize: number; // in bytes

  @Column({ nullable: true })
  duration: number; // for videos/audio in seconds

  @Column({ nullable: true })
  width: number; // for images/videos

  @Column({ nullable: true })
  height: number; // for images/videos

  @Column({ nullable: true })
  alt: string; // Alt text for images

  @Column({ nullable: true })
  caption: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  // For external videos (YouTube, Vimeo)
  @Column({ nullable: true })
  externalId: string; // Video ID from external platform

  @Column({ nullable: true })
  embedCode: string; // Custom embed code

  @ManyToOne(() => Article, (article) => article.media)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @Column()
  articleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
