import { Module } from '@nestjs/common';
import { TiposRutasService } from './tipos-rutas.service';
import { TiposRutasController } from './tipos-rutas.controller';

@Module({
  controllers: [TiposRutasController],
  providers: [TiposRutasService],
})
export class TiposRutasModule {}
