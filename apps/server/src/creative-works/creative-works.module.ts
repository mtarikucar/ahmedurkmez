import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreativeWorksController } from './creative-works.controller';
import { CreativeWorksService } from './creative-works.service';
import { CreativeWork } from '../entities/creative-work.entity';
import { Category } from '../entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreativeWork, Category])],
  controllers: [CreativeWorksController],
  providers: [CreativeWorksService],
  exports: [CreativeWorksService],
})
export class CreativeWorksModule {}
