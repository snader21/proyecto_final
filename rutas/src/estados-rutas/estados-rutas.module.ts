import { Module } from '@nestjs/common';
import { EstadosRutasService } from './estados-rutas.service';
import { EstadosRutasController } from './estados-rutas.controller';

@Module({
  controllers: [EstadosRutasController],
  providers: [EstadosRutasService],
})
export class EstadosRutasModule {}
