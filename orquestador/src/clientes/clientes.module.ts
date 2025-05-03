import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { VisitaController } from './controllers/visita.controller';
import { VisitaService } from './services/visita.service';
import { ClienteService } from './services/cliente.service';
import { ClienteController } from './controllers/cliente.controller';
import { TipoClienteController } from './controllers/tipo-cliente.controller';
import { TipoClienteService } from './services/tipo-cliente.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [HttpModule, ConfigModule, UsuariosModule],
  controllers: [VisitaController, ClienteController, TipoClienteController],
  providers: [VisitaService, ClienteService, TipoClienteService],
  exports: [ClienteService],
})
export class ClientesModule {}
