import { Module } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendedorEntity } from './entities/vendedor.entity';
import { ZonasModule } from '../zonas/zonas.module';

@Module({
  imports: [TypeOrmModule.forFeature([VendedorEntity]), ZonasModule],
  controllers: [VendedoresController],
  providers: [VendedoresService],
  exports: [VendedoresService],
})
export class VendedoresModule {}
