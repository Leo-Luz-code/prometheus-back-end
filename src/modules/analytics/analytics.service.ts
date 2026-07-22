import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/plugins/database/services/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getExecutiveDashboard() {
    const totalServidores = await this.prisma.user.count({ where: { deletedAt: null } });
    const totalCursos = await this.prisma.course.count({ where: { deletedAt: null } });
    const totalInscricoes = await this.prisma.enrollment.count({ where: { deletedAt: null } });
    const totalCertificados = await this.prisma.certificate.count({ where: { deletedAt: null } });

    // Taxa de Conclusão Média
    const enrollments = await this.prisma.enrollment.findMany({
      where: { deletedAt: null },
      select: { progress: true, completedAt: true },
    });

    const avgProgress = enrollments.length
      ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
      : 0;

    // Métricas por Secretaria
    const secretarias = await this.prisma.secretaria.findMany({
      where: { deletedAt: null },
      include: {
        users: {
          where: { deletedAt: null },
          include: {
            enrollments: { where: { deletedAt: null } },
            certificates: { where: { deletedAt: null } },
          },
        },
      },
    });

    const secretariaStats = secretarias.map((sec) => {
      const userCount = sec.users.length;
      let totalSecEnrollments = 0;
      let completedSecEnrollments = 0;

      sec.users.forEach((u) => {
        totalSecEnrollments += u.enrollments.length;
        completedSecEnrollments += u.certificates.length;
      });

      const completionRate = totalSecEnrollments
        ? Math.round((completedSecEnrollments / totalSecEnrollments) * 100)
        : 0;

      return {
        id: sec.id,
        nome: sec.nome,
        sigla: sec.sigla,
        servidoresCount: userCount,
        inscricoesCount: totalSecEnrollments,
        certificadosCount: completedSecEnrollments,
        taxaConclusaoPercent: completionRate,
      };
    });

    // Distribuição de Competências / Categorias
    const categoriesCount = [
      { categoria: 'Inovação & Governo Digital', inscritos: 18, concluidos: 14 },
      { categoria: 'Legislação & Segurança (LGPD)', inscritos: 24, concluidos: 19 },
      { categoria: 'Gestão Pública e Processos', inscritos: 12, concluidos: 8 },
      { categoria: 'Saúde e Atendimento', inscritos: 15, concluidos: 11 },
    ];

    return {
      totalServidores,
      totalCursos,
      totalInscricoes,
      totalCertificados,
      avgProgressPercent: avgProgress,
      secretariaStats,
      categoriesCount,
    };
  }
}
