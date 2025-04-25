import { Module } from '@nestjs/common';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendedorEntity } from './entities/vendedor.entity';
import { TrimestreEntity } from './entities/trimestre.entity';
import { ZonasModule } from '../zonas/zonas.module';
import { TrimestreSeedService } from './trimestre-seed.service';
import { TrimestreService } from './trimestre.service';
import { TrimestreController } from './trimestre.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VendedorEntity, TrimestreEntity]), ZonasModule],
  controllers: [VendedoresController, TrimestreController],
  providers: [VendedoresService, TrimestreSeedService, TrimestreService],
  exports: [VendedoresService, TrimestreService],
})
export class VendedoresModule {}
