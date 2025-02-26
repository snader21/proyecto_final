import { Module } from '@nestjs/common';
import { ProveedorAiService } from './ai-provider.service';

@Module({
  providers: [ProveedorAiService],
  exports: [ProveedorAiService],
})
export class ProveedorAiModule {}
