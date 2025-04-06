/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../../productos/entities/producto.entity';
import { CategoriaEntity } from '../../productos/entities/categoria.entity';
import { MarcaEntity } from '../../productos/entities/marca.entity';
import { UnidadMedidaEntity } from '../../productos/entities/unidad-medida.entity';
import { PaisEntity } from '../../productos/entities/pais.entity';
import { ImagenProductoEntity } from '../../productos/entities/imagen-producto.entity';
import { MovimientoInventarioEntity } from '../../movimientos-inventario/entities/movimiento-inventario.entity';
import { BodegaEntity } from '../../bodegas/entities/bodega.entity';
import { UbicacionEntity } from '../../ubicaciones/entities/ubicacion.entity';
import { ArchivoProductoEntity } from '../../productos/entities/archivo-producto.entity';
import { InventarioEntity } from '../../inventarios/entities/inventario.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      ProductoEntity,
      CategoriaEntity,
      MarcaEntity,
      UnidadMedidaEntity,
      PaisEntity,
      ImagenProductoEntity,
      MovimientoInventarioEntity,
      BodegaEntity,
      UbicacionEntity,
      ArchivoProductoEntity,
      InventarioEntity,
    ],
    synchronize: true,
    logging: false,
  }),
  TypeOrmModule.forFeature([
    ProductoEntity,
    CategoriaEntity,
    MarcaEntity,
    UnidadMedidaEntity,
    PaisEntity,
    ImagenProductoEntity,
    MovimientoInventarioEntity,
    BodegaEntity,
    UbicacionEntity,
    ArchivoProductoEntity,
    InventarioEntity,
  ]),
];
