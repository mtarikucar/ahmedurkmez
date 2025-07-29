import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { webcrypto } from 'crypto';

// Polyfill for Node.js 18
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any;
}
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { ContactsModule } from './contacts/contacts.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { BooksModule } from './books/books.module';
import { PapersModule } from './papers/papers.module';
import { MediaPublicationsModule } from './media-publications/media-publications.module';
import { CreativeWorksModule } from './creative-works/creative-works.module';
import {
  User,
  Category,
  Article,
  Comment,
  ArticleMedia,
  Contact,
  Settings,
  Publication,
  Book,
  Paper,
  MediaPublication,
  CreativeWork,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return [
          {
            name: 'default',
            ttl: configService.get('RATE_LIMIT_WINDOW_MS', 60000), // 1 minute default
            limit: configService.get('RATE_LIMIT_MAX_REQUESTS', isProduction ? 60 : 100),
          },
          {
            name: 'auth',
            ttl: 900000, // 15 minutes
            limit: 5, // 5 login attempts per 15 minutes
          },
          {
            name: 'upload',
            ttl: 60000, // 1 minute
            limit: 10, // 10 uploads per minute
          },
        ];
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'password'),
        database: configService.get('DATABASE_NAME', 'ahmedurkmez_db'),
        entities: [
          User,
          Category,
          Article,
          Comment,
          ArticleMedia,
          Contact,
          Settings,
          Publication,
          Book,
          Paper,
          MediaPublication,
          CreativeWork,
        ],
        synchronize:
          configService.get('NODE_ENV', 'development') === 'development',
        logging: configService.get('NODE_ENV', 'development') === 'development',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ArticlesModule,
    CategoriesModule,
    CommentsModule,
    ContactsModule,
    UploadModule,
    AdminModule,
    MailModule,
    BooksModule,
    PapersModule,
    MediaPublicationsModule,
    CreativeWorksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
