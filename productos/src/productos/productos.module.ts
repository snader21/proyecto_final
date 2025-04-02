import { Module } from '@nestjs/common';
import { FileGCP } from './utils/file-gcp.service';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegaEntity } from './entities/bodega.entity';
import { CategoriaEntity } from './entities/categoria.entity';
import { ImagenProductoEntity } from './entities/imagen-producto.entity';
import { InventarioEntity } from './entities/inventario.entity';
import { MarcaEntity } from './entities/marca.entity';
import { MovimientoInventarioEntity } from './entities/movimiento-inventario.entity';
import { PaisEntity } from './entities/pais.entity';
import { ProductoEntity } from './entities/producto.entity';
import { UbicacionEntity } from './entities/ubicacion.entity';
import { UnidadMedidaEntity } from './entities/unidad-medida.entity';
import { ArchivoProductoEntity } from './entities/archivo-producto.entity';

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
      ArchivoProductoEntity
    ]),
    HttpModule
  ],
  controllers: [ProductosController],
  providers: [ProductosService, FileGCP],
  exports: [ProductosService],
})
export class ProductosModule {}
