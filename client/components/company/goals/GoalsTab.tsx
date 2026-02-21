'use client';

import { useState } from 'react';
import GoalForm from './GoalForm';
import GoalsList from './GoalsList';
import type { Goal, GoalInput } from '@/types/company';

interface Props {
  goals: Goal[];
  onAdd: (input: GoalInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loadingId: string | null;
}

export default function GoalsTab({ goals, onAdd, onDelete, loadingId }: Props) {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (input: GoalInput) => {
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
          + Add Goal
        </button>
      </div>
      {showForm && <GoalForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
      <GoalsList goals={goals} onDelete={onDelete} loadingId={loadingId} />
    </div>
  );
}
