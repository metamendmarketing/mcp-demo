'use client';

import React, { useState } from 'react';
import { login } from '@/app/admin/actions';
import { Key, User, ShieldCheck } from '@phosphor-icons/react';

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex-grow flex items-center justify-center bg-[url('/mcp/demo/assets/intro_bg.png')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-[32px] shadow-2xl animate-slick-reveal">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-marquis-blue rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-marquis-blue/20">
            <ShieldCheck className="w-10 h-10 text-white" weight="duotone" />
          </div>
          <h2 className="text-3xl font-black italic uppercase text-slate-800">Secure Access</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Marquis Buying Assistant Admin</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                name="username"
                type="text" 
                required
                defaultValue="admin"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-bold focus:border-marquis-blue focus:ring-0 transition-all outline-none"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-bold focus:border-marquis-blue focus:ring-0 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-marquis-premium py-5 rounded-2xl text-lg font-black italic uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login to Portal"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Restricted Access &sdot; Marquis Hot Tubs &copy; 2026
        </p>
      </div>
    </div>
  );
}
