import { Module } from '@nestjs/common';
import { InventariosService } from './inventarios.service';
import { InventariosController } from './inventarios.controller';
import { InventarioEntity } from './entities/inventario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [InventariosController],
  imports: [TypeOrmModule.forFeature([InventarioEntity])],
  providers: [InventariosService],
  exports: [InventariosService],
})
export class InventariosModule {}
