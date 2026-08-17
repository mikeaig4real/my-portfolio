'use client';

import React from 'react';
import { Bot } from 'lucide-react';

interface AssistantStatusHeaderProps {
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
}

export const AssistantStatusHeader: React.FC<AssistantStatusHeaderProps> = ({
  enabled,
  onToggleEnabled,
}) => {
  return (
    <div className="p-4 bg-yellow-100 dark:bg-slate-800 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex flex-wrap items-center justify-between gap-3 font-mono">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-300 border-2 border-black flex items-center justify-center text-black">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold uppercase text-black dark:text-white flex items-center gap-1.5">
            AI Resume Assistant & Digital Twin
          </h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">
            Customise how your first-person interactive resume chatbot greets and interacts with visitors.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-extrabold uppercase text-black dark:text-white">Widget Status:</span>
        <button
          onClick={() => onToggleEnabled(!enabled)}
          className={`px-3 py-1 text-xs font-extrabold border-2 border-black uppercase cursor-pointer transition-all ${
            enabled
              ? 'bg-emerald-400 text-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-slate-300 text-slate-700'
          }`}
        >
          {enabled ? 'ENABLED' : 'DISABLED'}
        </button>
      </div>
    </div>
  );
};
