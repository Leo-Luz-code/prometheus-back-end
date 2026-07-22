import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { JwtAtGuard } from '../../common/guards';

@ApiTags('Comunidades & Fórum')
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @ApiOperation({ summary: 'Listar postagens do fórum colaborativo' })
  @ApiQuery({ name: 'courseId', required: false, type: String })
  @Get()
  async getPosts(@Query('courseId') courseId?: string) {
    return this.forumService.getPosts(courseId);
  }

  @ApiOperation({ summary: 'Criar nova dúvida ou postagem no fórum' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Post()
  async createPost(
    @Body() dto: { titulo: string; conteudo: string; courseId?: string },
    @Request() req: any,
  ) {
    return this.forumService.createPost(req.user.sub, dto);
  }
}
