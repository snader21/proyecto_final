import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Fabricante } from './entities/fabricante.entity';
import { Lugar } from './entities/lugar.entity';
import { FabricanteService } from './services/fabricante.service';
import { LugarService } from './services/lugar.service';
import { InitService } from './services/init.service';
import { FabricanteController } from './controllers/fabricante.controller';
import { LugarController } from './controllers/lugar.controller';
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
      database: process.env.DB_NAME || 'fabricantes',
      entities: [Fabricante, Lugar],
      autoLoadEntities: true,
      dropSchema: false,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Fabricante, Lugar]),
  ],
  controllers: [AppController, FabricanteController, LugarController],
  providers: [AppService, FabricanteService, LugarService, InitService],
})
export class AppModule {}
