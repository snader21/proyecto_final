import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TrimestresOrquestadorService } from './trimestres-orquestador.service';
import { TrimestresOrquestadorController } from './trimestres-orquestador.controller';

@Module({
  imports: [HttpModule],
  controllers: [TrimestresOrquestadorController],
  providers: [TrimestresOrquestadorService],
  exports: [TrimestresOrquestadorService],
})
export class TrimestresOrquestadorModule {}
