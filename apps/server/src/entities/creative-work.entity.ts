import { Entity, Column, ChildEntity } from 'typeorm';
import { Publication } from './publication.entity';

export enum CreativeWorkType {
  PRESENTATION = 'presentation',
  POEM = 'poem',
  ESSAY = 'essay'
}

@ChildEntity('creative_work')
export class CreativeWork extends Publication {
  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: CreativeWorkType,
    default: CreativeWorkType.PRESENTATION
  })
  workType: CreativeWorkType;

  @Column({ nullable: true })
  venue: string; // Where presentation was given or poem was recited

  @Column({ nullable: true })
  eventDate: Date; // Date of presentation/recital

  @Column({ nullable: true })
  audience: string; // Target audience description

  @Column({ nullable: true })
  pdfFile: string; // PDF file for presentations

  @Column({ nullable: true })
  videoUrl: string; // Video URL if available

  @Column({ nullable: true })
  audioUrl: string; // Audio URL if available

  // For poems specifically
  @Column({ nullable: true })
  meter: string; // Poetic meter (for poems)

  @Column({ nullable: true })
  rhymeScheme: string; // Rhyme scheme (for poems)

  // For essays specifically  
  @Column({ nullable: true })
  wordCount: number; // Word count (for essays)

  @Column({ nullable: true })
  readingTime: number; // Estimated reading time in minutes
}
