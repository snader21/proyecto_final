import { Module } from '@nestjs/common';
import { BodegasService } from './bodegas.service';
import { BodegasController } from './bodegas.controller';
import { BodegaEntity } from './entities/bodega.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BodegasController],
  imports: [TypeOrmModule.forFeature([BodegaEntity])],
  providers: [BodegasService],
  exports: [BodegasService],
})
export class BodegasModule {}
