import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from '../entities/article.entity';
import { Category } from '../entities/category.entity';
import { ArticleMedia } from '../entities/article-media.entity';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Category, ArticleMedia]),
    UploadModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOAD_PATH', './uploads'),
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `article-${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
        fileFilter: (req, file, callback) => {
          const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
          const fileExt = extname(file.originalname).toLowerCase().substring(1);

          if (allowedTypes.includes(fileExt)) {
            callback(null, true);
          } else {
            callback(new Error(`File type .${fileExt} is not allowed`), false);
          }
        },
        limits: {
          fileSize: configService.get<number>('MAX_FILE_SIZE', 10485760), // 10MB default
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
