import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreativeWork, CreativeWorkType } from '../entities/creative-work.entity';
import { Category } from '../entities/category.entity';
import { PublicationStatus } from '../entities/publication.entity';
import { CreateCreativeWorkDto } from './dto/create-creative-work.dto';
import { UpdateCreativeWorkDto } from './dto/update-creative-work.dto';

@Injectable()
export class CreativeWorksService {
  constructor(
    @InjectRepository(CreativeWork)
    private creativeWorkRepository: Repository<CreativeWork>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCreativeWorkDto: CreateCreativeWorkDto): Promise<CreativeWork> {
    const creativeWork = this.creativeWorkRepository.create(createCreativeWorkDto);
    
    // Calculate reading time for essays
    if (creativeWork.workType === CreativeWorkType.ESSAY && creativeWork.content) {
      const wordCount = this.calculateWordCount(creativeWork.content);
      creativeWork.wordCount = wordCount;
      creativeWork.readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/minute
    }
    
    return await this.creativeWorkRepository.save(creativeWork);
  }

  async findAll(query?: any): Promise<{ data: CreativeWork[]; total: number }> {
    const queryBuilder = this.creativeWorkRepository
      .createQueryBuilder('work')
      .leftJoinAndSelect('work.category', 'category')
      .orderBy('work.createdAt', 'DESC');

    if (query?.status) {
      queryBuilder.andWhere('work.status = :status', { status: query.status });
    }

    if (query?.workType) {
      queryBuilder.andWhere('work.workType = :workType', { workType: query.workType });
    }

    if (query?.categoryId) {
      queryBuilder.andWhere('work.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(work.title ILIKE :search OR work.description ILIKE :search OR work.content ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<CreativeWork> {
    const creativeWork = await this.creativeWorkRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!creativeWork) {
      throw new NotFoundException(`Creative work with ID ${id} not found`);
    }

    return creativeWork;
  }

  async update(id: number, updateCreativeWorkDto: UpdateCreativeWorkDto): Promise<CreativeWork> {
    const creativeWork = await this.findOne(id);
    Object.assign(creativeWork, updateCreativeWorkDto);
    
    // Recalculate reading time for essays if content changed
    if (creativeWork.workType === CreativeWorkType.ESSAY && updateCreativeWorkDto.content) {
      const wordCount = this.calculateWordCount(creativeWork.content);
      creativeWork.wordCount = wordCount;
      creativeWork.readingTime = Math.ceil(wordCount / 200);
    }
    
    return await this.creativeWorkRepository.save(creativeWork);
  }

  async remove(id: number): Promise<void> {
    const creativeWork = await this.findOne(id);
    await this.creativeWorkRepository.remove(creativeWork);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.creativeWorkRepository.increment({ id }, 'viewCount', 1);
  }

  async findByWorkType(workType: CreativeWorkType): Promise<CreativeWork[]> {
    return await this.creativeWorkRepository.find({
      where: { workType, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<CreativeWork[]> {
    return await this.creativeWorkRepository.find({
      where: { isFeatured: true, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 6,
    });
  }

  async findPoems(): Promise<CreativeWork[]> {
    return await this.creativeWorkRepository.find({
      where: { workType: CreativeWorkType.POEM, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findEssays(): Promise<CreativeWork[]> {
    return await this.creativeWorkRepository.find({
      where: { workType: CreativeWorkType.ESSAY, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPresentations(): Promise<CreativeWork[]> {
    return await this.creativeWorkRepository.find({
      where: { workType: CreativeWorkType.PRESENTATION, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { eventDate: 'DESC' },
    });
  }

  private calculateWordCount(text: string): number {
    // Remove HTML tags and extra whitespace, then count words
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }
}
