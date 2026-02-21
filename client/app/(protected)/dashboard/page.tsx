import { cookies } from 'next/headers';
import Link from 'next/link';
import { serverFetch } from '@/lib/graphql/server-fetch';
import { COMPANIES_QUERY } from '@/lib/graphql/queries';
import DashboardChart from '@/components/DashboardChart';

interface Company {
  id: string;
  name: string;
  industry?: string;
  country?: string;
}

interface LatestReport {
  id: string;
  year: number;
  co2Emissions: number | null;
  companyId: string;
}

interface Summary {
  totalCompanies: number;
  totalReports: number;
  totalGoals: number;
  latestReports: LatestReport[];
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? '';

  const [companiesData, summary] = await Promise.all([
    serverFetch<{ companies: Company[] }>(COMPANIES_QUERY, {}, token),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/summary`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }).then((r) => r.json()) as Promise<Summary>,
  ]);

  const companies = companiesData.companies;

  const stats = [
    { label: 'Companies', value: summary.totalCompanies },
    { label: 'Reports', value: summary.totalReports },
    { label: 'Goals', value: summary.totalGoals },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Environmental metrics overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <DashboardChart latestReports={summary.latestReports} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Companies</h2>
          <Link href="/companies" className="text-sm text-emerald-600 hover:underline font-medium">
            Manage →
          </Link>
        </div>

        {companies.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No companies yet.{' '}
            <Link href="/companies" className="text-emerald-600 hover:underline">
              Add one →
            </Link>
          </p>
        ) : (
          <div className="space-y-1">
            {companies.map((c) => (
              <Link
                key={c.id}
                href={`/companies/${c.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {c.name}
                  </p>
                  {(c.industry || c.country) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {[c.industry, c.country].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <span className="text-gray-300 group-hover:text-emerald-500 transition-colors">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
