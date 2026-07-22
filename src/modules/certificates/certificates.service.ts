import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/plugins/database/services/prisma.service';
import * as PDFDocument from 'pdfkit';
import { CertificateStatus } from '@prisma/client';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserCertificates(userId: string) {
    const certs = await this.prisma.certificate.findMany({
      where: { userId, deletedAt: null },
      include: {
        course: true,
        user: { include: { secretaria: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return certs.map((c) => ({
      id: c.id,
      codigoValidacao: c.codigoValidacao,
      courseId: c.courseId,
      courseTitle: c.course.titulo,
      cargaHoraria: c.course.cargaHoraria,
      userName: c.user.nome,
      userCpf: c.user.cpf,
      secretariaSigla: c.user.secretaria.sigla,
      issuedAt: c.issuedAt,
      status: c.status,
    }));
  }

  async validateCertificate(codigoValidacao: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { codigoValidacao },
      include: {
        course: { include: { secretaria: true } },
        user: { include: { secretaria: true } },
      },
    });

    if (!cert || cert.deletedAt || cert.status !== CertificateStatus.EMITTED) {
      return {
        isValid: false,
        message: 'Certificado não encontrado ou revogado.',
      };
    }

    return {
      isValid: true,
      codigoValidacao: cert.codigoValidacao,
      servidor: cert.user.nome,
      cpfMascarado: cert.user.cpf.replace(/(\d{3})\d{5}(\d{2})/, '$1.***.***-$2'),
      cargo: cert.user.cargo,
      secretaria: cert.user.secretaria.nome,
      curso: cert.course.titulo,
      cargaHoraria: cert.course.cargaHoraria,
      issuedAt: cert.issuedAt,
      emissor: 'Prefeitura Municipal de Vitória da Conquista - CETI / SETP',
    };
  }

  async generatePdfBuffer(codigoValidacao: string): Promise<Buffer> {
    const cert = await this.prisma.certificate.findUnique({
      where: { codigoValidacao },
      include: {
        course: true,
        user: { include: { secretaria: true } },
      },
    });

    if (!cert || cert.status !== CertificateStatus.EMITTED) {
      throw new NotFoundException('Certificado não encontrado ou inválido.');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 40,
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Moldura e Design Institucional PMVC
      const width = doc.page.width;
      const height = doc.page.height;

      // Bordas
      doc.rect(20, 20, width - 40, height - 40).lineWidth(3).stroke('#0B4F6C');
      doc.rect(26, 26, width - 52, height - 52).lineWidth(1).stroke('#D97706');

      // Topo Institucional
      doc
        .fillColor('#0B4F6C')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('PREFEITURA MUNICIPAL DE VITÓRIA DA CONQUISTA', 0, 60, {
          align: 'center',
        });

      doc
        .fillColor('#4B5563')
        .fontSize(14)
        .font('Helvetica')
        .text('CETI - Centro de Educação e Tecnologia da Informação | SETP', 0, 90, {
          align: 'center',
        });

      // Título CERTIFICADO
      doc
        .fillColor('#D97706')
        .fontSize(32)
        .font('Helvetica-Bold')
        .text('CERTIFICADO DE CONCLUSÃO', 0, 140, { align: 'center' });

      // Texto de concessão
      doc
        .fillColor('#1F2937')
        .fontSize(14)
        .font('Helvetica')
        .text(
          `Certificamos que o(a) servidor(a) público(a) municipal:`,
          0,
          200,
          { align: 'center' },
        );

      doc
        .fillColor('#0B4F6C')
        .fontSize(24)
        .font('Helvetica-Bold')
        .text(cert.user.nome.toUpperCase(), 0, 230, { align: 'center' });

      doc
        .fillColor('#4B5563')
        .fontSize(12)
        .font('Helvetica')
        .text(
          `Cargo: ${cert.user.cargo} | Secretaria: ${cert.user.secretaria.nome}`,
          0,
          265,
          { align: 'center' },
        );

      doc
        .fillColor('#1F2937')
        .fontSize(14)
        .font('Helvetica')
        .text(
          `concluiu com êxito na plataforma Conquista Saberes o curso de capacitação:`,
          0,
          300,
          { align: 'center' },
        );

      doc
        .fillColor('#0B4F6C')
        .fontSize(20)
        .font('Helvetica-Bold')
        .text(`"${cert.course.titulo}"`, 0, 330, { align: 'center' });

      doc
        .fillColor('#374151')
        .fontSize(13)
        .font('Helvetica')
        .text(
          `Carga Horária Total: ${cert.course.cargaHoraria} horas | Data de Emissão: ${new Date(
            cert.issuedAt,
          ).toLocaleDateString('pt-BR')}`,
          0,
          370,
          { align: 'center' },
        );

      // Rodapé de Validação e Assinatura
      doc
        .fillColor('#6B7280')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(`CÓDIGO DE VERIFICAÇÃO DE AUTENTICIDADE:`, 60, 470);

      doc
        .fillColor('#0B4F6C')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(cert.codigoValidacao, 60, 485);

      doc
        .fillColor('#6B7280')
        .fontSize(9)
        .font('Helvetica')
        .text(
          `Valide este documento no portal oficial: /certificates/validate/${cert.codigoValidacao}`,
          60,
          502,
        );

      doc
        .fillColor('#0B4F6C')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Prefeitura Municipal de Vitória da Conquista', width - 320, 470, {
          align: 'center',
        });

      doc
        .fillColor('#4B5563')
        .fontSize(10)
        .font('Helvetica')
        .text('Comissão Executiva CETI / SETP', width - 320, 488, {
          align: 'center',
        });

      doc.end();
    });
  }
}
