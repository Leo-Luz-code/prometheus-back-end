import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/plugins/database/services/prisma.service';

@Injectable()
export class ForumService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts(courseId?: string) {
    const where: any = { deletedAt: null };
    if (courseId) {
      where.courseId = courseId;
    }

    const posts = await this.prisma.forumPost.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            cargo: true,
            secretaria: { select: { sigla: true } },
          },
        },
        course: { select: { id: true, titulo: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return posts.map((p) => ({
      id: p.id,
      titulo: p.titulo,
      conteudo: p.conteudo,
      autor: p.user.nome,
      cargo: p.user.cargo,
      secretariaSigla: p.user.secretaria.sigla,
      cursoTitulo: p.course?.titulo || 'Dúvida Geral',
      createdAt: p.createdAt,
    }));
  }

  async createPost(userId: string, dto: { titulo: string; conteudo: string; courseId?: string }) {
    const post = await this.prisma.forumPost.create({
      data: {
        titulo: dto.titulo,
        conteudo: dto.conteudo,
        courseId: dto.courseId || null,
        userId,
      },
      include: {
        user: { select: { nome: true, cargo: true } },
      },
    });

    return post;
  }
}
