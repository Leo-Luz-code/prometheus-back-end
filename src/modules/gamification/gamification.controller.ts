import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { JwtAtGuard } from '../../common/guards';

@ApiTags('Gamificação & Ranking')
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @ApiOperation({ summary: 'Obter XP, Nível e conquistas do servidor autenticado' })
  @ApiBearerAuth()
  @UseGuards(JwtAtGuard)
  @Get('my-status')
  async getMyStatus(@Request() req: any) {
    return this.gamificationService.getUserGamification(req.user.sub);
  }

  @ApiOperation({ summary: 'Ranking individual e intersecretarial por pontuação de XP' })
  @Get('leaderboard')
  async getLeaderboard() {
    return this.gamificationService.getLeaderboard();
  }
}
