import { Module } from '@nestjs/common';
import { MovimientosInventarioService } from './movimientos-inventario.service';
import { MovimientosInventarioController } from './movimientos-inventario.controller';
import { MovimientoInventarioEntity } from './entities/movimiento-inventario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegasModule } from '../bodegas/bodegas.module';
import { UbicacionesModule } from '../ubicaciones/ubicaciones.module';
import { ProductosModule } from '../productos/productos.module';
import { InventariosModule } from '../inventarios/inventarios.module';
import { CommonModule } from '../common/common.module';
@Module({
  controllers: [MovimientosInventarioController],
  providers: [MovimientosInventarioService],
  imports: [
    TypeOrmModule.forFeature([MovimientoInventarioEntity]),
    InventariosModule,
    ProductosModule,
    UbicacionesModule,
    BodegasModule,
    CommonModule,
  ],
})
export class MovimientosInventarioModule {}
