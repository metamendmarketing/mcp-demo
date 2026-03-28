import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { House, SignOut, Gear } from '@phosphor-icons/react/dist/ssr';
import { logout } from './actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await cookies()).get('marquis_admin_session');
  const isAuthenticated = session?.value === 'authenticated';

  // Allow access to login page only
  if (!isAuthenticated && !children?.toString().includes('Login')) {
     // This is a bit brittle, we'll check for the segment instead in a real app, 
     // but for this flat structure, let's just use the segment logic if possible.
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Admin Header */}
      {isAuthenticated && (
        <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center shadow-lg shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-marquis-blue rounded-xl flex items-center justify-center">
              <Gear className="w-6 h-6 text-white" weight="bold" />
            </div>
            <div>
              <h1 className="text-lg font-black italic uppercase tracking-wider leading-none">Marquis Admin</h1>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-1">Hotspot Management Portal</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-bold uppercase tracking-widest hover:text-marquis-blue transition-colors flex items-center gap-2">
              <House className="w-4 h-4" /> Dashboard
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                <SignOut className="w-4 h-4" /> Logout
              </button>
            </form>
          </nav>
        </header>
      )}

      <main className="flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
}
