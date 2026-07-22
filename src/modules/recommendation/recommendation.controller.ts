import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { JwtAtGuard } from '../../common/guards';

@ApiTags('Motor de Recomendação IA')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @ApiOperation({ summary: 'Cursos recomendados de acordo com perfil, secretaria e lacunas' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Get()
  async getRecommendations(@Request() req: any) {
    return this.recommendationService.getRecommendations(req.user.sub);
  }
}
