'use client';

import { useState } from 'react';
import CompanyChart from './company/CompanyChart';
import ReportsTab from './company/reports/ReportsTab';
import GoalsTab from './company/goals/GoalsTab';
import { useReports } from '@/hooks/useReports';
import { useGoals } from '@/hooks/useGoals';
import type { Report, Goal } from '@/types/company';

interface Props {
  companyId: string;
  initialReports: Report[];
  initialGoals: Goal[];
}

const TABS = ['reports', 'goals'] as const;
type Tab = (typeof TABS)[number];

export default function CompanyTabs({ companyId, initialReports, initialGoals }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('reports');
  const { reports, addReport, removeReport, loadingId: reportLoadingId } = useReports(companyId, initialReports);
  const { goals, addGoal, removeGoal, loadingId: goalLoadingId } = useGoals(companyId, initialGoals);

  return (
    <div className="space-y-6">
      <CompanyChart reports={reports} />

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} ({tab === 'reports' ? reports.length : goals.length})
          </button>
        ))}
      </div>

      {activeTab === 'reports' && (
        <ReportsTab
          reports={reports}
          onAdd={addReport}
          onDelete={removeReport}
          loadingId={reportLoadingId}
        />
      )}

      {activeTab === 'goals' && (
        <GoalsTab
          goals={goals}
          onAdd={addGoal}
          onDelete={removeGoal}
          loadingId={goalLoadingId}
        />
      )}
    </div>
  );
}
