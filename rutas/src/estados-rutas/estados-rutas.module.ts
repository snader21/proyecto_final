import { Module } from '@nestjs/common';
import { EstadosRutasService } from './estados-rutas.service';
import { EstadosRutasController } from './estados-rutas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoRutaEntity } from './entities/estado-ruta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstadoRutaEntity])],
  controllers: [EstadosRutasController],
  providers: [EstadosRutasService],
  exports: [EstadosRutasService],
})
export class EstadosRutasModule {}
