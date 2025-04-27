import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { PlanVentasOrquestadorService } from './plan-ventas-orquestador.service';

@Controller('plan-ventas')
export class PlanVentasOrquestadorController {
  constructor(private readonly planVentasService: PlanVentasOrquestadorService) {}

  @Get('/trimestres/:ano')
  async getTrimestresPorAno(@Param('ano', ParseIntPipe) ano: number) {
    return await this.planVentasService.getTrimestresPorAno(ano);
  }

  @Put()
  async updatePlanVentas(@Body() planVentasDto: any) {
    return await this.planVentasService.createOrUpdatePlanVentas(planVentasDto);
  }

  @Get(':idVendedor/:ano')
  async getPlanVentas(
    @Param('idVendedor') idVendedor: string,
    @Param('ano', ParseIntPipe) ano: number,
  ) {
    return await this.planVentasService.getPlanVentas(idVendedor, ano);
  }
}
