import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/graphql/client-fetch';
import { CREATE_REPORT_MUTATION, DELETE_REPORT_MUTATION } from '@/lib/graphql/mutations';
import type { Report, ReportInput } from '@/types/company';

export function useReports(companyId: string, initial: Report[]) {
  const router = useRouter();
  const [reports, setReports] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => { setReports(initial); }, [initial]);

  const addReport = async (input: ReportInput) => {
    const { createReport } = await clientFetch<{ createReport: Report }>(
      CREATE_REPORT_MUTATION,
      { input: { companyId, ...input } },
    );
    setReports((prev) => [...prev, createReport]);
    router.refresh();
  };

  const removeReport = async (id: string) => {
    setLoadingId(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    await clientFetch(DELETE_REPORT_MUTATION, { id });
    setLoadingId(null);
    router.refresh();
  };

  return { reports, addReport, removeReport, loadingId };
}
