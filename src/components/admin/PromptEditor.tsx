'use client';

import React, { useState, useEffect } from 'react';
import { CaretDown, CaretUp, FloppyDisk, WarningCircle, CheckCircle } from '@phosphor-icons/react';

interface Prompt {
  id: string;
  key: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function PromptEditor() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<Record<string, 'success' | 'error' | null>>({});

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/mcp/demo/api/admin/prompts');
      if (!res.ok) throw new Error('Failed to fetch prompts');
      const data = await res.json();
      setPrompts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, content: string) => {
    try {
      setSavingKey(key);
      setSaveStatus({ ...saveStatus, [key]: null });
      
      const res = await fetch('/mcp/demo/api/admin/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content }),
      });

      if (!res.ok) throw new Error('Save failed');
      
      setSaveStatus({ ...saveStatus, [key]: 'success' });
      // Update local state
      setPrompts(prompts.map(p => p.key === key ? { ...p, content } : p));
      
      setTimeout(() => {
        setSaveStatus({ ...saveStatus, [key]: null });
      }, 3000);
    } catch (err: any) {
      setSaveStatus({ ...saveStatus, [key]: 'error' });
    } finally {
      setSavingKey(null);
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-marquis-blue"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-2 border-red-100 p-6 rounded-3xl flex items-center gap-4 text-red-600 font-bold italic uppercase text-sm">
      <WarningCircle className="w-6 h-6" weight="fill" />
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {prompts.map((prompt) => (
        <div key={prompt.key} className="bg-white rounded-3xl border-2 border-slate-100 overflow-hidden transition-all shadow-sm hover:shadow-md">
          <button 
            onClick={() => toggleExpand(prompt.key)}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4 text-left">
               <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <span className="font-black italic text-xs uppercase">{prompt.key[0]}</span>
               </div>
               <div>
                  <h4 className="text-lg font-black italic uppercase text-slate-800 leading-none">{prompt.title}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Key: {prompt.key}</p>
               </div>
            </div>
            {expandedKey === prompt.key ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
          </button>

          {expandedKey === prompt.key && (
            <div className="px-8 pb-8 animate-slick-reveal">
              <div className="relative">
                <textarea
                  className="w-full h-[400px] p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-sm text-slate-700 focus:border-marquis-blue focus:ring-0 transition-all outline-none resize-none"
                  defaultValue={prompt.content}
                  id={`prompt-${prompt.key}`}
                />
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {saveStatus[prompt.key] === 'success' && (
                      <div className="flex items-center gap-2 text-green-600 font-black italic uppercase text-xs animate-bounce">
                        <CheckCircle weight="fill" className="w-4 h-4" /> Changes Saved
                      </div>
                    )}
                    {saveStatus[prompt.key] === 'error' && (
                      <div className="flex items-center gap-2 text-red-600 font-black italic uppercase text-xs">
                        <WarningCircle weight="fill" className="w-4 h-4" /> Error Saving
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      const el = document.getElementById(`prompt-${prompt.key}`) as HTMLTextAreaElement;
                      handleSave(prompt.key, el.value);
                    }}
                    disabled={savingKey === prompt.key}
                    className="bg-marquis-blue text-white px-8 py-4 rounded-2xl font-black italic uppercase text-xs flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {savingKey === prompt.key ? (
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <FloppyDisk weight="bold" className="w-4 h-4" />
                    )}
                    Save Prompt Changes
                  </button>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                 <h5 className="text-[10px] font-black text-marquis-blue uppercase tracking-widest mb-3 flex items-center gap-2">
                    <WarningCircle weight="fill" /> Important Notice
                 </h5>
                 <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase">
                    Modifying system prompts can fundamentally change AI behavior. Ensure that any dynamic placeholders like <code className="text-marquis-blue">{"{{KNOWLEDGE_BASE}}"}</code> or <code className="text-marquis-blue">{"{{USER_PREFERENCES}}"}</code> are preserved unless you are specifically refactoring the logic.
                 </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
