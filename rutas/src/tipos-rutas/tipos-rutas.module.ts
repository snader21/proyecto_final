import { Module } from '@nestjs/common';
import { TiposRutasService } from './tipos-rutas.service';
import { TiposRutasController } from './tipos-rutas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoRutaEntity } from './entities/tipo-ruta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoRutaEntity])],
  controllers: [TiposRutasController],
  providers: [TiposRutasService],
  exports: [TiposRutasService],
})
export class TiposRutasModule {}
