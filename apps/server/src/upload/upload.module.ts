import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { ArticleMedia } from '../entities/article-media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleMedia]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOAD_PATH', './uploads'),
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = extname(file.originalname);
            const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
        fileFilter: (req, file, callback) => {
          const allowedTypes = configService.get<string>('ALLOWED_FILE_TYPES', 'jpg,jpeg,png,gif,pdf,doc,docx,mp4,avi,mov').split(',');
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
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
