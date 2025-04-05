import { Module } from '@nestjs/common';
import { GCPConfigService } from './services/gcp-config.service';
import { PubSubService } from './services/pubsub.service';

@Module({
  providers: [GCPConfigService, PubSubService],
  exports: [GCPConfigService, PubSubService],
})
export class CommonModule {}
