import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TrimestreService } from './trimestre.service';

@Controller('plan-ventas/trimestres')
export class TrimestreController {
  constructor(private readonly trimestreService: TrimestreService) {}

  @Get(':ano')
  async getTrimestresPorAno(@Param('ano', ParseIntPipe) ano: number) {
    return this.trimestreService.getTrimestresPorAno(ano);
  }
}
