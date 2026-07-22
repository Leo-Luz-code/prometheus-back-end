import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/plugins/database/services/prisma.service';

@Injectable()
export class LearningPathsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLearningPaths() {
    const courses = await this.prisma.course.findMany({
      where: { isPublished: true, deletedAt: null },
      include: { secretaria: true },
    });

    const paths = [
      {
        id: 'trilha-inovacao-gov',
        titulo: 'Trilha de Inovação & Governo Digital',
        descricao: 'Formação essencial para modernização de processos, atendimento digital e cultura de agilidade na PMVC.',
        cargaHorariaTotal: 70,
        cursosCount: 2,
        secretaria: 'Transparência & Governança (SETP)',
        icone: 'auto_awesome',
        cursos: courses.filter((c) => c.categoria.includes('Inovação') || c.categoria.includes('Governo')),
      },
      {
        id: 'trilha-lgpd-privacidade',
        titulo: 'Trilha de Conformidade LGPD & Segurança',
        descricao: 'Capacitação obrigatória sobre proteção de dados pessoais, princípios legais e gestão ética de informações.',
        cargaHorariaTotal: 50,
        cursosCount: 2,
        secretaria: 'Geral Prefeitura PMVC',
        icone: 'verified_user',
        cursos: courses.filter((c) => c.categoria.includes('Legislação') || c.categoria.includes('Segurança')),
      },
      {
        id: 'trilha-gestao-saude',
        titulo: 'Trilha de Gestão em Saúde Pública Municipal',
        descricao: 'Trilha focada no aperfeiçoamento dos serviços e atendimento humanizado na rede SMS.',
        cargaHorariaTotal: 60,
        cursosCount: 1,
        secretaria: 'Secretaria Municipal de Saúde (SMS)',
        icone: 'medical_services',
        cursos: courses,
      },
    ];

    return paths;
  }
}
