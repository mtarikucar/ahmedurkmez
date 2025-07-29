import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookType } from '../entities/book.entity';
import { Category, SubCategoryType } from '../entities/category.entity';
import { PublicationStatus } from '../entities/publication.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll(query?: any): Promise<{ data: Book[]; total: number }> {
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.category', 'category')
      .orderBy('book.createdAt', 'DESC');

    if (query?.status) {
      queryBuilder.andWhere('book.status = :status', { status: query.status });
    }

    if (query?.bookType) {
      queryBuilder.andWhere('book.bookType = :bookType', { bookType: query.bookType });
    }

    if (query?.categoryId) {
      queryBuilder.andWhere('book.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    if (query?.search) {
      queryBuilder.andWhere(
        '(book.title ILIKE :search OR book.description ILIKE :search)',
        { search: `%${query.search}%` }
      );
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.bookRepository.increment({ id }, 'viewCount', 1);
  }

  async findByBookType(bookType: BookType): Promise<Book[]> {
    return await this.bookRepository.find({
      where: { bookType, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findFeatured(): Promise<Book[]> {
    return await this.bookRepository.find({
      where: { isFeatured: true, status: PublicationStatus.PUBLISHED },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 6,
    });
  }
}
