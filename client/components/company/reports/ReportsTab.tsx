'use client';

import { useState } from 'react';
import ReportForm from './ReportForm';
import ReportsTable from './ReportsTable';
import type { Report, ReportInput } from '@/types/company';

interface Props {
  reports: Report[];
  onAdd: (input: ReportInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loadingId: string | null;
}

export default function ReportsTab({ reports, onAdd, onDelete, loadingId }: Props) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (input: ReportInput) => {
    await onAdd(input);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          + Add Report
        </button>
      </div>
      {showForm && <ReportForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
      <ReportsTable reports={reports} onDelete={onDelete} loadingId={loadingId} />
    </div>
  );
}
