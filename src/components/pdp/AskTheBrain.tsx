'use client';

import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send, Loader2, CheckCircle2, Info, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AskTheBrainProps {
  productId?: string;
  productName?: string;
  preferences?: any;
}

export default function AskTheBrain({ productId, productName, preferences }: AskTheBrainProps) {
  console.log('AskTheBrain rendering with:', { productId, productName });
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ answer: string; citedFeatures?: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/mcp/demo/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, productId, preferences }),
      });

      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError("I'm having trouble connecting to my knowledge base right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden mt-12 mb-20 group transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="bg-slate-900 p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-marquis-blue/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-marquis-blue p-4 rounded-2xl shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white leading-none mb-2">Question? Ask us.</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Grounded in 40+ years of Marquis expertise</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Engineering Verified</span>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-10">
        <form onSubmit={handleAsk} className="relative mb-8">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={productName ? `What would you like to know about the ${productName}?` : "Ask anything about Marquis hot tubs..."}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 pl-8 pr-20 text-lg font-semibold text-slate-800 focus:outline-none focus:border-marquis-blue focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="absolute right-3 top-3 bottom-3 aspect-square bg-marquis-blue text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Results Area */}
        {loading && (
          <div className="space-y-4 py-4">
            <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-4/6 animate-pulse" />
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex gap-4 items-start animate-in fade-in slide-in-from-top-2">
            <Info className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 font-bold">{error}</p>
          </div>
        )}

        {response && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-6 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Fact-Based Response</span>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-xl text-slate-700 font-semibold leading-relaxed mb-8 italic">
                "{response.answer}"
              </p>
            </div>

            {response.citedFeatures && response.citedFeatures.length > 0 && (
              <div className="pt-8 border-t border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cited Features & Concepts</div>
                <div className="flex flex-wrap gap-2">
                  {response.citedFeatures.map((feat, i) => (
                    <div key={i} className="px-4 py-2 bg-marquis-blue/5 border border-marquis-blue/10 rounded-xl text-xs font-black text-marquis-blue uppercase flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !response && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Where are your spas made?",
              "What is the V-O-L-T™ system?",
              "How does employee ownership affect me?",
              "What is Make-A-Wish partnership?",
              "Tell me about ConstantClean+™",
              "How quiet are the pumps?"
            ].map((q, i) => (
              <button 
                key={i} 
                onClick={() => { setQuestion(q); }}
                className="text-left p-4 rounded-2xl border border-slate-100 text-sm font-bold text-slate-500 hover:border-marquis-blue hover:text-marquis-blue hover:bg-marquis-blue/5 transition-all flex justify-between items-center group/suggestion"
              >
                {q}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover/suggestion:opacity-100 -translate-x-2 group-hover/suggestion:translate-x-0 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Branding */}
      <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Marquis Engineering | Fact-Based Precision</p>
      </div>
    </div>
  );
}
