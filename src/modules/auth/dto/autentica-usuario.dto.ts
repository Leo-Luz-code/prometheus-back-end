import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AutenticaUsuarioDto {
  @ApiProperty({
    description: 'CPF, Matrícula ou E-mail do servidor municipal',
    example: '12345678900',
  })
  @IsString()
  @IsNotEmpty()
  readonly identifier: string;

  @ApiProperty({
    description: 'Senha de acesso',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  readonly senha: string;
}
