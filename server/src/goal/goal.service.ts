import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoalInput } from './goal.types';

@Injectable()
export class GoalService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.reductionGoal.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(input: GoalInput) {
    return this.prisma.reductionGoal.create({ data: input });
  }

  async delete(id: string) {
    const goal = await this.prisma.reductionGoal.findUnique({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    await this.prisma.reductionGoal.delete({ where: { id } });
    return true;
  }
}
