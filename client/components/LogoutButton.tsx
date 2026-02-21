'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    document.cookie = 'user_name=; path=/; max-age=0';
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-400 hover:text-red-500 transition-colors"
    >
      Logout
    </button>
  );
}
