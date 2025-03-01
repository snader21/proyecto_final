import { Module } from '@nestjs/common';
import { CamionesService } from './camiones.service';
import { CamionesController } from './camiones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamionEntity } from './entities/camion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CamionEntity])],
  controllers: [CamionesController],
  providers: [CamionesService],
  exports: [CamionesService],
})
export class CamionesModule {}
