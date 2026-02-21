import { cookies } from 'next/headers';
import Link from 'next/link';
import { serverFetch } from '@/lib/graphql/server-fetch';
import { COMPANIES_QUERY } from '@/lib/graphql/queries';
import CreateCompanyForm from '@/components/CreateCompanyForm';

interface Company {
  id: string;
  name: string;
  industry?: string;
  country?: string;
  createdAt: string;
}

export default async function CompaniesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value ?? '';

  const { companies } = await serverFetch<{ companies: Company[] }>(COMPANIES_QUERY, {}, token);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your companies</p>
        </div>
        <CreateCompanyForm />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {companies.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No companies yet. Click &quot;New Company&quot; to add one.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Industry', 'Country', 'Created', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/companies/${c.id}`}
                      className="font-medium text-emerald-700 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.industry ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{c.country ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/companies/${c.id}`} className="text-emerald-600 hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
