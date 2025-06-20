import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/activity')
  getRecentActivity() {
    return this.adminService.getRecentActivity();
  }

  @Get('analytics/popular-articles')
  getPopularArticles(@Query('limit') limit?: string) {
    return this.adminService.getPopularArticles(
      limit ? parseInt(limit) : undefined,
    );
  }

  @Get('analytics/articles-by-month')
  getArticlesByMonth() {
    return this.adminService.getArticlesByMonth();
  }

  @Get('analytics/comments-by-month')
  getCommentsByMonth() {
    return this.adminService.getCommentsByMonth();
  }

  @Get('analytics/top-categories')
  getTopCategories() {
    return this.adminService.getTopCategories();
  }
}
