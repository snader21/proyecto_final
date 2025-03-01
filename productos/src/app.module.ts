import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegaEntity } from './productos/entities/bodega.entity';
import { CategoriaEntity } from './productos/entities/categoria.entity';
import { ImagenProductoEntity } from './productos/entities/imagen-producto.entity';
import { InventarioEntity } from './productos/entities/inventario.entity';
import { MarcaEntity } from './productos/entities/marca.entity';
import { MovimientoInventarioEntity } from './productos/entities/movimiento-inventario.entity';
import { PaisEntity } from './productos/entities/pais.entity';
import { ProductoEntity } from './productos/entities/producto.entity';
import { UbicacionEntity } from './productos/entities/ubicacion.entity';
import { UnidadMedidaEntity } from './productos/entities/unidad-medida.entity';

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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'productos',
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
        UnidadMedidaEntity
      ],
      dropSchema: true,
      synchronize: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
