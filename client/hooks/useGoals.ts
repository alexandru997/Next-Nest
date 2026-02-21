import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/graphql/client-fetch';
import { CREATE_GOAL_MUTATION, DELETE_GOAL_MUTATION } from '@/lib/graphql/mutations';
import type { Goal, GoalInput } from '@/types/company';

export function useGoals(companyId: string, initial: Goal[]) {
  const router = useRouter();
  const [goals, setGoals] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => { setGoals(initial); }, [initial]);

  const addGoal = async (input: GoalInput) => {
    const { createGoal } = await clientFetch<{ createGoal: Goal }>(
      CREATE_GOAL_MUTATION,
      { input: { companyId, ...input } },
    );
    setGoals((prev) => [...prev, createGoal]);
    router.refresh();
  };

  const removeGoal = async (id: string) => {
    setLoadingId(id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
    await clientFetch(DELETE_GOAL_MUTATION, { id });
    setLoadingId(null);
    router.refresh();
  };

  return { goals, addGoal, removeGoal, loadingId };
}
