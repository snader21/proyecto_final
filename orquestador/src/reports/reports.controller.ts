import { Controller, Post } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('ejecutar-etl-reporte-ventas')
  async reporteVentasETL() {
    await this.reportsService.reporteVentasETL();
  }
}
