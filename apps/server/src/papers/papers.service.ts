import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paper, PaperType } from '../entities/paper.entity';
import { Category } from '../entities/category.entity';
import { PublicationStatus } from '../entities/publication.entity';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';

@Injectable()
export class PapersService {
  constructor(
    @InjectRepository(Paper)
    private paperRepository: Repository<Paper>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createPaperDto: CreatePaperDto): Promise<Paper> {
    const paper = this.paperRepository.create(createPaperDto);
    return await this.paperRepository.save(paper);
  }

  async findAll(query?: any): Promise<{ data: Paper[]; total: number }> {
    const queryBuilder = this.paperRepository
      .createQueryBuilder('paper')
      .leftJoinAndSelect('paper.category', 'category')
      .orderBy('paper.createdAt', 'DESC');

    if (query?.status) {
      queryBuilder.andWhere('paper.status = :status', { status: query.status });
    }

    if (query?.paperType) {
      queryBuilder.andWhere('paper.paperType = :paperType', { paperType: query.paperType });
    }

    if (query?.categoryId) {
      queryBuilder.andWhere('paper.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(paper.title ILIKE :search OR paper.description ILIKE :search OR paper.abstract ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<Paper> {
    const paper = await this.paperRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!paper) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }

    return paper;
  }

  async update(id: number, updatePaperDto: UpdatePaperDto): Promise<Paper> {
    const paper = await this.findOne(id);
    Object.assign(paper, updatePaperDto);
    return await this.paperRepository.save(paper);
  }

  async remove(id: number): Promise<void> {
    const paper = await this.findOne(id);
    await this.paperRepository.remove(paper);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.paperRepository.increment({ id }, 'viewCount', 1);
  }

  async findByPaperType(paperType: PaperType): Promise<Paper[]> {
    return await this.paperRepository.find({
      where: { paperType, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<Paper[]> {
    return await this.paperRepository.find({
      where: { isFeatured: true, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 6,
    });
  }
}
