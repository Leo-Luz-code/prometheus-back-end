import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateForumDto } from './create-forum.dto';

// O PartialType faz com que todos os campos de CreateForumDto fiquem opcionais para edição
export class UpdateForumDto extends PartialType(CreateForumDto) {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  conteudo?: string;

  @IsOptional()
  @IsString()
  courseId?: string;
}