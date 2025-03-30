import { Module } from '@nestjs/common';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutaEntity } from './entities/ruta.entity';
import { NodosRutasModule } from '../nodos-rutas/nodos-rutas.module';
import { EstadosRutasModule } from '../estados-rutas/estados-rutas.module';
import { TiposRutasModule } from '../tipos-rutas/tipos-rutas.module';
import { CamionesModule } from '../camiones/camiones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RutaEntity]),
    NodosRutasModule,
    EstadosRutasModule,
    TiposRutasModule,
    CamionesModule,
  ],
  controllers: [RutasController],
  providers: [RutasService],
})
export class RutasModule {}
