import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { VisitaController } from './controllers/visita.controller';
import { VisitaService } from './services/visita.service';
import { ClienteService } from './services/cliente.service';
import { ClienteController } from './controllers/cliente.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [VisitaController, ClienteController],
  providers: [VisitaService, ClienteService],
})
export class ClientesModule {}
