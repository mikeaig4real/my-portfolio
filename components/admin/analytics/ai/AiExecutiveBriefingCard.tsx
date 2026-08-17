'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { VisitorIntentAnalysis } from '@/types';

interface AiExecutiveBriefingCardProps {
  analysis: VisitorIntentAnalysis;
}

export const AiExecutiveBriefingCard: React.FC<AiExecutiveBriefingCardProps> = ({
  analysis,
}) => {
  return (
    <div className="p-4 bg-yellow-50 dark:bg-slate-800 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] space-y-3.5 text-xs">
      {/* Summary Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black dark:border-white pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-black text-yellow-300 border border-black">
            {analysis.intentCategory}
          </span>
          <span className="font-extrabold text-sm text-black dark:text-white">
            Intent Confidence Score: {analysis.intentScore}%
          </span>
        </div>

        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
          {analysis.didTheyFindWhatTheyWanted}
        </span>
      </div>

      {/* Briefing text */}
      <div className="space-y-1">
        <h5 className="font-extrabold uppercase text-[11px] text-slate-600 dark:text-slate-300">
          Executive Synthesis & Summary:
        </h5>
        <p className="text-xs md:text-sm font-bold text-black dark:text-white leading-relaxed">
          {analysis.visitorSummary}
        </p>
      </div>

      {/* Primary Interest */}
      <div className="p-2.5 bg-cyan-100 dark:bg-cyan-950/60 border-2 border-black text-black dark:text-cyan-200">
        <span className="font-extrabold uppercase text-[10px] block text-cyan-800 dark:text-cyan-300">
          Primary Focus / Key Attraction:
        </span>
        <span className="font-bold">{analysis.primaryInterest}</span>
      </div>

      {/* Key Observations */}
      <div className="space-y-1.5">
        <h5 className="font-extrabold uppercase text-[11px] text-slate-600 dark:text-slate-300">
          Key Behavioral Observations:
        </h5>
        <div className="space-y-1.5">
          {analysis.keyObservations.map((obs, oIdx) => (
            <div key={oIdx} className="flex items-start gap-1.5 text-[11px]">
              <ChevronRight className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
              <span className="text-slate-800 dark:text-slate-200 font-bold">{obs}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Action */}
      <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border-2 border-black text-emerald-950 dark:text-emerald-200">
        <span className="font-extrabold uppercase text-[10px] block text-emerald-700 dark:text-emerald-400">
          Recommended Strategic Action / Next Step:
        </span>
        <p className="font-bold mt-0.5">{analysis.recommendedAction}</p>
      </div>
    </div>
  );
};
