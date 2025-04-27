import { Module } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendedorEntity } from './entities/vendedor.entity';
import { TrimestreEntity } from './entities/trimestre.entity';
import { ZonasModule } from '../zonas/zonas.module';
import { TrimestreSeedService } from './trimestre-seed.service';
import { PlanVentasController } from './planVentas.controller';
import { PlanVentasService } from './planVentas.service';

@Module({
  imports: [TypeOrmModule.forFeature([VendedorEntity, TrimestreEntity]), ZonasModule],
  controllers: [VendedoresController, PlanVentasController],
  providers: [VendedoresService, TrimestreSeedService, PlanVentasService],
  exports: [VendedoresService, PlanVentasService],
})
export class VendedoresModule {}
