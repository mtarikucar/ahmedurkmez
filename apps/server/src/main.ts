import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS for client communication
  app.enableCors({
    origin: 'http://localhost:3000', // Next.js client URL
    credentials: true,
  });

  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
