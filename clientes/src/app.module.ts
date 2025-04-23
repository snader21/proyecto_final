import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Cliente } from './entities/cliente.entity';
import { TipoCliente } from './entities/tipo-cliente.entity.ts';
import { ClienteService } from './services/cliente.service';
import { TipoClienteService } from './services/tipo-cliente.service';
import { TipoClienteInitService } from './services/init.service';
import { ClienteController } from './controllers/cliente.controller';
import { TipoClienteController } from './controllers/tipo-cliente.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5436'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'clientes',
      entities: [Cliente, TipoCliente],
      autoLoadEntities: true,
      dropSchema: false,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Cliente, TipoCliente]),
  ],
  controllers: [AppController, ClienteController, TipoClienteController],
  providers: [
    AppService,
    ClienteService,
    TipoClienteService,
    TipoClienteInitService,
  ],
})
export class AppModule {}
