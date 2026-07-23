import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateForumDto {
  @ApiProperty({ description: 'Título da dúvida ou tópico', example: 'Dúvida sobre a LGPD' })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  titulo: string;

  @ApiProperty({ description: 'Conteúdo detalhado da dúvida', example: 'Como deve ser feito o consentimento...' })
  @IsNotEmpty({ message: 'O conteúdo é obrigatório' })
  @IsString()
  conteudo: string;

  @ApiPropertyOptional({ description: 'ID do curso relacionado (opcional)', example: 'uuid-do-curso' })
  @IsOptional()
  @IsString()
  courseId?: string;
}