import { Module } from '@nestjs/common';
import { ProveedorAiService } from './proveedor-ai.service';

@Module({
  providers: [ProveedorAiService],
  exports: [ProveedorAiService],
})
export class ProveedorAiModule {}
