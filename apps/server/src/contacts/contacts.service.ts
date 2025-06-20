import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactStatus, ContactType } from '../entities/contact.entity';
import { MailService } from '../mail/mail.service';

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
  type?: ContactType;
}

export interface UpdateContactDto {
  status?: ContactStatus;
  adminNotes?: string;
}

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto, ipAddress?: string, userAgent?: string): Promise<Contact> {
    const contact = this.contactRepository.create({
      ...createContactDto,
      ipAddress,
      userAgent,
      type: createContactDto.type || ContactType.GENERAL,
    });

    const savedContact = await this.contactRepository.save(contact);

    // Send notification emails
    try {
      await this.mailService.sendContactNotification(savedContact);
      await this.mailService.sendContactConfirmation(savedContact);
    } catch (error) {
      console.error('Error sending contact emails:', error);
      // Don't fail the contact creation if email fails
    }

    return savedContact;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: ContactStatus;
    type?: ContactType;
  }): Promise<{ contacts: Contact[]; total: number; page: number; limit: number }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contactRepository.createQueryBuilder('contact');

    if (options?.status) {
      queryBuilder.andWhere('contact.status = :status', { status: options.status });
    }

    if (options?.type) {
      queryBuilder.andWhere('contact.type = :type', { type: options.type });
    }

    queryBuilder.orderBy('contact.createdAt', 'DESC');

    const [contacts, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      contacts,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);
    
    Object.assign(contact, updateContactDto);
    
    if (updateContactDto.status === ContactStatus.REPLIED) {
      contact.repliedAt = new Date();
    }

    return this.contactRepository.save(contact);
  }

  async markAsRead(id: number): Promise<Contact> {
    return this.update(id, { status: ContactStatus.READ });
  }

  async markAsReplied(id: number, adminNotes?: string): Promise<Contact> {
    return this.update(id, { 
      status: ContactStatus.REPLIED,
      adminNotes 
    });
  }

  async archive(id: number): Promise<Contact> {
    return this.update(id, { status: ContactStatus.ARCHIVED });
  }

  async remove(id: number): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepository.remove(contact);
  }

  async getNewCount(): Promise<number> {
    return this.contactRepository.count({
      where: { status: ContactStatus.NEW },
    });
  }

  async getStats(): Promise<{
    total: number;
    new: number;
    read: number;
    replied: number;
    archived: number;
  }> {
    const [total, newCount, readCount, repliedCount, archivedCount] = await Promise.all([
      this.contactRepository.count(),
      this.contactRepository.count({ where: { status: ContactStatus.NEW } }),
      this.contactRepository.count({ where: { status: ContactStatus.READ } }),
      this.contactRepository.count({ where: { status: ContactStatus.REPLIED } }),
      this.contactRepository.count({ where: { status: ContactStatus.ARCHIVED } }),
    ]);

    return {
      total,
      new: newCount,
      read: readCount,
      replied: repliedCount,
      archived: archivedCount,
    };
  }
}
