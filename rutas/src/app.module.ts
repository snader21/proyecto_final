import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CamionesModule } from './camiones/camiones.module';
import { RutasModule } from './rutas/rutas.module';
import { EstadosRutasModule } from './estados-rutas/estados-rutas.module';
import { NodosRutasModule } from './nodos-rutas/nodos-rutas.module';
import { TiposRutasModule } from './tipos-rutas/tipos-rutas.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamionEntity } from './camiones/entities/camion.entity';
import { RutaEntity } from './rutas/entities/ruta.entity';
import { EstadoRutaEntity } from './estados-rutas/entities/estado-ruta.entity';
import { NodoRutaEntity } from './nodos-rutas/entities/nodo-ruta.entity';
import { TipoRutaEntity } from './tipos-rutas/entities/tipo-ruta.entity';
import { NodosProductosModule } from './nodos-productos/nodos-productos.module';
import { NodoProductoEntity } from './nodos-productos/entities/nodo-producto.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'rutas',
      entities: [
        CamionEntity,
        RutaEntity,
        EstadoRutaEntity,
        NodoRutaEntity,
        TipoRutaEntity,
        NodoProductoEntity,
      ],
      synchronize: true,
    }),
    CamionesModule,
    RutasModule,
    EstadosRutasModule,
    NodosRutasModule,
    TiposRutasModule,
    NodosProductosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
