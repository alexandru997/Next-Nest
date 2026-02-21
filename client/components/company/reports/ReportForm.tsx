'use client';

import { useState } from 'react';
import type { ReportInput } from '@/types/company';

type FormState = {
  year: string; quarter: string; co2Emissions: string; energyUsage: string;
  waterUsage: string; wasteGenerated: string; renewablePct: string; notes: string;
};

interface Field {
  label: string;
  key: keyof FormState;
  type: string;
  required?: boolean;
  step?: string;
  placeholder?: string;
}

const FIELDS: Field[] = [
  { label: 'Year *',               key: 'year',          type: 'number', required: true },
  { label: 'Quarter (1–4)',        key: 'quarter',       type: 'number', placeholder: 'Optional' },
  { label: 'CO₂ Emissions (t)',    key: 'co2Emissions',  type: 'number', step: '0.01' },
  { label: 'Energy Usage (MWh)',   key: 'energyUsage',   type: 'number', step: '0.01' },
  { label: 'Water Usage (m³)',     key: 'waterUsage',    type: 'number', step: '0.01' },
  { label: 'Waste Generated (kg)', key: 'wasteGenerated',type: 'number', step: '0.01' },
  { label: 'Renewable % (0–100)',  key: 'renewablePct',  type: 'number', step: '0.1' },
  { label: 'Notes',                key: 'notes',         type: 'text' },
];

const EMPTY: FormState = {
  year: String(new Date().getFullYear()),
  quarter: '', co2Emissions: '', energyUsage: '',
  waterUsage: '', wasteGenerated: '', renewablePct: '', notes: '',
};

interface Props {
  onSubmit: (input: ReportInput) => Promise<void>;
  onCancel: () => void;
}

export default function ReportForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      year:          Number(form.year),
      quarter:       form.quarter        ? Number(form.quarter)        : undefined,
      co2Emissions:  form.co2Emissions   ? Number(form.co2Emissions)   : undefined,
      energyUsage:   form.energyUsage    ? Number(form.energyUsage)    : undefined,
      waterUsage:    form.waterUsage     ? Number(form.waterUsage)     : undefined,
      wasteGenerated:form.wasteGenerated ? Number(form.wasteGenerated) : undefined,
      renewablePct:  form.renewablePct   ? Number(form.renewablePct)   : undefined,
      notes:         form.notes || undefined,
    });
    setForm(EMPTY);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-800 mb-4">New Emission Report</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {FIELDS.map(({ label, key, type, required, step, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                required={required}
                step={step}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
            Save Report
          </button>
          <button type="button" onClick={onCancel} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
