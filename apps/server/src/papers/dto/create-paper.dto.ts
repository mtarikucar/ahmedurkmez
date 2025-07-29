import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PaperType } from '../../entities/paper.entity';
import { PublicationStatus } from '../../entities/publication.entity';

export class CreatePaperDto {
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
  @IsString()
  abstract?: string;

  @IsOptional()
  @IsEnum(PaperType)
  paperType?: PaperType;

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
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

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

  @IsOptional()
  @IsString()
  conference?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  conferenceDate?: Date;

  @IsOptional()
  @IsString()
  conferenceLocation?: string;

  @IsOptional()
  @IsString()
  pdfFile?: string;

  @IsOptional()
  @IsString()
  doi?: string;
}
