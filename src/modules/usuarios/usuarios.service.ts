import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/plugins/database/services/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(secretariaId?: string) {
    const where: any = { deletedAt: null };
    if (secretariaId) {
      where.secretariaId = secretariaId;
    }

    const users = await this.prisma.user.findMany({
      where,
      include: { secretaria: true },
      orderBy: { nome: 'asc' },
    });

    return users.map((u) => ({
      id: u.id,
      cpf: u.cpf,
      matricula: u.matricula,
      nome: u.nome,
      email: u.email,
      role: u.role,
      cargo: u.cargo,
      secretaria: u.secretaria,
      xpPoints: u.xpPoints,
      level: u.level,
      lgpdAccepted: u.lgpdAccepted,
    }));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        secretaria: true,
        userBadges: { include: { badge: true } },
        certificates: { include: { course: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Servidor não encontrado.');
    }

    return user;
  }
}
