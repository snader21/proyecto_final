import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegaEntity } from './bodegas/entities/bodega.entity';
import { CategoriaEntity } from './productos/entities/categoria.entity';
import { ImagenProductoEntity } from './productos/entities/imagen-producto.entity';
import { InventarioEntity } from './inventarios/entities/inventario.entity';
import { MarcaEntity } from './productos/entities/marca.entity';
import { PaisEntity } from './productos/entities/pais.entity';
import { ProductoEntity } from './productos/entities/producto.entity';
import { UbicacionEntity } from './ubicaciones/entities/ubicacion.entity';
import { UnidadMedidaEntity } from './productos/entities/unidad-medida.entity';
import { ArchivoProductoEntity } from './productos/entities/archivo-producto.entity';
import { MovimientosInventarioModule } from './movimientos-inventario/movimientos-inventario.module';
import { InventariosModule } from './inventarios/inventarios.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { BodegasModule } from './bodegas/bodegas.module';
import { MovimientoInventarioEntity } from './movimientos-inventario/entities/movimiento-inventario.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductosModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'productos',
      entities: [
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
      ],
      dropSchema: true,
      synchronize: true,
    }),
    MovimientosInventarioModule,
    InventariosModule,
    UbicacionesModule,
    BodegasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
