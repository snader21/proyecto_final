import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Cliente } from './entities/cliente.entity';
import { TipoCliente } from './entities/tipo-cliente.entity.ts';
import { VisitaCliente } from './entities/visita-cliente.entity';
import { ClienteService } from './services/cliente.service';
import { TipoClienteService } from './services/tipo-cliente.service';
import { VisitaService } from './services/visita.service';
import { TipoClienteInitService } from './services/init.service';
import { ClienteController } from './controllers/cliente.controller';
import { TipoClienteController } from './controllers/tipo-cliente.controller';
import { VisitaController } from './controllers/visita.controller';
import { GCPConfigService } from './services/gcp-config.service';
import { RecomendacionesService } from './services/recomendaciones.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'clientes',
      entities: [Cliente, TipoCliente, VisitaCliente],
      autoLoadEntities: true,
      dropSchema: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Cliente, TipoCliente, VisitaCliente]),
  ],
  controllers: [
    AppController,
    ClienteController,
    TipoClienteController,
    VisitaController,
  ],
  providers: [
    AppService,
    ClienteService,
    TipoClienteService,
    TipoClienteInitService,
    VisitaService,
    GCPConfigService,
    RecomendacionesService,
  ],
})
export class AppModule {}
