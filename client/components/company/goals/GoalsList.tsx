'use client';

import { METRIC_LABELS, METRIC_UNITS } from '@/types/company';
import type { Goal } from '@/types/company';

interface Props {
  goals: Goal[];
  onDelete: (id: string) => void;
  loadingId: string | null;
}

function reductionPct(g: Goal): number {
  if (g.baselineValue <= 0) return 0;
  return Math.max(0, Math.min(100, ((g.baselineValue - g.targetValue) / g.baselineValue) * 100));
}

export default function GoalsList({ goals, onDelete, loadingId }: Props) {
  if (goals.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
        No goals yet. Click &quot;Add Goal&quot; to set a reduction target.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="divide-y divide-gray-100">
        {goals.map((g) => {
          const pct = reductionPct(g);
          return (
            <div
              key={g.id}
              className={`px-6 py-5 flex items-center justify-between hover:bg-gray-50 ${loadingId === g.id ? 'opacity-40' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-medium text-gray-900">{METRIC_LABELS[g.metric]}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    Target {g.targetYear}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {g.baselineValue} {METRIC_UNITS[g.metric]} ({g.baselineYear}) →{' '}
                  {g.targetValue} {METRIC_UNITS[g.metric]} —{' '}
                  <span className="text-emerald-600 font-medium">{pct.toFixed(1)}% reduction</span>
                </p>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full w-64 max-w-full">
                  <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <button
                onClick={() => onDelete(g.id)}
                className="text-red-400 hover:text-red-600 text-sm hover:underline ml-6 shrink-0"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
