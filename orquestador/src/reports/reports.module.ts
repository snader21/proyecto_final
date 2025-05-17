import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { HttpModule } from '@nestjs/axios';
import { BigQueryService } from './bigquery-service';
import { GCPConfigService } from './gcp-config.service';
@Module({
  imports: [HttpModule],
  controllers: [ReportsController],
  providers: [ReportsService, BigQueryService, GCPConfigService],
})
export class ReportsModule {}
