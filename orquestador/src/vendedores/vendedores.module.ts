import { Module } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { HttpModule } from '@nestjs/axios';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { TrimestresOrquestadorController } from './trimestres-orquestador.controller';
import { TrimestresOrquestadorService } from './trimestres-orquestador.service';

@Module({
  imports: [HttpModule, UsuariosModule],
  controllers: [VendedoresController, TrimestresOrquestadorController],
  providers: [VendedoresService, TrimestresOrquestadorService],
  exports: [VendedoresService],
})
export class VendedoresModule {}
