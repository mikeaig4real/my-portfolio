'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BentoCardType } from '@/types/portfolio';

interface MissingCardsBannerProps {
  missingSingletons: BentoCardType[];
  onRestore: () => void;
}

export const MissingCardsBanner: React.FC<MissingCardsBannerProps> = ({
  missingSingletons,
  onRestore,
}) => {
  if (missingSingletons.length === 0) return null;

  return (
    <div className="mb-4 p-3.5 bg-red-600 text-white font-mono border-3 border-black shadow-[5px_5px_0px_0px_#000] flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 text-xs font-extrabold uppercase">
        <AlertTriangle className="w-5 h-5 text-yellow-300 animate-bounce shrink-0" />
        <span>
          ⚠️ CRITICAL WARNING: Essential card(s) missing from portfolio view ({missingSingletons.map((s) => s.replace('_', ' ')).join(', ')}). Visitors expect to see this key information!
        </span>
      </div>
      <button
        onClick={onRestore}
        className="px-3 py-1 bg-yellow-300 text-black border-2 border-black font-extrabold text-xs uppercase hover:bg-yellow-400 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
      >
        Restore Missing Cards
      </button>
    </div>
  );
};
