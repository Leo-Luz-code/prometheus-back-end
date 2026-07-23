import { Controller, Get, Post, Body, Query, UseGuards, Request, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { JwtAtGuard } from '../../common/guards';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';

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
    @Body() dto: CreateForumDto,
    @Request() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.forumService.createPost(userId, dto);
  }

  @ApiOperation({ summary: 'Atualizar uma postagem existente no fórum' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateForumDto,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.forumService.updatePost(id, userId, dto);
  }

  @ApiOperation({ summary: 'Excluir uma postagem do fórum' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.sub || req.user.id;
    return this.forumService.deletePost(id, userId);
  }

  @ApiOperation({ summary: 'Responder a um tópico do fórum' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Post(':id/comments')
  async addComment(
    @Param('id') postId: string,
    @Request() req: any,
    @Body() dto: { conteudo: string },
  ) {
    const userId = req.user.sub || req.user.id;
    return this.forumService.addComment(postId, userId, dto.conteudo);
  }
}