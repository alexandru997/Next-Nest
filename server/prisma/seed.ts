import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.emissionReport.deleteMany();
  await prisma.reductionGoal.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const volta = await prisma.company.create({
    data: { name: 'Volta Energy AG', industry: 'Energy', country: 'Germany' },
  });

  const novatex = await prisma.company.create({
    data: {
      name: 'NovaTex Industries',
      industry: 'Manufacturing',
      country: 'France',
    },
  });

  const greenleaf = await prisma.company.create({
    data: {
      name: 'GreenLeaf Logistics',
      industry: 'Transportation',
      country: 'Netherlands',
    },
  });

  const hash = await bcrypt.hash('Demo1234!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: hash,
      name: 'Demo Admin',
      role: 'ADMIN',
    },
  });

  const voltaReports = [
    {
      year: 2021,
      co2Emissions: 12400,
      energyUsage: 98000,
      waterUsage: 4200,
      wasteGenerated: 1850,
      renewablePct: 18,
    },
    {
      year: 2022,
      co2Emissions: 11200,
      energyUsage: 91000,
      waterUsage: 3900,
      wasteGenerated: 1700,
      renewablePct: 25,
    },
    {
      year: 2023,
      co2Emissions: 9800,
      energyUsage: 84000,
      waterUsage: 3600,
      wasteGenerated: 1520,
      renewablePct: 34,
    },
    {
      year: 2024,
      co2Emissions: 8100,
      energyUsage: 76000,
      waterUsage: 3200,
      wasteGenerated: 1310,
      renewablePct: 45,
    },
  ];

  const novatexReports = [
    {
      year: 2021,
      co2Emissions: 8700,
      energyUsage: 62000,
      waterUsage: 9800,
      wasteGenerated: 4200,
      renewablePct: 8,
    },
    {
      year: 2022,
      co2Emissions: 8200,
      energyUsage: 59000,
      waterUsage: 9200,
      wasteGenerated: 3900,
      renewablePct: 12,
    },
    {
      year: 2023,
      co2Emissions: 7400,
      energyUsage: 54000,
      waterUsage: 8500,
      wasteGenerated: 3500,
      renewablePct: 19,
    },
    {
      year: 2024,
      co2Emissions: 6600,
      energyUsage: 49000,
      waterUsage: 7800,
      wasteGenerated: 3100,
      renewablePct: 27,
    },
  ];

  const greenleafReports = [
    {
      year: 2021,
      co2Emissions: 5400,
      energyUsage: 38000,
      waterUsage: 1200,
      wasteGenerated: 680,
      renewablePct: 22,
    },
    {
      year: 2022,
      co2Emissions: 5000,
      energyUsage: 35500,
      waterUsage: 1100,
      wasteGenerated: 620,
      renewablePct: 31,
    },
    {
      year: 2023,
      co2Emissions: 4200,
      energyUsage: 30000,
      waterUsage: 980,
      wasteGenerated: 540,
      renewablePct: 44,
    },
    {
      year: 2024,
      co2Emissions: 3400,
      energyUsage: 24500,
      waterUsage: 830,
      wasteGenerated: 450,
      renewablePct: 58,
    },
  ];

  for (const data of voltaReports) {
    await prisma.emissionReport.create({
      data: { ...data, companyId: volta.id, createdById: admin.id },
    });
  }

  for (const data of novatexReports) {
    await prisma.emissionReport.create({
      data: { ...data, companyId: novatex.id, createdById: admin.id },
    });
  }

  for (const data of greenleafReports) {
    await prisma.emissionReport.create({
      data: { ...data, companyId: greenleaf.id, createdById: admin.id },
    });
  }

  await prisma.reductionGoal.createMany({
    data: [
      {
        companyId: volta.id,
        metric: 'CO2',
        baselineYear: 2021,
        baselineValue: 12400,
        targetYear: 2030,
        targetValue: 4000,
      },
      {
        companyId: volta.id,
        metric: 'ENERGY',
        baselineYear: 2021,
        baselineValue: 98000,
        targetYear: 2030,
        targetValue: 40000,
      },
      {
        companyId: novatex.id,
        metric: 'CO2',
        baselineYear: 2021,
        baselineValue: 8700,
        targetYear: 2028,
        targetValue: 3000,
      },
      {
        companyId: novatex.id,
        metric: 'WASTE',
        baselineYear: 2021,
        baselineValue: 4200,
        targetYear: 2028,
        targetValue: 1200,
      },
      {
        companyId: greenleaf.id,
        metric: 'CO2',
        baselineYear: 2021,
        baselineValue: 5400,
        targetYear: 2027,
        targetValue: 1200,
      },
      {
        companyId: greenleaf.id,
        metric: 'ENERGY',
        baselineYear: 2021,
        baselineValue: 38000,
        targetYear: 2027,
        targetValue: 10000,
      },
    ],
  });

  console.log('Seed complete.');
  console.log('Login: admin@demo.com / Demo1234!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
