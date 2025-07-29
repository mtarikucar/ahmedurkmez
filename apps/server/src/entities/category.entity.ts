import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';

export enum CategoryType {
  PRINTED_PUBLICATIONS = 'printed_publications',
  AUDIO_VIDEO_PUBLICATIONS = 'audio_video_publications',
  SOCIAL_ARTISTIC_PUBLICATIONS = 'social_artistic_publications'
}

export enum SubCategoryType {
  // Basılı Yayınlar
  BOOKS = 'books',
  ARTICLES = 'articles',
  PAPERS = 'papers',

  // Sesli/Görüntülü Yayınlar
  TV_SHOWS = 'tv_shows',
  RADIO_SHOWS = 'radio_shows',
  MOSQUE_LESSONS = 'mosque_lessons',

  // Sosyal/Sanatsal Yayınlar
  PRESENTATIONS = 'presentations',
  POEMS = 'poems',
  ESSAYS = 'essays'
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  color: string; // Hex color code for UI

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  // Ana kategori tipi (Basılı Yayınlar, Sesli/Görüntülü Yayınlar, Sosyal/Sanatsal Yayınlar)
  @Column({
    type: 'enum',
    enum: CategoryType,
    nullable: true
  })
  type: CategoryType;

  // Alt kategori tipi (Kitaplar, Makaleler, vs.)
  @Column({
    type: 'enum',
    enum: SubCategoryType,
    nullable: true
  })
  subType: SubCategoryType;

  // Parent category için self-referencing relationship
  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
