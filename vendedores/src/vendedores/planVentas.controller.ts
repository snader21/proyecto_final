import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlanVentasService } from './plan-ventas.service';

@Controller('plan-ventas')
export class PlanVentasController {
  constructor(private readonly planVentasService: PlanVentasService) {}

  @Get('trimestres/:ano')
  async getTrimestresPorAno(@Param('ano', ParseIntPipe) ano: number) {
    return this.planVentasService.getTrimestresPorAno(ano);
  }

  @Put(':ano')
  async updatePlanVentas(@Param('ano', ParseIntPipe) ano: number) {
    return this.planVentasService.updatePlanVentas(ano);
  }

}
