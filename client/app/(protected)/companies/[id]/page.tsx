import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { serverFetch } from '@/lib/graphql/server-fetch';
import { COMPANY_QUERY, REPORTS_QUERY, GOALS_QUERY } from '@/lib/graphql/queries';
import CompanyTabs from '@/components/CompanyTabs';

interface Company {
  id: string;
  name: string;
  industry?: string;
  country?: string;
}

interface Report {
  id: string;
  year: number;
  quarter?: number;
  co2Emissions?: number;
  energyUsage?: number;
  waterUsage?: number;
  wasteGenerated?: number;
  renewablePct?: number;
  notes?: string;
}

interface Goal {
  id: string;
  metric: 'CO2' | 'ENERGY' | 'WATER' | 'WASTE';
  targetValue: number;
  targetYear: number;
  baselineValue: number;
  baselineYear: number;
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? '';

  const [companyData, reportsData, goalsData] = await Promise.all([
    serverFetch<{ company: Company }>(COMPANY_QUERY, { id }, token),
    serverFetch<{ reports: Report[] }>(REPORTS_QUERY, { companyId: id }, token),
    serverFetch<{ goals: Goal[] }>(GOALS_QUERY, { companyId: id }, token),
  ]);

  if (!companyData.company) notFound();

  const { company } = companyData;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/companies" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Companies
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">{company.name}</h1>
        {(company.industry || company.country) && (
          <p className="text-gray-500 text-sm mt-1">
            {[company.industry, company.country].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      <CompanyTabs
        companyId={id}
        initialReports={reportsData.reports}
        initialGoals={goalsData.goals}
      />
    </div>
  );
}
