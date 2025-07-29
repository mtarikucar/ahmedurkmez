import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  TableInheritance,
} from 'typeorm';
import { Category } from './category.entity';

export enum PublicationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

@Entity('publications')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PublicationStatus,
    default: PublicationStatus.DRAFT
  })
  status: PublicationStatus;

  @Column({ nullable: true })
  featuredImage: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ default: true })
  allowComments: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  sortOrder: number;

  // Category relationship
  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  publishedAt: Date;
}
