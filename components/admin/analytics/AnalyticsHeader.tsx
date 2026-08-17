'use client';

import React from 'react';
import { Activity, RotateCcw, X } from 'lucide-react';

interface AnalyticsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onClose: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  loading,
  onRefresh,
  onClose,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between border-b-3 border-black dark:border-white pb-3 mb-4 gap-2">
      <div>
        <h3 className="text-sm sm:text-base font-extrabold uppercase text-black dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-500 stroke-[2.5]" />
          VISITOR INTELLIGENCE & TELEMETRY HUB
        </h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase">
          Real-time Dwell Time • Scroll Depth • Intent AI Synthesis • Event Management
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onRefresh}
          className="px-2.5 py-1 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-extrabold text-xs uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          title="Refresh Analytics Data"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>

        <button
          onClick={onClose}
          className="p-1 border-2 border-black dark:border-white hover:bg-red-500 hover:text-white cursor-pointer"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
