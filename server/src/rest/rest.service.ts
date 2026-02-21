import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestService {
  constructor(private prisma: PrismaService) {}

  async exportReportsCsv(companyId: string): Promise<string> {
    const reports = await this.prisma.emissionReport.findMany({
      where: { companyId },
      orderBy: [{ year: 'desc' }, { quarter: 'desc' }],
    });

    const headers = ['id', 'year', 'quarter', 'co2Emissions', 'energyUsage', 'waterUsage', 'wasteGenerated', 'renewablePct', 'notes'];
    const rows = reports.map((r) => [
      r.id,
      r.year,
      r.quarter ?? '',
      r.co2Emissions ?? '',
      r.energyUsage ?? '',
      r.waterUsage ?? '',
      r.wasteGenerated ?? '',
      r.renewablePct ?? '',
      r.notes ?? '',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  async getSummary() {
    const [totalCompanies, totalReports, totalGoals] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.emissionReport.count(),
      this.prisma.reductionGoal.count(),
    ]);

    const latestReports = await this.prisma.emissionReport.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        year: true,
        quarter: true,
        co2Emissions: true,
        companyId: true,
      },
    });

    return {
      totalCompanies,
      totalReports,
      totalGoals,
      latestReports,
    };
  }
}
