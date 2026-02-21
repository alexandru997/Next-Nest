export async function serverFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  token = '',
): Promise<T> {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}
