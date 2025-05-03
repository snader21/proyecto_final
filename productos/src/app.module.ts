import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from './productos/productos.module';
import { ProductosFileModule } from './productos/productos-file.module';
import { InventariosModule } from './inventarios/inventarios.module';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module';
import { BodegasModule } from './bodegas/bodegas.module';
import { MovimientosInventarioModule } from './movimientos-inventario/movimientos-inventario.module';
import { CommonModule } from './common/common.module';
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
import { MovimientoInventarioEntity } from './movimientos-inventario/entities/movimiento-inventario.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
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
      autoLoadEntities: true,
      dropSchema: true,
      synchronize: true,
    }),
    CommonModule,
    ProductosModule,
    ProductosFileModule,
    InventariosModule,
    UbicacionesModule,
    BodegasModule,
    MovimientosInventarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
