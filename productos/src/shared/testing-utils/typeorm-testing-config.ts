/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegaEntity } from '../../bodegas/entities/bodega.entity';
import { CategoriaEntity } from '../../productos/entities/categoria.entity';
import { MarcaEntity } from '../../productos/entities/marca.entity';
import { PaisEntity } from '../../productos/entities/pais.entity';
import { ProductoEntity } from '../../productos/entities/producto.entity';
import { UnidadMedidaEntity } from '../../productos/entities/unidad-medida.entity';
import { ImagenProductoEntity } from '../../productos/entities/imagen-producto.entity';
import { ArchivoProductoEntity } from '../../productos/entities/archivo-producto.entity';
import { InventarioEntity } from '../../inventarios/entities/inventario.entity';
import { MovimientoInventarioEntity } from '../../movimientos-inventario/entities/movimiento-inventario.entity';
import { UbicacionEntity } from '../../ubicaciones/entities/ubicacion.entity';
export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    // logging: ['query', 'error'],
    entities: [
      BodegaEntity,
      CategoriaEntity,
      MarcaEntity,
      PaisEntity,
      ProductoEntity,
      UnidadMedidaEntity,
      ImagenProductoEntity,
      ArchivoProductoEntity,
      InventarioEntity,
      MovimientoInventarioEntity,
      UbicacionEntity,
    ],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([
    BodegaEntity,
    CategoriaEntity,
    MarcaEntity,
    PaisEntity,
    ProductoEntity,
    UnidadMedidaEntity,
    ImagenProductoEntity,
    ArchivoProductoEntity,
    InventarioEntity,
    MovimientoInventarioEntity,
    UbicacionEntity,
  ]),
];
