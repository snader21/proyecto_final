import { Module } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { HttpModule } from '@nestjs/axios';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [HttpModule, UsuariosModule],
  controllers: [VendedoresController],
  providers: [VendedoresService],
  exports: [VendedoresService],
})
export class VendedoresModule {}
