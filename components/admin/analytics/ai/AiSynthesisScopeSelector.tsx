'use client';

import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { VisitorSessionOption } from '@/types';

interface AiSynthesisScopeSelectorProps {
  selectedVisitorId: string;
  visitorOptions: VisitorSessionOption[];
  isAnalyzing: boolean;
  analysisError: string | null;
  onSelectVisitor: (visitorId: string) => void;
  onRunAiAnalysis: (visitorId?: string) => void;
}

export const AiSynthesisScopeSelector: React.FC<AiSynthesisScopeSelectorProps> = ({
  selectedVisitorId,
  visitorOptions,
  isAnalyzing,
  analysisError,
  onSelectVisitor,
  onRunAiAnalysis,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Header & Scope Selector */}
      <div className="p-3 bg-yellow-100 dark:bg-slate-800 border-2 border-black space-y-3 shadow-[3px_3px_0px_0px_#000]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-extrabold uppercase text-black dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Executive AI Visitor Intent Analysis
            </h4>
            <p className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">
              Synthesizes telemetry, dwell attention, and chats with identity attribution
            </p>
          </div>

          <button
            onClick={() => onRunAiAnalysis(selectedVisitorId)}
            disabled={isAnalyzing}
            className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            {isAnalyzing ? 'Synthesizing...' : 'Run Briefing'}
          </button>
        </div>

        {/* Visitor Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-black/30 dark:border-white/20">
          <label className="text-[11px] font-extrabold uppercase text-black dark:text-white flex items-center gap-1 shrink-0">
            Target Visitor / Scope:
          </label>
          <select
            value={selectedVisitorId}
            onChange={(e) => {
              const val = e.target.value;
              onSelectVisitor(val);
              onRunAiAnalysis(val);
            }}
            disabled={isAnalyzing}
            className="flex-1 min-w-50 p-1.5 bg-white dark:bg-slate-900 border-2 border-black text-black dark:text-white text-xs font-bold font-mono cursor-pointer"
          >
            <option value="all">🌐 All Portfolio Traffic (Executive Overview & Conversion)</option>
            {visitorOptions.map((opt) => {
              const label = opt.leadName
                ? `👤 Lead: ${opt.leadName} (${opt.location}) — ${opt.eventCount} actions`
                : `👤 ${opt.location} — ${opt.device} (${opt.eventCount} actions)`;
              return (
                <option key={opt.visitorId} value={opt.visitorId}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {isAnalyzing && (
        <div className="p-8 text-center bg-slate-100 dark:bg-slate-800 border-2 border-black space-y-2 animate-pulse">
          <Bot className="w-8 h-8 mx-auto text-pink-500" />
          <p className="text-xs font-extrabold uppercase">
            AI is analyzing session dwell timestamps, actions, and conversations...
          </p>
        </div>
      )}

      {analysisError && (
        <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-bold">
          {analysisError}
        </div>
      )}
    </div>
  );
};
