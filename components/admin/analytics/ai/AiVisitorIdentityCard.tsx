'use client';

import React from 'react';
import { MapPin, Laptop, Clock, UserCheck, Globe, Mail, Building } from 'lucide-react';
import { VisitorProfileMetadata } from '@/types';

interface AiVisitorIdentityCardProps {
  meta?: VisitorProfileMetadata;
  isSingleVisitorMode: boolean;
}

export const AiVisitorIdentityCard: React.FC<AiVisitorIdentityCardProps> = ({
  meta,
  isSingleVisitorMode,
}) => {
  if (isSingleVisitorMode && meta) {
    return (
      <div className="p-3.5 bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] space-y-2.5 text-xs font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black dark:border-white pb-2">
          <span className="font-extrabold text-xs uppercase px-2 py-0.5 bg-cyan-300 text-black border border-black flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            Target Visitor Identity
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            ID: <span className="font-bold text-black dark:text-white">{meta.visitorId || 'Anonymous'}</span>
          </span>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[11px]">
          <div className="p-2 bg-slate-50 dark:bg-slate-800 border border-black flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-500 block text-[9px] uppercase">Location & IP</span>
              <span className="font-extrabold text-black dark:text-white">{meta.location || 'Unknown'}</span>
              {meta.ip && <span className="text-[9px] text-slate-400 block font-mono">IP: {meta.ip}</span>}
            </div>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800 border border-black flex items-start gap-2">
            <Laptop className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-500 block text-[9px] uppercase">Device & Browser</span>
              <span className="font-extrabold text-black dark:text-white">{meta.device || 'Desktop Browser'}</span>
              {meta.screen && <span className="text-[9px] text-slate-400 block">{meta.screen}</span>}
            </div>
          </div>

          <div className="p-2 bg-slate-50 dark:bg-slate-800 border border-black flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-500 block text-[9px] uppercase">Engagement</span>
              <span className="font-extrabold text-black dark:text-white">
                {meta.totalEvents || 0} Actions Logged
              </span>
              <span className="text-[9px] text-slate-400 block">
                {meta.totalDwellSeconds ? `⏱️ ${meta.totalDwellSeconds}s active dwell` : 'Single session'}
              </span>
            </div>
          </div>
        </div>

        {/* Captured Lead Banner if exists */}
        {(meta.leadName || meta.leadEmail || meta.leadCompany) && (
          <div className="p-2.5 bg-pink-100 dark:bg-pink-950/60 border-2 border-black flex flex-wrap items-center justify-between gap-2 text-pink-950 dark:text-pink-200">
            <div className="flex items-center gap-3">
              {meta.leadName && (
                <span className="font-extrabold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-pink-600" />
                  {meta.leadName}
                </span>
              )}
              {meta.leadCompany && (
                <span className="flex items-center gap-1 text-[11px]">
                  <Building className="w-3.5 h-3.5" />
                  {meta.leadCompany}
                </span>
              )}
            </div>
            {meta.leadEmail && (
              <a
                href={`mailto:${meta.leadEmail}`}
                className="px-2 py-0.5 bg-black text-yellow-300 font-extrabold text-[10px] flex items-center gap-1 hover:bg-yellow-300 hover:text-black border border-black"
              >
                <Mail className="w-3 h-3" /> Email Lead
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 bg-slate-100 dark:bg-slate-800 border-2 border-black flex items-center justify-between gap-2 text-xs">
      <span className="font-extrabold uppercase flex items-center gap-1.5 text-black dark:text-white">
        <Globe className="w-4 h-4 text-cyan-500" />
        Portfolio-Wide Traffic Synthesis Mode
      </span>
      <span className="text-[10px] text-slate-500 font-bold">
        {meta?.location || 'Macro Audience Overview'}
      </span>
    </div>
  );
};
