'use client';

import React from 'react';
import { Eye, Download, Mail, TrendingUp, Clock, Layers, Sparkles, ExternalLink } from 'lucide-react';
import { AnalyticsData } from '@/types';

interface AnalyticsOverviewTabProps {
  data: AnalyticsData | null;
  uniqueVisitorsCount: number;
  avgSessionDuration: number;
  maxScrollAvg: number;
  returningVisitorsCount: number;
  isAnalyzing: boolean;
  onRunAiAnalysis: () => void;
}

export const AnalyticsOverviewTab: React.FC<AnalyticsOverviewTabProps> = ({
  data,
  uniqueVisitorsCount,
  avgSessionDuration,
  maxScrollAvg,
  returningVisitorsCount,
  isAnalyzing,
  onRunAiAnalysis,
}) => {
  return (
    <div className="space-y-4">
      {/* Primary Counter Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        <div className="p-2.5 bg-yellow-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
          <Eye className="w-4 h-4 mb-1" />
          <span className="text-xl font-extrabold block">{data?.totalViews || 0}</span>
          <span className="text-[9px] font-extrabold uppercase block text-slate-800">
            Total Views
          </span>
        </div>

        <div className="p-2.5 bg-pink-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
          <Download className="w-4 h-4 mb-1" />
          <span className="text-xl font-extrabold block">
            {data?.totalResumeDownloads || 0}
          </span>
          <span className="text-[9px] font-extrabold uppercase block text-slate-800">
            CV Downloads
          </span>
        </div>

        <div className="p-2.5 bg-emerald-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
          <Mail className="w-4 h-4 mb-1" />
          <span className="text-xl font-extrabold block">
            {data?.totalContactClicks || 0}
          </span>
          <span className="text-[9px] font-extrabold uppercase block text-slate-800">
            Email Clicks
          </span>
        </div>

        <div className="p-2.5 bg-cyan-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
          <TrendingUp className="w-4 h-4 mb-1" />
          <span className="text-xl font-extrabold block">
            {uniqueVisitorsCount}
          </span>
          <span className="text-[9px] font-extrabold uppercase block text-slate-800">
            Unique Visitors
          </span>
        </div>

        <div className="p-2.5 bg-purple-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
          <Clock className="w-4 h-4 mb-1" />
          <span className="text-xl font-extrabold block">
            {avgSessionDuration}s
          </span>
          <span className="text-[9px] font-extrabold uppercase block text-slate-800">
            Avg Dwell Time
          </span>
        </div>

        <div className="p-2.5 bg-orange-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
          <Layers className="w-4 h-4 mb-1" />
          <span className="text-xl font-extrabold block">
            {maxScrollAvg}%
          </span>
          <span className="text-[9px] font-extrabold uppercase block text-slate-800">
            Avg Scroll Depth
          </span>
        </div>
      </div>

      {/* Returning Visitor & Deep Telemetry Callout */}
      <div className="p-3 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-emerald-300 text-black border border-black font-extrabold text-[10px]">
            REPEAT VISITOR TRACKING
          </span>
          <span className="font-bold text-black dark:text-white">
            {returningVisitorsCount} Returning Visitors detected
          </span>
        </div>

        <button
          onClick={onRunAiAnalysis}
          disabled={isAnalyzing}
          className="px-3 py-1 bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black font-extrabold text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          {isAnalyzing ? 'Analyzing with AI...' : 'Synthesize Visitor Intent with AI'}
        </button>
      </div>

      {/* Section Attention Heatmap & Project Clicks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section Attention Heatmap */}
        <div className="p-3.5 bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase text-black dark:text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-500" />
            Portfolio Section Attention Heatmap
          </h4>

          {data?.sectionEngagement && Object.keys(data.sectionEngagement).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(data.sectionEngagement).map(([section, seconds], idx) => {
                const maxVal = Math.max(...Object.values(data.sectionEngagement || {}), 1);
                const percent = Math.min(100, Math.round((seconds / maxVal) * 100));

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="truncate text-black dark:text-slate-200">
                        {section}
                      </span>
                      <span className="text-slate-500">{seconds}s viewed</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 border border-black overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 border-r border-black transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic py-2">
              Section dwell attention tracking in progress...
            </p>
          )}
        </div>

        {/* Top Clicked Projects & Live Demos */}
        <div className="p-3.5 bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 space-y-2.5">
          <h4 className="text-xs font-extrabold uppercase text-black dark:text-white flex items-center gap-1.5">
            <ExternalLink className="w-4 h-4 text-cyan-500" />
            Top Clicked Projects & Demos
          </h4>

          {data?.projectClicks && Object.keys(data.projectClicks).length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {Object.entries(data.projectClicks).map(([proj, count], idx) => (
                <div
                  key={idx}
                  className="p-2 bg-slate-50 dark:bg-slate-900 border border-black flex items-center justify-between text-xs"
                >
                  <span className="font-bold truncate text-black dark:text-slate-200">
                    {proj}
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-300 text-black font-extrabold text-[10px] border border-black">
                    {count} Clicks
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-xs italic py-2">
              No project link clicks recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
