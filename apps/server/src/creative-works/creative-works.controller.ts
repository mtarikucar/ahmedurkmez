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
import { CreativeWorksService } from './creative-works.service';
import { CreateCreativeWorkDto } from './dto/create-creative-work.dto';
import { UpdateCreativeWorkDto } from './dto/update-creative-work.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CreativeWorkType } from '../entities/creative-work.entity';

@Controller('creative-works')
export class CreativeWorksController {
  constructor(private readonly creativeWorksService: CreativeWorksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createCreativeWorkDto: CreateCreativeWorkDto) {
    return this.creativeWorksService.create(createCreativeWorkDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.creativeWorksService.findAll(query);
  }

  @Get('featured')
  findFeatured() {
    return this.creativeWorksService.findFeatured();
  }

  @Get('by-type/:workType')
  findByWorkType(@Param('workType') workType: CreativeWorkType) {
    return this.creativeWorksService.findByWorkType(workType);
  }

  @Get('poems')
  findPoems() {
    return this.creativeWorksService.findPoems();
  }

  @Get('essays')
  findEssays() {
    return this.creativeWorksService.findEssays();
  }

  @Get('presentations')
  findPresentations() {
    return this.creativeWorksService.findPresentations();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.creativeWorksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCreativeWorkDto: UpdateCreativeWorkDto) {
    return this.creativeWorksService.update(id, updateCreativeWorkDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.creativeWorksService.remove(id);
  }

  @Post(':id/view')
  incrementViewCount(@Param('id', ParseIntPipe) id: number) {
    return this.creativeWorksService.incrementViewCount(id);
  }
}
