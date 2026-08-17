'use client';

import React from 'react';
import { UserCheck, Sparkles, Trash2 } from 'lucide-react';

export type TabType = 'metrics' | 'events' | 'leads' | 'ai_synthesis';

interface AnalyticsTabsNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  eventsCount: number;
  leadsCount: number;
  onClearLogsClick: () => void;
  onResetAllClick: () => void;
}

export const AnalyticsTabsNav: React.FC<AnalyticsTabsNavProps> = ({
  activeTab,
  onSelectTab,
  eventsCount,
  leadsCount,
  onClearLogsClick,
  onResetAllClick,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2 mb-4">
      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => onSelectTab('metrics')}
          className={`px-3 py-1 text-xs font-extrabold uppercase border-2 border-black transition-all cursor-pointer ${
            activeTab === 'metrics'
              ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          📊 Overview
        </button>

        <button
          onClick={() => onSelectTab('events')}
          className={`px-3 py-1 text-xs font-extrabold uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-1 ${
            activeTab === 'events'
              ? 'bg-cyan-300 text-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <span>📜 Event Stream</span>
          <span className="text-[10px] bg-black text-white px-1 font-mono">
            {eventsCount}
          </span>
        </button>

        <button
          onClick={() => onSelectTab('leads')}
          className={`px-3 py-1 text-xs font-extrabold uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-1 ${
            activeTab === 'leads'
              ? 'bg-pink-300 text-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Leads & Chats</span>
          <span className="text-[10px] bg-black text-white px-1 font-mono">
            {leadsCount}
          </span>
        </button>

        <button
          onClick={() => onSelectTab('ai_synthesis')}
          className={`px-3 py-1 text-xs font-extrabold uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-1 ${
            activeTab === 'ai_synthesis'
              ? 'bg-emerald-300 text-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          <span>AI Intent Synthesis</span>
        </button>
      </div>

      {/* Deletion & Cleanup Controls (Checkpoints pattern) */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onClearLogsClick}
          disabled={eventsCount === 0}
          className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-red-200 dark:hover:bg-red-950 text-slate-800 dark:text-slate-200 border border-black font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer disabled:opacity-40"
          title="Clear Event Log History"
        >
          <Trash2 className="w-3 h-3 text-red-500" />
          Clear Logs
        </button>

        <button
          onClick={onResetAllClick}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white border border-black font-extrabold text-[10px] uppercase flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
          title="Reset All Analytics and Counters to 0"
        >
          <Trash2 className="w-3 h-3" />
          Reset All
        </button>
      </div>
    </div>
  );
};
