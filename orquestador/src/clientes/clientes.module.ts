import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { VisitaController } from './controllers/visita.controller';
import { VisitaService } from './services/visita.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [VisitaController],
  providers: [VisitaService],
})
export class ClientesModule {}
