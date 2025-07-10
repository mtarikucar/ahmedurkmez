import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const configService = app.get(ConfigService);

  try {
    const adminEmail = configService.get(
      'ADMIN_EMAIL',
      'admin@ahmedurkmez.com',
    );
    const adminPassword = configService.get('ADMIN_PASSWORD', 'admin123456');

    const admin = await authService.createAdmin(
      adminEmail,
      adminPassword,
      'Ahmed',
      'Ürkmez',
    );

    console.log('Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
    });
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await app.close();
  }
}

createAdmin();
