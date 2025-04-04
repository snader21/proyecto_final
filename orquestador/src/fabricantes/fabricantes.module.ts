import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FabricantesService } from './fabricantes.service';
import { FabricantesController } from './fabricantes.controller';

@Module({
  imports: [HttpModule],
  controllers: [FabricantesController],
  providers: [FabricantesService],
})
export class FabricantesModule {}
