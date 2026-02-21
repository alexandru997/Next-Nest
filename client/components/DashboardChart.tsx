'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface LatestReport {
  id: string;
  year: number;
  co2Emissions: number | null;
}

export default function DashboardChart({ latestReports }: { latestReports: LatestReport[] }) {
  const chartData = latestReports
    .filter((r) => r.co2Emissions != null)
    .map((r) => ({ year: String(r.year), co2: r.co2Emissions ?? 0 }));

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        CO₂ Emissions — Recent Reports
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => [`${v} tons`, 'CO₂']} />
          <Bar dataKey="co2" fill="#10b981" radius={[4, 4, 0, 0]} name="CO₂ (tons)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
