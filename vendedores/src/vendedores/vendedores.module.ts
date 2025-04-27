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
import { PlanVentasEntity } from './entities/plan-ventas.entity';
import { MetaTrimestralEntity } from './entities/meta-trimestral.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VendedorEntity,
      PlanVentasEntity,
      MetaTrimestralEntity,
      TrimestreEntity,
    ]),
    ZonasModule,
  ],
  controllers: [VendedoresController, PlanVentasController],
  providers: [VendedoresService, TrimestreSeedService, PlanVentasService],
  exports: [VendedoresService, PlanVentasService, TypeOrmModule],
})
export class VendedoresModule {}
