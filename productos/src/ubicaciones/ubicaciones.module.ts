import { Module } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { UbicacionesController } from './ubicaciones.controller';
import { UbicacionEntity } from './entities/ubicacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [UbicacionesController],
  providers: [UbicacionesService],
  exports: [UbicacionesService],
  imports: [TypeOrmModule.forFeature([UbicacionEntity])],
})
export class UbicacionesModule {}
