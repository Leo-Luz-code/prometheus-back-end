import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, CertificateStatus } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/conquista-saberes?schema=public';
const pool = new Pool({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('🌱 Iniciando Seeding do Conquista Saberes AVA Municipal...');

  // Limpar tabelas existentes em ordem
  await prisma.auditLog.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.secretaria.deleteMany();

  // 1. Criar Secretarias da PMVC
  const setp = await prisma.secretaria.create({
    data: {
      nome: 'Secretaria Municipal de Transparência, Controle e Governança',
      sigla: 'SETP',
    },
  });

  const sms = await prisma.secretaria.create({
    data: {
      nome: 'Secretaria Municipal de Saúde',
      sigla: 'SMS',
    },
  });

  const smed = await prisma.secretaria.create({
    data: {
      nome: 'Secretaria Municipal de Educação',
      sigla: 'SMED',
    },
  });

  console.log('✅ Secretarias criadas: SETP, SMS, SMED');

  // Senhas
  const defaultPasswordHash = await bcrypt.hash('123456', 10);
  const adminPasswordHash = await bcrypt.hash('admin', 10);

  // 2. Criar Usuários Exemplares
  const servidor = await prisma.user.create({
    data: {
      cpf: '12345678900',
      matricula: '2026001',
      nome: 'Carlos Alberto Silva',
      email: 'carlos.silva@pmvc.ba.gov.br',
      passwordHash: defaultPasswordHash,
      role: Role.SERVIDOR,
      cargo: 'Técnico Administrativo',
      secretariaId: setp.id,
      xpPoints: 350,
      level: 2,
      lgpdAccepted: true,
      lgpdAcceptedAt: new Date(),
    },
  });

  const gestor = await prisma.user.create({
    data: {
      cpf: '98765432100',
      matricula: '2026002',
      nome: 'Dra. Ana Paula Souza',
      email: 'ana.souza@pmvc.ba.gov.br',
      passwordHash: defaultPasswordHash,
      role: Role.GESTOR_SECRETARIA,
      cargo: 'Coordenadora Geral de Saúde',
      secretariaId: sms.id,
      xpPoints: 850,
      level: 4,
      lgpdAccepted: true,
      lgpdAcceptedAt: new Date(),
    },
  });

  const admin = await prisma.user.create({
    data: {
      cpf: '11122233344',
      matricula: '2026000',
      nome: 'Roberto Mendes (CETI)',
      email: 'admin.rh@pmvc.ba.gov.br',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN_RH_CETI,
      cargo: 'Administrador de TI e Capacitação CETI',
      secretariaId: setp.id,
      xpPoints: 1500,
      level: 6,
      lgpdAccepted: true,
      lgpdAcceptedAt: new Date(),
    },
  });

  console.log('✅ Usuários de teste criados (Servidor, Gestor SMS, Admin CETI)');

  // 3. Badges de Gamificação
  const badgeInovador = await prisma.badge.create({
    data: {
      nome: 'Servidor Inovador',
      descricao: 'Concluiu com êxito o curso de Inovação e Transformação Digital na Gestão Pública.',
      icone: 'auto_awesome',
      xpBonus: 100,
    },
  });

  const badgeLgpd = await prisma.badge.create({
    data: {
      nome: 'Mestre em LGPD',
      descricao: 'Alcançou 100% de aproveitamento no curso de LGPD Aplicada ao Setor Público.',
      icone: 'gavel',
      xpBonus: 100,
    },
  });

  const badgePioneiro = await prisma.badge.create({
    data: {
      nome: 'Pioneiro Conquista',
      descricao: 'Completou o seu primeiro treinamento na plataforma Conquista Saberes.',
      icone: 'military_tech',
      xpBonus: 50,
    },
  });

  const badgeGuardião = await prisma.badge.create({
    data: {
      nome: 'Guardião da Transparência',
      descricao: 'Engajou-se em trilhas de governança, ética e transparência pública municipal.',
      icone: 'verified_user',
      xpBonus: 75,
    },
  });

  console.log('✅ 4 Badges de Gamificação criados');

  // 4. Cursos
  // Curso 1: Inovação e Transformação Digital
  const cursoInovacao = await prisma.course.create({
    data: {
      titulo: 'Inovação e Transformação Digital na Gestão Pública',
      descricao: 'Capacitação completa sobre métodos ágeis, desburocratização, serviços digitais e cultura de inovação na Prefeitura de Vitória da Conquista.',
      cargaHoraria: 40,
      categoria: 'Inovação & Governo Digital',
      secretariaId: setp.id,
      capaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    },
  });

  // Módulo 1 do Curso 1
  const modInov1 = await prisma.module.create({
    data: {
      titulo: 'Módulo 1: Fundamentos do Governo Digital e Atendimento Sem Papel',
      ordem: 1,
      courseId: cursoInovacao.id,
    },
  });

  const lInov1 = await prisma.lesson.create({
    data: {
      titulo: 'Aula 1: A Era da Transformação Digital na PMVC',
      tipo: 'TEXTO',
      duracaoMin: 15,
      ordem: 1,
      moduleId: modInov1.id,
      texto: `
### Transformação Digital no Serviço Público Municipal

A Prefeitura Municipal de Vitória da Conquista vem adotando estratégias de modernização dos serviços públicos para garantir agilidade, transparência e redução do uso de papel.

#### Objetivos Chave:
1. **Atendimento Digital ao Cidadão:** Reduzir filas presenciais integrando solicitações online.
2. **Tramitação Eletrônica de Processos:** Agilizar despachos entre secretarias como SMS, SMED e SETP.
3. **Eficiência no Gasto Público:** Redução drástica com impressões e insumos físicos.
      `,
    },
  });

  const lInov2 = await prisma.lesson.create({
    data: {
      titulo: 'Aula 2: Tecnologias Emergentes e Cidadania Conquistense',
      tipo: 'VIDEO',
      conteudoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duracaoMin: 20,
      ordem: 2,
      moduleId: modInov1.id,
      texto: 'Assista ao vídeo explicativo sobre como o portal da prefeitura integra os serviços das secretarias municipais.',
    },
  });

  const quizDataInov = JSON.stringify({
    questions: [
      {
        id: 1,
        question: 'Qual é o objetivo principal do Governo Digital na PMVC?',
        options: [
          'Aumentar a burocracia presencial',
          'Tornar os serviços mais ágeis, transparentes e acessíveis ao cidadão',
          'Eliminar a comunicação entre secretarias',
          'Substituir todos os servidores por robôs'
        ],
        correctIndex: 1
      },
      {
        id: 2,
        question: 'Qual das opções representa um benefício direto do Atendimento Sem Papel?',
        options: [
          'Economia de recursos públicos e agilidade em processos',
          'Necessidade de maiores espaços físicos de arquivo',
          'Aumento no tempo de resposta das solicitações',
          'Dificuldade no rastreamento de documentos'
        ],
        correctIndex: 0
      }
    ]
  });

  const lInov3 = await prisma.lesson.create({
    data: {
      titulo: 'Aula 3: Quiz - Verificação do Módulo 1',
      tipo: 'QUIZ',
      duracaoMin: 10,
      ordem: 3,
      moduleId: modInov1.id,
      quizData: quizDataInov,
    },
  });

  // Módulo 2 do Curso 1
  const modInov2 = await prisma.module.create({
    data: {
      titulo: 'Módulo 2: Gestão Ágil de Projetos e Cultura de Inovação',
      ordem: 2,
      courseId: cursoInovacao.id,
    },
  });

  const lInov4 = await prisma.lesson.create({
    data: {
      titulo: 'Aula 4: Diretrizes de Inovação CETI 2026',
      tipo: 'PDF',
      conteudoUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      duracaoMin: 15,
      ordem: 1,
      moduleId: modInov2.id,
      texto: 'Documento PDF com os princípios orientadores do edital de inovação municipal CETI.',
    },
  });

  // Curso 2: LGPD Aplicada
  const cursoLgpd = await prisma.course.create({
    data: {
      titulo: 'LGPD Aplicada ao Setor Público Municipal',
      descricao: 'Treinamento sobre a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), boas práticas de privacidade e segurança da informação para servidores da PMVC.',
      cargaHoraria: 30,
      categoria: 'Legislação & Segurança',
      capaUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    },
  });

  const modLgpd1 = await prisma.module.create({
    data: {
      titulo: 'Módulo 1: Proteção de Dados Pessoais e Direitos do Cidadão',
      ordem: 1,
      courseId: cursoLgpd.id,
    },
  });

  const lLgpd1 = await prisma.lesson.create({
    data: {
      titulo: 'Aula 1: Fundamentos da LGPD para Servidores Públicos',
      tipo: 'TEXTO',
      duracaoMin: 20,
      ordem: 1,
      moduleId: modLgpd1.id,
      texto: `
### A LGPD no Âmbito Municipal

A Lei nº 13.709/2018 regendo o tratamento de dados pessoais no Brasil exige responsabilidade reforçada dos órgãos da administração pública direta e indireta.

#### Princípios Fundamentais:
1. **Finalidade:** O tratamento de dados deve atender a propósitos legítimos e específicos informados ao cidadão.
2. **Necessidade:** Coleta estritamente limitada ao mínimo necessário para a execução de políticas públicas.
3. **Transparência:** Garantia de informações claras e precisas sobre o tratamento de dados.
      `,
    },
  });

  const quizDataLgpd = JSON.stringify({
    questions: [
      {
        id: 1,
        question: 'O que define o princípio da Necessidade na LGPD?',
        options: [
          'Coletar todos os dados possíveis para uso futuro',
          'Limitar o tratamento ao mínimo de dados necessários para a finalidade pública',
          'Compartilhar dados abertamente com terceiros sem consentimento',
          'Armazenar dados indefinidamente sem prazo de validade'
        ],
        correctIndex: 1
      }
    ]
  });

  const lLgpd2 = await prisma.lesson.create({
    data: {
      titulo: 'Aula 2: Quiz - Avaliação de Conformidade LGPD',
      tipo: 'QUIZ',
      duracaoMin: 10,
      ordem: 2,
      moduleId: modLgpd1.id,
      quizData: quizDataLgpd,
    },
  });

  console.log('✅ Cursos, Módulos, Aulas e Quizzes criados com sucesso');

  // 5. Inscrição de exemplo, Progresso, Badges Ganhas e Certificado de Teste
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: servidor.id,
      courseId: cursoInovacao.id,
      progress: 100.0,
      completedAt: new Date(),
    },
  });

  // Marcar lições do curso 1 como completadas pelo Servidor
  await prisma.lessonProgress.create({ data: { userId: servidor.id, lessonId: lInov1.id, completed: true } });
  await prisma.lessonProgress.create({ data: { userId: servidor.id, lessonId: lInov2.id, completed: true } });
  await prisma.lessonProgress.create({ data: { userId: servidor.id, lessonId: lInov3.id, completed: true } });
  await prisma.lessonProgress.create({ data: { userId: servidor.id, lessonId: lInov4.id, completed: true } });

  // Atribuir Badges ao Servidor
  await prisma.userBadge.create({
    data: {
      userId: servidor.id,
      badgeId: badgePioneiro.id,
    },
  });

  await prisma.userBadge.create({
    data: {
      userId: servidor.id,
      badgeId: badgeInovador.id,
    },
  });

  // Criar Certificado Emitido
  const certificadoCodigo = 'CS-PMVC-2026-987654';
  await prisma.certificate.create({
    data: {
      codigoValidacao: certificadoCodigo,
      userId: servidor.id,
      courseId: cursoInovacao.id,
      status: CertificateStatus.EMITTED,
      issuedAt: new Date(),
    },
  });

  // Tópico no Fórum de Dúvidas
  await prisma.forumPost.create({
    data: {
      titulo: 'Como solicitar integração de novos fluxos de processos entre SETP e SMS?',
      conteudo: 'Olá colegas! Gostaria de saber qual é o procedimento ideal para sugerir a automatização de um formulário de encaminhamento entre a Secretaria de Transparência e a Saúde.',
      userId: servidor.id,
      courseId: cursoInovacao.id,
    },
  });

  // Audit Logs de Teste
  await prisma.auditLog.create({
    data: {
      userId: servidor.id,
      acao: 'LOGIN',
      detalhes: 'Login simulado via SSO Municipal por CPF/Matrícula',
      ipAddress: '127.0.0.1',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: servidor.id,
      acao: 'ACEITE_LGPD',
      detalhes: 'Aceite do Termo de Consentimento e Privacidade da PMVC',
      ipAddress: '127.0.0.1',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: servidor.id,
      acao: 'CURSO_CONCLUIDO',
      detalhes: `Conclusão do Curso ${cursoInovacao.titulo} (40h) com emissão de certificado ${certificadoCodigo}`,
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
