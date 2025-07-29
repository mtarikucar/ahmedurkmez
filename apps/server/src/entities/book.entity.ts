import { Entity, Column, ChildEntity } from 'typeorm';
import { Publication } from './publication.entity';

export enum BookType {
  THEORETICAL = 'theoretical',
  TEXT = 'text', 
  TRANSLATION = 'translation',
  DIARY_MEMOIR = 'diary_memoir',
  E_BOOK = 'e_book'
}

@ChildEntity('book')
export class Book extends Publication {
  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: BookType,
    default: BookType.THEORETICAL
  })
  bookType: BookType;

  @Column({ nullable: true })
  isbn: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  publishYear: number;

  @Column({ nullable: true })
  pageCount: number;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  pdfFile: string; // PDF file path for download/view

  @Column({ nullable: true })
  purchaseLink: string; // Link to buy the book

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;
}
