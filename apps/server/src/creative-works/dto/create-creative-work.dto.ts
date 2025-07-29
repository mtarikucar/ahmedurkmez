import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, IsDate, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { CreativeWorkType } from '../../entities/creative-work.entity';
import { PublicationStatus } from '../../entities/publication.entity';

export class CreateCreativeWorkDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(CreativeWorkType)
  workType?: CreativeWorkType;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  eventDate?: Date;

  @IsOptional()
  @IsString()
  audience?: string;

  @IsOptional()
  @IsString()
  pdfFile?: string;

  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;

  // For poems
  @IsOptional()
  @IsString()
  meter?: string;

  @IsOptional()
  @IsString()
  rhymeScheme?: string;

  // For essays (calculated automatically)
  @IsOptional()
  @IsNumber()
  wordCount?: number;

  @IsOptional()
  @IsNumber()
  readingTime?: number;

  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  allowComments?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
