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
} from '@nestjs/common';
import { MediaPublicationsService } from './media-publications.service';
import { CreateMediaPublicationDto } from './dto/create-media-publication.dto';
import { UpdateMediaPublicationDto } from './dto/update-media-publication.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { MediaType } from '../entities/media-publication.entity';

@Controller('media-publications')
export class MediaPublicationsController {
  constructor(private readonly mediaPublicationsService: MediaPublicationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createMediaPublicationDto: CreateMediaPublicationDto) {
    return this.mediaPublicationsService.create(createMediaPublicationDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.mediaPublicationsService.findAll(query);
  }

  @Get('featured')
  findFeatured() {
    return this.mediaPublicationsService.findFeatured();
  }

  @Get('by-type/:mediaType')
  findByMediaType(@Param('mediaType') mediaType: MediaType) {
    return this.mediaPublicationsService.findByMediaType(mediaType);
  }

  @Get('by-channel/:channel')
  findByChannel(@Param('channel') channel: string) {
    return this.mediaPublicationsService.findByChannel(channel);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediaPublicationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMediaPublicationDto: UpdateMediaPublicationDto) {
    return this.mediaPublicationsService.update(id, updateMediaPublicationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mediaPublicationsService.remove(id);
  }

  @Post(':id/view')
  incrementViewCount(@Param('id', ParseIntPipe) id: number) {
    return this.mediaPublicationsService.incrementViewCount(id);
  }

  @Get('youtube/extract-id')
  extractYouTubeId(@Query('url') url: string) {
    const videoId = this.mediaPublicationsService.extractYouTubeId(url);
    return { videoId, thumbnail: videoId ? this.mediaPublicationsService.getYouTubeThumbnail(videoId) : null };
  }
}
