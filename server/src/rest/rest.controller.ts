import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { RestService } from './rest.service';

@Controller('api')
export class RestController {
  constructor(private restService: RestService) {}

  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('reports/export/:companyId')
  async exportReports(
    @Param('companyId') companyId: string,
    @Res() res: Response,
  ) {
    const csv = await this.restService.exportReportsCsv(companyId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="reports-${companyId}.csv"`);
    res.send(csv);
  }

  @Get('analytics/summary')
  async summary() {
    return this.restService.getSummary();
  }
}
