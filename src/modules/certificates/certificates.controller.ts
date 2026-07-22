import { Controller, Get, Param, Res, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { JwtAtGuard } from '../../common/guards';

@ApiTags('Certificados & Autenticidade')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @ApiOperation({ summary: 'Listar certificados do servidor autenticado' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Get('my-certificates')
  async getUserCertificates(@Request() req: any) {
    return this.certificatesService.getUserCertificates(req.user.sub);
  }

  @ApiOperation({ summary: 'Validação pública de certificado via código Hash' })
  @Get('validate/:hash')
  async validateCertificate(@Param('hash') hash: string) {
    return this.certificatesService.validateCertificate(hash);
  }

  @ApiOperation({ summary: 'Download do certificado oficial em formato PDF' })
  @Get('download/:hash')
  async downloadPdf(@Param('hash') hash: string, @Res() res: Response) {
    const pdfBuffer = await this.certificatesService.generatePdfBuffer(hash);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Certificado_${hash}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
