import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { Comment } from '../entities/comment.entity';
import { Contact } from '../entities/contact.entity';
import { Category } from '../entities/category.entity';
import { ArticleMedia } from '../entities/article-media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Article,
      Comment,
      Contact,
      Category,
      ArticleMedia,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
