'use client';

import type { Report } from '@/types/company';

interface Props {
  reports: Report[];
  onDelete: (id: string) => void;
  loadingId: string | null;
}

const COLUMNS = ['Year', 'Q', 'CO₂ (t)', 'Energy (MWh)', 'Water (m³)', 'Waste (kg)', 'Renew. %', ''];

export default function ReportsTable({ reports, onDelete, loadingId }: Props) {
  if (reports.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
        No reports yet. Click &quot;Add Report&quot; to create one.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {COLUMNS.map((h) => (
              <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reports.map((r) => (
            <tr key={r.id} className={`hover:bg-gray-50 ${loadingId === r.id ? 'opacity-40' : ''}`}>
              <td className="px-6 py-4 font-medium text-gray-900">{r.year}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{r.quarter ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{r.co2Emissions?.toFixed(1) ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{r.energyUsage?.toFixed(1) ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{r.waterUsage?.toFixed(1) ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{r.wasteGenerated?.toFixed(1) ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {r.renewablePct != null ? `${r.renewablePct}%` : '—'}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(r.id)}
                  className="text-red-400 hover:text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
