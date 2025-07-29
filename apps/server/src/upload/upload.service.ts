import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ArticleMedia, MediaType } from '../entities/article-media.entity';
import * as fs from 'fs';
import * as path from 'path';

export interface CreateMediaDto {
  articleId: number;
  type: MediaType;
  url?: string; // For external URLs
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
  description?: string;
  sortOrder?: number;
  externalId?: string; // For YouTube, Vimeo etc.
  embedCode?: string;
}

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(ArticleMedia)
    private mediaRepository: Repository<ArticleMedia>,
    private configService: ConfigService,
  ) {}

  async uploadPDF(file: Express.Multer.File): Promise<{ url: string; filename: string; size: number }> {
    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3001',
    );

    // File is already saved by multer, just return the URL
    const fileUrl = `${baseUrl}/uploads/pdfs/${file.filename}`;

    return {
      url: fileUrl,
      filename: file.filename,
      size: file.size,
    };
  }

  async uploadFile(
    file: Express.Multer.File,
    createMediaDto: CreateMediaDto,
  ): Promise<ArticleMedia> {
    const uploadPath = this.configService.get<string>(
      'UPLOAD_PATH',
      './uploads',
    );
    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3001',
    );
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    // Determine media type based on file extension
    const mediaType = this.getMediaTypeFromFile(file);

    const media = this.mediaRepository.create({
      ...createMediaDto,
      filename: file.filename,
      originalName: file.originalname,
      type: mediaType,
      url: fileUrl,
      mimeType: file.mimetype,
      fileSize: file.size,
    });

    return this.mediaRepository.save(media);
  }

  async createExternalMedia(
    createMediaDto: CreateMediaDto,
  ): Promise<ArticleMedia> {
    if (!createMediaDto.url && !createMediaDto.externalId) {
      throw new BadRequestException(
        'Either URL or external ID must be provided',
      );
    }

    const media = this.mediaRepository.create(createMediaDto);
    return this.mediaRepository.save(media);
  }

  async findAll(): Promise<ArticleMedia[]> {
    return this.mediaRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      relations: ['article'],
    });
  }

  async findByArticle(articleId: number): Promise<ArticleMedia[]> {
    return this.mediaRepository.find({
      where: { articleId, isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ArticleMedia> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['article'],
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async update(
    id: number,
    updateData: Partial<CreateMediaDto>,
  ): Promise<ArticleMedia> {
    const media = await this.findOne(id);
    Object.assign(media, updateData);
    return this.mediaRepository.save(media);
  }

  async remove(id: number): Promise<void> {
    const media = await this.findOne(id);

    // If it's a file upload, delete the physical file
    if (media.filename && !media.url.startsWith('http')) {
      const uploadPath = this.configService.get<string>(
        'UPLOAD_PATH',
        './uploads',
      );
      const filePath = path.join(uploadPath, media.filename);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    await this.mediaRepository.remove(media);
  }

  async getYouTubeVideoInfo(videoId: string): Promise<any> {
    // This would integrate with YouTube API to get video information
    // For now, return basic structure
    return {
      id: videoId,
      title: 'YouTube Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    };
  }

  private getMediaTypeFromFile(file: Express.Multer.File): MediaType {
    const mimeType = file.mimetype.toLowerCase();

    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    } else if (mimeType.startsWith('audio/')) {
      return MediaType.AUDIO;
    } else {
      return MediaType.DOCUMENT;
    }
  }

  async generateThumbnail(file: Express.Multer.File): Promise<string | null> {
    // This would generate thumbnails for videos and images
    // Implementation would depend on image processing library like Sharp
    return null;
  }

  async getFileStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    byType: Record<MediaType, number>;
  }> {
    const allMedia = await this.mediaRepository.find();

    const stats = {
      totalFiles: allMedia.length,
      totalSize: allMedia.reduce(
        (sum, media) => sum + (media.fileSize || 0),
        0,
      ),
      byType: {
        [MediaType.IMAGE]: 0,
        [MediaType.VIDEO]: 0,
        [MediaType.AUDIO]: 0,
        [MediaType.DOCUMENT]: 0,
        [MediaType.YOUTUBE]: 0,
        [MediaType.VIMEO]: 0,
      },
    };

    allMedia.forEach((media) => {
      stats.byType[media.type]++;
    });

    return stats;
  }
}
