import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
  Ip,
  Headers,
} from '@nestjs/common';
import {
  CommentsService,
  CreateCommentDto,
  UpdateCommentDto,
} from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CommentStatus } from '../entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Request() req?: any,
  ) {
    // If user is authenticated, add userId
    if (req?.user) {
      createCommentDto.userId = req.user.id;
      createCommentDto.isGuest = false;
    } else {
      createCommentDto.isGuest = true;
    }

    return this.commentsService.create(createCommentDto, ip, userAgent);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: CommentStatus,
    @Query('articleId') articleId?: string,
  ) {
    return this.commentsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
      articleId: articleId ? parseInt(articleId) : undefined,
    });
  }

  @Get('article/:articleId')
  findByArticle(@Param('articleId', ParseIntPipe) articleId: number) {
    return this.commentsService.findByArticle(articleId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('pending/count')
  getPendingCount() {
    return this.commentsService.getPendingCount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.approve(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/reject')
  reject(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.reject(id);
  }

  @Post(':id/like')
  like(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.incrementLike(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
