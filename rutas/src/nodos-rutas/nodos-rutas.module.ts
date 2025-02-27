import { Module } from '@nestjs/common';
import { NodosRutasService } from './nodos-rutas.service';
import { NodosRutasController } from './nodos-rutas.controller';

@Module({
  controllers: [NodosRutasController],
  providers: [NodosRutasService],
})
export class NodosRutasModule {}
