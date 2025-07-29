import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaPublicationsController } from './media-publications.controller';
import { MediaPublicationsService } from './media-publications.service';
import { MediaPublication } from '../entities/media-publication.entity';
import { Category } from '../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaPublication, Category])],
  controllers: [MediaPublicationsController],
  providers: [MediaPublicationsService],
  exports: [MediaPublicationsService],
})
export class MediaPublicationsModule {}
