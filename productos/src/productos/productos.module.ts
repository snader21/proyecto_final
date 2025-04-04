import { Module } from '@nestjs/common';
import { FileGCP } from './utils/file-gcp.service';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegaEntity } from '../bodegas/entities/bodega.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { ImagenProductoEntity } from './entities/imagen-producto.entity';
import { InventarioEntity } from '../inventarios/entities/inventario.entity';
import { MarcaEntity } from './entities/marca.entity';
import { PaisEntity } from './entities/pais.entity';
import { ProductoEntity } from './entities/producto.entity';
import { UbicacionEntity } from '../ubicaciones/entities/ubicacion.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';
import { MovimientoInventarioEntity } from '../movimientos-inventario/entities/movimiento-inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BodegaEntity,
      CategoriaEntity,
      ImagenProductoEntity,
      InventarioEntity,
      MarcaEntity,
      MovimientoInventarioEntity,
      PaisEntity,
      ProductoEntity,
      UbicacionEntity,
      UnidadMedidaEntity,
      ArchivoProductoEntity,
    ]),
    HttpModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService, FileGCP],
  exports: [ProductosService],
})
export class ProductosModule {}
