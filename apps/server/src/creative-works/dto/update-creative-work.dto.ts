import { PartialType } from '@nestjs/mapped-types';
import { CreateCreativeWorkDto } from './create-creative-work.dto';

export class UpdateCreativeWorkDto extends PartialType(CreateCreativeWorkDto) {}
