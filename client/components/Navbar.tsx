import Link from 'next/link';
import LogoutButton from './LogoutButton';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/companies', label: 'Companies' },
];

export default function Navbar({ userName }: { userName: string }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-lg font-bold text-emerald-700">🌿 EcoTrack</span>
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{userName}</span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
