import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LearningPathsService } from './learning-paths.service';

@ApiTags('Trilhas de Aprendizagem')
@Controller('learning-paths')
export class LearningPathsController {
  constructor(private readonly learningPathsService: LearningPathsService) {}

  @ApiOperation({ summary: 'Obter trilhas de capacitação por carreira e competências' })
  @Get()
  async getLearningPaths() {
    return this.learningPathsService.getLearningPaths();
  }
}
