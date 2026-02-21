function getToken(): string {
  if (typeof document === 'undefined') return '';
  return document.cookie.match(/(?:^|; )token=([^;]*)/)?.[1] ?? '';
}

export async function clientFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}
