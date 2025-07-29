import { Entity, Column, ChildEntity } from 'typeorm';
import { Publication } from './publication.entity';

export enum MediaType {
  TV_SHOW = 'tv_show',
  RADIO_SHOW = 'radio_show',
  MOSQUE_LESSON = 'mosque_lesson'
}

@ChildEntity('media_publication')
export class MediaPublication extends Publication {
  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.TV_SHOW
  })
  mediaType: MediaType;

  @Column()
  youtubeUrl: string; // YouTube video URL

  @Column({ nullable: true })
  duration: number; // Duration in seconds

  @Column({ nullable: true })
  channel: string; // TV/Radio channel name

  @Column({ nullable: true })
  program: string; // Program name

  @Column({ nullable: true })
  episode: string; // Episode number or name

  @Column({ nullable: true })
  airDate: Date; // When it was aired

  @Column({ nullable: true })
  location: string; // Location where it was recorded (for mosque lessons)

  @Column({ type: 'text', nullable: true })
  transcript: string; // Text transcript of the media

  @Column('simple-array', { nullable: true })
  participants: string[]; // Other participants in the show
}
