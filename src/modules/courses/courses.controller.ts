import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { JwtAtGuard } from '../../common/guards';

@ApiTags('Catálogo de Cursos & AVA')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiOperation({ summary: 'Listar cursos disponíveis com filtros por busca, secretaria e categoria' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'secretariaId', required: false, type: String })
  @ApiQuery({ name: 'categoria', required: false, type: String })
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('secretariaId') secretariaId?: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.coursesService.findAll(search, secretariaId, categoria);
  }

  @ApiOperation({ summary: 'Detalhes completos do curso e plano de aulas com status do servidor' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.coursesService.findOne(id, req.user?.sub);
  }

  @ApiOperation({ summary: 'Inscrever-se no curso' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Post(':id/enroll')
  async enroll(@Param('id') id: string, @Request() req: any) {
    return this.coursesService.enroll(id, req.user.sub);
  }

  @ApiOperation({ summary: 'Concluir aula, computar XP, progresso e verificar prêmios/certificados' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Post('lessons/:lessonId/complete')
  async completeLesson(@Param('lessonId') lessonId: string, @Request() req: any) {
    return this.coursesService.completeLesson(lessonId, req.user.sub);
  }
}
