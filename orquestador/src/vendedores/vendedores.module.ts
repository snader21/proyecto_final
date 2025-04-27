import { Module } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { HttpModule } from '@nestjs/axios';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PlanVentasOrquestadorController } from './plan-ventas-orquestador.controller';
import { PlanVentasOrquestadorService } from './plan-ventas-orquestador.service';

@Module({
  imports: [HttpModule, UsuariosModule],
  controllers: [VendedoresController, PlanVentasOrquestadorController],
  providers: [VendedoresService, PlanVentasOrquestadorService],
  exports: [VendedoresService],
})
export class VendedoresModule {}
