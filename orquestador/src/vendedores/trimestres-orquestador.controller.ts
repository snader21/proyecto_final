import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TrimestresOrquestadorService } from './trimestres-orquestador.service';

@Controller('plan-ventas/trimestres')
export class TrimestresOrquestadorController {
  constructor(private readonly trimestresService: TrimestresOrquestadorService) {}

  @Get(':ano')
  async getTrimestresPorAno(@Param('ano', ParseIntPipe) ano: number) {
    return this.trimestresService.getTrimestresPorAno(ano);
  }
}
