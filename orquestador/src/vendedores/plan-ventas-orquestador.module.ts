import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlanVentasOrquestadorService } from './plan-ventas-orquestador.service';
import { PlanVentasOrquestadorController } from './plan-ventas-orquestador.controller';

@Module({
  imports: [HttpModule],
  controllers: [PlanVentasOrquestadorController],
  providers: [PlanVentasOrquestadorService],
  exports: [PlanVentasOrquestadorService],
})
export class PlanVentasOrquestadorModule {}
