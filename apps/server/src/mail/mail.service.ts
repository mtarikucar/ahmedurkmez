import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Contact } from '../entities/contact.entity';
import { Comment } from '../entities/comment.entity';
import { Article } from '../entities/article.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendContactNotification(contact: Contact): Promise<void> {
    const adminEmail = this.configService.get('ADMIN_EMAIL');

    await this.mailerService.sendMail({
      to: adminEmail,
      subject: `Yeni İletişim Mesajı: ${contact.subject}`,
      template: 'contact-notification',
      context: {
        contact,
        adminUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/admin/contacts/${contact.id}`,
      },
    });
  }

  async sendContactConfirmation(contact: Contact): Promise<void> {
    await this.mailerService.sendMail({
      to: contact.email,
      subject: 'Mesajınız Alındı - Ahmed Ürkmez',
      template: 'contact-confirmation',
      context: {
        contact,
        websiteUrl: this.configService.get(
          'FRONTEND_URL',
          'http://localhost:3000',
        ),
      },
    });
  }

  async sendCommentNotification(
    comment: Comment,
    article: Article,
  ): Promise<void> {
    const adminEmail = this.configService.get('ADMIN_EMAIL');

    await this.mailerService.sendMail({
      to: adminEmail,
      subject: `Yeni Yorum: ${article.title}`,
      template: 'comment-notification',
      context: {
        comment,
        article,
        adminUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/admin/comments/${comment.id}`,
        articleUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/articles/${article.slug}`,
      },
    });
  }

  async sendCommentApprovalNotification(
    comment: Comment,
    article: Article,
  ): Promise<void> {
    if (comment.authorEmail && !comment.isGuest) {
      await this.mailerService.sendMail({
        to: comment.authorEmail,
        subject: `Yorumunuz Onaylandı - ${article.title}`,
        template: 'comment-approved',
        context: {
          comment,
          article,
          articleUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/articles/${article.slug}`,
        },
      });
    }
  }

  async sendNewArticleNotification(article: Article): Promise<void> {
    // This could be extended to send to subscribers
    const adminEmail = this.configService.get('ADMIN_EMAIL');

    await this.mailerService.sendMail({
      to: adminEmail,
      subject: `Yeni Makale Yayınlandı: ${article.title}`,
      template: 'new-article',
      context: {
        article,
        articleUrl: `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/articles/${article.slug}`,
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token=${resetToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Şifre Sıfırlama - Ahmed Ürkmez',
      template: 'password-reset',
      context: {
        resetUrl,
        email,
      },
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Hoş Geldiniz - Ahmed Ürkmez',
      template: 'welcome',
      context: {
        firstName,
        websiteUrl: this.configService.get(
          'FRONTEND_URL',
          'http://localhost:3000',
        ),
      },
    });
  }

  async sendTestEmail(to: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Test Email - Ahmed Ürkmez',
      template: 'test',
      context: {
        timestamp: new Date().toISOString(),
      },
    });
  }
}
