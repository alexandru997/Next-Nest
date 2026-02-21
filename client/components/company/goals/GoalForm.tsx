'use client';

import { useState } from 'react';
import { METRIC_LABELS, METRIC_UNITS } from '@/types/company';
import type { GoalInput, MetricType } from '@/types/company';

interface FormState {
  metric: MetricType;
  baselineYear: string;
  baselineValue: string;
  targetYear: string;
  targetValue: string;
}

const EMPTY: FormState = {
  metric: 'CO2',
  baselineYear: String(new Date().getFullYear()),
  baselineValue: '',
  targetYear: String(new Date().getFullYear() + 5),
  targetValue: '',
};

interface Props {
  onSubmit: (input: GoalInput) => Promise<void>;
  onCancel: () => void;
}

export default function GoalForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const unit = METRIC_UNITS[form.metric];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      metric:        form.metric,
      baselineYear:  Number(form.baselineYear),
      baselineValue: Number(form.baselineValue),
      targetYear:    Number(form.targetYear),
      targetValue:   Number(form.targetValue),
    });
    setForm(EMPTY);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-800 mb-4">New Reduction Goal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metric *</label>
            <select
              value={form.metric}
              onChange={(e) => setForm({ ...form, metric: e.target.value as MetricType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Object.entries(METRIC_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {([
            { label: 'Baseline Year *',         key: 'baselineYear',  step: undefined },
            { label: `Baseline Value (${unit}) *`, key: 'baselineValue', step: '0.01' },
            { label: 'Target Year *',            key: 'targetYear',   step: undefined },
            { label: `Target Value (${unit}) *`, key: 'targetValue',  step: '0.01' },
          ] as const).map(({ label, key, step }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="number"
                required
                step={step}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
            Save Goal
          </button>
          <button type="button" onClick={onCancel} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
