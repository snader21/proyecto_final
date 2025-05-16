import { Module } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { InventariosController } from './inventarios.controller';
import { InventarioEntity } from './entities/inventario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventarioEntity, UbicacionEntity])],
  controllers: [InventariosController],
  providers: [InventariosService],
  exports: [InventariosService],
})
export class InventariosModule {}
