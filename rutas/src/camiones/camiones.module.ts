import { Module } from '@nestjs/common';
import { CamionesService } from './camiones.service';
import { CamionesController } from './camiones.controller';

@Module({
  controllers: [CamionesController],
  providers: [CamionesService],
})
export class CamionesModule {}
