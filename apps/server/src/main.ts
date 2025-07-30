import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import * as compression from 'compression';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  const isProduction = configService.get('NODE_ENV') === 'production';

  // Trust proxy in production (for proper IP forwarding)
  if (isProduction) {
    app.set('trust proxy', 1);
  }

  // Ensure uploads directory exists
  const uploadsPath = configService.get<string>('UPLOAD_PATH', './uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    logger.log(`Created uploads directory at: ${uploadsPath}`);
  }

  // Ensure PDFs directory exists
  const pdfsPath = path.join(uploadsPath, 'pdfs');
  if (!fs.existsSync(pdfsPath)) {
    fs.mkdirSync(pdfsPath, { recursive: true });
    logger.log(`Created PDFs directory at: ${pdfsPath}`);
  }

  // Compression middleware
  app.use(compression());

  // Specific CORS for uploads directory (must be before static middleware)
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Serve static files from uploads directory
  const staticUploadsPath = path.resolve(uploadsPath);
  app.use('/uploads', express.static(staticUploadsPath, {
    maxAge: '1d', // Cache for 1 day
    etag: true,
    lastModified: true,
    index: false, // Don't serve index.html files
  }));
  logger.log(`📁 Static files served from: ${staticUploadsPath}`);

  // Enhanced security middleware
  app.use(helmet({
    contentSecurityPolicy: isProduction ? {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    } : false,
    crossOriginEmbedderPolicy: false,
    hsts: isProduction ? {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    } : false,
  }));

  // Enhanced global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: isProduction,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration based on environment
  const corsOrigins = isProduction 
    ? [
        configService.get('CORS_ORIGIN'),
        'https://ahmedurkmez.com',
        'https://www.ahmedurkmez.com',
        'http://84.247.165.153',
        'https://84.247.165.153'
      ].filter(Boolean)
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      'X-CSRF-Token'
    ],
    maxAge: isProduction ? 86400 : 0, // Cache preflight for 24 hours in production
  });

  // Global prefix for API routes
  app.setGlobalPrefix('api', {
    exclude: ['health', 'uploads/(.*)'],
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get('PORT') || 3001;
  const host = isProduction ? '0.0.0.0' : 'localhost';
  
  await app.listen(port, host);
  logger.log(`🚀 Server is running on http://${host}:${port}`);
  logger.log(`📊 Environment: ${configService.get('NODE_ENV')}`);
  logger.log(`🔒 Security: Enhanced security headers enabled`);
  
  // Log important security settings
  if (isProduction) {
    logger.log(`🛡️  Production security enabled`);
    logger.log(`🔐 CORS origins: ${corsOrigins.join(', ')}`);
    logger.log(`📁 Upload path: ${uploadsPath}`);
  }
}

bootstrap().catch((error) => {
  Logger.error('❌ Failed to start server', error);
  process.exit(1);
});
