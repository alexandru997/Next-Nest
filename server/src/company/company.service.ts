import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyInput } from './company.types';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(input: CompanyInput) {
    return this.prisma.company.create({ data: input });
  }

  async update(id: string, input: CompanyInput) {
    await this.findOne(id);
    return this.prisma.company.update({ where: { id }, data: input });
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.company.delete({ where: { id } });
    return true;
  }
}
