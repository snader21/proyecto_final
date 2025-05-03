import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { VendedoresModule } from './vendedores/vendedores.module';
import { ZonasModule } from './zonas/zonas.module';
import { ZonaEntity } from './zonas/entities/zona.entity';
import { VendedorEntity } from './vendedores/entities/vendedor.entity';
import { PlanVentasEntity } from './vendedores/entities/plan-ventas.entity';
import { MetaTrimestralEntity } from './vendedores/entities/meta-trimestral.entity';
import { TrimestreEntity } from './vendedores/entities/trimestre.entity';

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
      entities: [
        VendedorEntity,
        ZonaEntity,
        PlanVentasEntity,
        MetaTrimestralEntity,
        TrimestreEntity,
      ],
      dropSchema: false,
      synchronize: true,
    }),
    VendedoresModule,
    ZonasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
