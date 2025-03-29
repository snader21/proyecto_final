import { Module } from '@nestjs/common';
import { NodosRutasService } from './nodos-rutas.service';
import { NodosRutasController } from './nodos-rutas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodoRutaEntity } from './entities/nodo-ruta.entity';
import { NodosProductosModule } from '../nodos-productos/nodos-productos.module';

@Module({
  imports: [TypeOrmModule.forFeature([NodoRutaEntity]), NodosProductosModule],
  controllers: [NodosRutasController],
  providers: [NodosRutasService],
  exports: [NodosRutasService],
})
export class NodosRutasModule {}
