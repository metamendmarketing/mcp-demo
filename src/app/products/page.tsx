import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ChevronRight, Home, Users, Zap, Maximize } from 'lucide-react';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      series: true,
    },
    orderBy: {
      series: {
        name: 'asc',
      },
    },
  });

  // Group by series
  const seriesGroups = products.reduce((acc: any, product) => {
    const seriesName = product.series?.name || 'Other';
    if (!acc[seriesName]) acc[seriesName] = [];
    acc[seriesName].push(product);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#1e293b] font-sans">
      {/* Header */}
      <header className="w-full bg-[#181818] py-4 border-b border-white/5 sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-8 group cursor-pointer">
             <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-10 md:h-12 w-auto object-contain hover:scale-105 transition-transform duration-500" />
          </Link>
          <nav className="hidden xl:flex items-center gap-12 text-[11px] uppercase font-black tracking-[0.1em] text-white">
            <Link href="/products" className="text-marquis-green leading-tight text-center">Hot<br/>Tubs</Link>
            <span className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Swim<br/>Spas</span>
            <span className="hover:text-marquis-green cursor-pointer transition-colors leading-tight text-center">Options &<br/>Accessories</span>
          </nav>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3 italic">
          <Link href="/" className="hover:text-marquis-blue transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-marquis-blue">All Products</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase text-slate-900 mb-4">
            The Marquis <span className="text-marquis-blue">Lineup</span>
          </h1>
          <p className="text-slate-500 max-w-2xl font-medium">
            Explore our entire collection of meticulously crafted hot tubs and swim spas. 
            From the luxury of the Crown Series to the value of the Celebrity Series.
          </p>
        </div>

        {Object.entries(seriesGroups).map(([seriesName, seriesProducts]: [string, any]) => (
          <section key={seriesName} className="mb-20">
            <div className="flex items-center gap-6 mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-wider text-slate-800 shrink-0">
                {seriesName}
              </h2>
              <div className="h-px bg-slate-200 flex-grow" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seriesProducts.map((p: any) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col group cursor-pointer">
                  <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
                    <img 
                      src={p.heroImageUrl || '/mcp/demo/assets/therapy_premium.png'} 
                      alt={p.modelName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <div className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                          <Users className="w-3 h-3 text-marquis-blue" />
                          {p.seatsMax} Seats
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                          <Zap className="w-3 h-3 text-marquis-blue" />
                          {p.jetCount} Jets
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-black italic uppercase text-slate-800 mb-4 group-hover:text-marquis-blue transition-colors">
                      {p.modelName}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                      {p.marketingSummary}
                    </p>
                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                         {p.lengthIn}x{p.widthIn}x{p.depthIn}"
                       </span>
                       <div className="text-marquis-blue text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group/btn">
                         Details <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
