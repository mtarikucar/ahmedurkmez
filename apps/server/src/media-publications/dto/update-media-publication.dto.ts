import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaPublicationDto } from './create-media-publication.dto';

export class UpdateMediaPublicationDto extends PartialType(CreateMediaPublicationDto) {}
