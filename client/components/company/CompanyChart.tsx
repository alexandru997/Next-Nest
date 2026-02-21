'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import type { Report } from '@/types/company';

export default function CompanyChart({ reports }: { reports: Report[] }) {
  const data = [...reports]
    .sort((a, b) => a.year - b.year)
    .map((r) => ({ year: String(r.year), CO2: r.co2Emissions ?? 0, Energy: r.energyUsage ?? 0 }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        Emissions Over Time
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="CO2" fill="#10b981" radius={[4, 4, 0, 0]} name="CO₂ (tons)" />
          <Bar dataKey="Energy" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Energy (MWh)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
