import { Entity, Column, ChildEntity } from 'typeorm';
import { Publication } from './publication.entity';

export enum PaperType {
  METHODOLOGY_HISTORY = 'methodology_history',
  SOCIAL_SCIENCES = 'social_sciences', 
  CRITICISM = 'criticism'
}

@ChildEntity('paper')
export class Paper extends Publication {
  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: PaperType,
    default: PaperType.METHODOLOGY_HISTORY
  })
  paperType: PaperType;

  @Column({ nullable: true })
  conference: string; // Conference name where paper was presented

  @Column({ nullable: true })
  conferenceDate: Date;

  @Column({ nullable: true })
  conferenceLocation: string;

  @Column({ nullable: true })
  pdfFile: string; // PDF file path for download/view

  @Column({ nullable: true })
  doi: string; // Digital Object Identifier

  @Column('simple-array', { nullable: true })
  keywords: string[];

  @Column({ type: 'text', nullable: true })
  abstract: string;
}
