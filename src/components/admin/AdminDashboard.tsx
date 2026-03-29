'use client';

import React from 'react';
import Link from 'next/link';
import { CaretRight, CirclesFour, MagnifyingGlass, PlusCircle, ChatCenteredText, Package } from '@phosphor-icons/react';
import PromptEditor from './PromptEditor';

interface AdminDashboardProps {
  products: any[];
}

export default function AdminDashboard({ products }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = React.useState<'products' | 'prompts'>('products');
  const seriesNames = Array.from(new Set(products.map(p => p.series?.name || 'Unknown')));

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-slick-reveal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase text-slate-800 leading-none">
            {activeTab === 'products' ? 'Product Inventory' : 'AI System Prompts'}
          </h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3">
            {activeTab === 'products' 
              ? 'Select a model to manage interactive hotspots and media' 
              : 'Edit and refine the core AI instructions for specialized modules'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black italic uppercase text-xs transition-all ${
              activeTab === 'products' 
                ? 'bg-white text-marquis-blue shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Package weight="fill" className="w-4 h-4" />
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black italic uppercase text-xs transition-all ${
              activeTab === 'prompts' 
                ? 'bg-white text-marquis-blue shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ChatCenteredText weight="fill" className="w-4 h-4" />
            AI Prompts
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <>
          <div className="mb-10 hidden md:flex bg-white border-2 border-slate-100 rounded-2xl px-6 py-3 items-center gap-3 shadow-sm focus-within:border-marquis-blue transition-all">
            <MagnifyingGlass className="w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search models..." className="bg-transparent border-none outline-none text-slate-700 font-bold placeholder:text-slate-300 w-64" />
          </div>

          <div className="space-y-12">
            {seriesNames.map(series => {
              const seriesProducts = products.filter(p => (p.series?.name || 'Unknown') === series);
              return (
                <section key={series}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-slate-200 flex-grow" />
                    <h3 className="text-xs font-black text-marquis-blue uppercase tracking-[0.3em] px-4 py-2 bg-blue-50 rounded-full border border-blue-100">{series} Series</h3>
                    <div className="h-px bg-slate-200 flex-grow" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seriesProducts.map(product => (
                      <Link 
                        key={product.id} 
                        href={`/admin/hotspots/${product.id}`}
                        className="group bg-white rounded-3xl border-2 border-slate-100 hover:border-marquis-blue p-6 transition-all hover:shadow-xl flex flex-col h-full relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-4">
                          {product.heroImageUrl ? (
                            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm">
                               <img src={product.heroImageUrl} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-slate-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center transition-colors">
                              <CirclesFour className="w-6 h-6 text-slate-400 group-hover:text-marquis-blue" weight="duotone" />
                            </div>
                          )}
                          <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                             {product.category?.replace('_', ' ')}
                          </div>
                        </div>

                        <h4 className="text-xl font-black italic uppercase text-slate-800 group-hover:text-marquis-blue transition-colors mb-1">{product.modelName}</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{series}</p>
                        
                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <PlusCircle weight="fill" className="w-3.5 h-3.5" /> 
                              {Array.isArray(product.hotspots) 
                                ? product.hotspots.length 
                                : (typeof product.hotspots === 'string' ? JSON.parse(product.hotspots || '[]').length : 0)} Hotspots
                           </span>
                           <div className="flex items-center gap-1 text-marquis-blue font-black italic uppercase text-xs opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                              Edit Tool <CaretRight weight="bold" />
                           </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      ) : (
        <PromptEditor />
      )}
    </div>
  );
}
