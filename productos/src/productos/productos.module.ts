import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { ProductoEntity } from './entities/producto.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { MarcaEntity } from './entities/marca.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { PaisEntity } from './entities/pais.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { MovimientoInventarioEntity } from '../movimientos-inventario/entities/movimiento-inventario.entity';
import { BodegaEntity } from '../bodegas/entities/bodega.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { ImagenProductoEntity } from './entities/imagen-producto.entity';
import { HttpModule } from '@nestjs/axios';
import { FileGCP } from './utils/file-gcp.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductoEntity,
      CategoriaEntity,
      MarcaEntity,
      UnidadMedidaEntity,
      PaisEntity,
      ArchivoProductoEntity,
      MovimientoInventarioEntity,
      BodegaEntity,
      UbicacionEntity,
      ImagenProductoEntity,
    ]),
    HttpModule,
    CommonModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService, FileGCP],
  exports: [ProductosService],
})
export class ProductosModule {}
