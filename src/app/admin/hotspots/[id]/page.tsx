import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { CaretLeft, House, Gear, Image as ImageIcon } from '@phosphor-icons/react/dist/ssr';
import HotspotEditor from '@/components/admin/HotspotEditor';
import { isAuthenticated } from '../../actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function HotspotPage({ params }: PageProps) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { series: true }
  });

  if (!product) {
    notFound();
  }

  // Parse existing hotspots or start fresh
  let initialHotspots = [];
  try {
    if (product.hotspots) {
      const parsed = typeof product.hotspots === 'string' 
        ? JSON.parse(product.hotspots) 
        : product.hotspots;
      // Add temporary IDs for the editor's state management
      initialHotspots = parsed.map((h: any, i: number) => ({
        ...h,
        id: h.id || `saved-${i}`
      }));
    }
  } catch (e) {
    console.error("Failed to parse hotspots", e);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Sub-Header / Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-marquis-blue hover:bg-blue-50 transition-all border border-slate-100"
          >
            <CaretLeft weight="bold" />
          </Link>
          <div className="h-8 w-px bg-slate-100" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Editing Hotspots for</span>
            <h2 className="text-xl font-black italic uppercase text-slate-800 leading-none">{product.modelName}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex -space-x-2 mr-4">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">MB</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-marquis-blue flex items-center justify-center text-[10px] font-black text-white">AD</div>
           </div>
           <button className="p-3 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 hover:text-marquis-blue transition-all">
              <ImageIcon weight="bold" className="w-5 h-5" />
           </button>
           <button className="p-3 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 hover:text-marquis-blue transition-all">
              <Gear weight="bold" className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* The Visual Editor Component */}
      <div className="flex-grow overflow-hidden">
        <HotspotEditor product={product as any} initialHotspots={initialHotspots} />
      </div>
    </div>
  );
}
