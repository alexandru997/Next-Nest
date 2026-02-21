import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportInput } from './report.types';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, year?: number) {
    return this.prisma.emissionReport.findMany({
      where: {
        companyId,
        ...(year && { year }),
      },
      orderBy: [{ year: 'desc' }, { quarter: 'desc' }],
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.emissionReport.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  async create(input: ReportInput, userId: string) {
    return this.prisma.emissionReport.create({
      data: {
        companyId: input.companyId,
        year: input.year,
        quarter: input.quarter,
        co2Emissions: input.co2Emissions,
        energyUsage: input.energyUsage,
        waterUsage: input.waterUsage,
        wasteGenerated: input.wasteGenerated,
        renewablePct: input.renewablePct,
        notes: input.notes,
        createdById: userId,
      },
    });
  }

  async update(id: string, input: Partial<ReportInput>) {
    await this.findOne(id);
    return this.prisma.emissionReport.update({
      where: { id },
      data: {
        ...(input.year && { year: input.year }),
        ...(input.quarter !== undefined && { quarter: input.quarter }),
        ...(input.co2Emissions !== undefined && { co2Emissions: input.co2Emissions }),
        ...(input.energyUsage !== undefined && { energyUsage: input.energyUsage }),
        ...(input.waterUsage !== undefined && { waterUsage: input.waterUsage }),
        ...(input.wasteGenerated !== undefined && { wasteGenerated: input.wasteGenerated }),
        ...(input.renewablePct !== undefined && { renewablePct: input.renewablePct }),
        ...(input.notes !== undefined && { notes: input.notes }),
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.emissionReport.delete({ where: { id } });
    return true;
  }
}
