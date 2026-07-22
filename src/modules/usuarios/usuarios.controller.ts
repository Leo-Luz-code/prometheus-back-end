import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { JwtAtGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { Role } from '@prisma/client';

@ApiTags('Gestão de Servidores & Perfis')
@Controller('users')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiOperation({ summary: 'Listar servidores municipais (Apenas Gestores de Secretaria e Admin CETI)' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard, RolesGuard)
  @Roles(Role.GESTOR_SECRETARIA, Role.ADMIN_RH_CETI)
  @ApiQuery({ name: 'secretariaId', required: false, type: String })
  @Get()
  async findAll(@Query('secretariaId') secretariaId?: string) {
    return this.usuariosService.findAll(secretariaId);
  }

  @ApiOperation({ summary: 'Detalhes do perfil do servidor' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }
}
