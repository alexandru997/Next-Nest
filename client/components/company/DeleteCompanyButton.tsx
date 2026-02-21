'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/graphql/client-fetch';
import { DELETE_COMPANY_MUTATION } from '@/lib/graphql/mutations';

export default function DeleteCompanyButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this company and all its data?')) return;
    setLoading(true);
    await clientFetch(DELETE_COMPANY_MUTATION, { id });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-600 hover:underline disabled:opacity-40"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}
