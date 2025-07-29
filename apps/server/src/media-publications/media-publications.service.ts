import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaPublication, MediaType } from '../entities/media-publication.entity';
import { Category } from '../entities/category.entity';
import { PublicationStatus } from '../entities/publication.entity';
import { CreateMediaPublicationDto } from './dto/create-media-publication.dto';
import { UpdateMediaPublicationDto } from './dto/update-media-publication.dto';

@Injectable()
export class MediaPublicationsService {
  constructor(
    @InjectRepository(MediaPublication)
    private mediaPublicationRepository: Repository<MediaPublication>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createMediaPublicationDto: CreateMediaPublicationDto): Promise<MediaPublication> {
    const mediaPublication = this.mediaPublicationRepository.create(createMediaPublicationDto);
    return await this.mediaPublicationRepository.save(mediaPublication);
  }

  async findAll(query?: any): Promise<{ data: MediaPublication[]; total: number }> {
    const queryBuilder = this.mediaPublicationRepository
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.category', 'category')
      .orderBy('media.createdAt', 'DESC');

    if (query?.status) {
      queryBuilder.andWhere('media.status = :status', { status: query.status });
    }

    if (query?.mediaType) {
      queryBuilder.andWhere('media.mediaType = :mediaType', { mediaType: query.mediaType });
    }

    if (query?.categoryId) {
      queryBuilder.andWhere('media.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(media.title ILIKE :search OR media.description ILIKE :search OR media.channel ILIKE :search OR media.program ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<MediaPublication> {
    const mediaPublication = await this.mediaPublicationRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!mediaPublication) {
      throw new NotFoundException(`Media publication with ID ${id} not found`);
    }

    return mediaPublication;
  }

  async update(id: number, updateMediaPublicationDto: UpdateMediaPublicationDto): Promise<MediaPublication> {
    const mediaPublication = await this.findOne(id);
    Object.assign(mediaPublication, updateMediaPublicationDto);
    return await this.mediaPublicationRepository.save(mediaPublication);
  }

  async remove(id: number): Promise<void> {
    const mediaPublication = await this.findOne(id);
    await this.mediaPublicationRepository.remove(mediaPublication);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.mediaPublicationRepository.increment({ id }, 'viewCount', 1);
  }

  async findByMediaType(mediaType: MediaType): Promise<MediaPublication[]> {
    return await this.mediaPublicationRepository.find({
      where: { mediaType, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<MediaPublication[]> {
    return await this.mediaPublicationRepository.find({
      where: { isFeatured: true, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 6,
    });
  }

  async findByChannel(channel: string): Promise<MediaPublication[]> {
    return await this.mediaPublicationRepository.find({
      where: { channel, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { airDate: 'DESC' },
    });
  }

  // Helper method to extract YouTube video ID from URL
  extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Helper method to get YouTube thumbnail URL
  getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
  }
}
