import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from '../entities/article.entity';
import { Category } from '../entities/category.entity';
import { ArticleMedia } from '../entities/article-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, ArticleMedia])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
