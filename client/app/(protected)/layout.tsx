import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/');

  const userName = decodeURIComponent(cookieStore.get('user_name')?.value ?? 'User');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={userName} />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
