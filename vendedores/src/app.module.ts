import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VendedoresModule } from './vendedores/vendedores.module';
import { ZonasModule } from './zonas/zonas.module';
import { EstadosVendedoresModule } from './estados-vendedores/estados-vendedores.module';
import { ZonaEntity } from './zonas/entities/zona.entity';
import { EstadoVendedorEntity } from './estados-vendedores/entities/estado-vendedor.entity';
import { VendedorEntity } from './vendedores/entities/vendedor.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5437'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'vendedores',
      entities: [VendedorEntity, ZonaEntity, EstadoVendedorEntity],
      dropSchema: true,
      synchronize: true,
    }),
    VendedoresModule,
    ZonasModule,
    EstadosVendedoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
