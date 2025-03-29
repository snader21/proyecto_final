import { Module } from '@nestjs/common';
import { EstadosVendedoresService } from './estados-vendedores.service';
import { EstadosVendedoresController } from './estados-vendedores.controller';
import { EstadoVendedorEntity } from './entities/estado-vendedor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EstadoVendedorEntity])],
  controllers: [EstadosVendedoresController],
  providers: [EstadosVendedoresService],
  exports: [EstadosVendedoresService],
})
export class EstadosVendedoresModule {}
