import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { PlanVentasService } from './plan-ventas.service';
import { PlanVentasDto } from './dtos/plan-ventas.dto';

@Controller('plan-ventas')
export class PlanVentasController {
  constructor(private readonly planVentasService: PlanVentasService) {}

  @Get('trimestres/:ano')
  async getTrimestresPorAno(@Param('ano', ParseIntPipe) ano: number) {
    return this.planVentasService.getTrimestresPorAno(ano);
  }

  @Put()
  async updatePlanVentas(
    @Body() planVentasDto: PlanVentasDto
  ) {
    return this.planVentasService.createOrUpdatePlanVentas(planVentasDto);
  }
}
