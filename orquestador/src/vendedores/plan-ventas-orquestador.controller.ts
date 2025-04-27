import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlanVentasOrquestadorService } from './plan-ventas-orquestador.service';

@Controller('plan-ventas')
export class PlanVentasOrquestadorController {
  constructor(private readonly planVentasService: PlanVentasOrquestadorService) {}

  @Get('/trimestres/:ano')
  async getTrimestresPorAno(@Param('ano', ParseIntPipe) ano: number) {
    return this.planVentasService.getTrimestresPorAno(ano);
  }


  
}
