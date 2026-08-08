'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Mail, X, Activity, Globe, Monitor, ShieldAlert } from 'lucide-react';

interface AnalyticsEvent {
  type: string;
  timestamp: string;
  targetId?: string;
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  isp?: string;
  browser?: string;
  os?: string;
  device?: string;
  screen?: string;
}

interface AnalyticsData {
  totalViews: number;
  totalResumeDownloads: number;
  totalContactClicks: number;
  projectClicks: Record<string, number>;
  recentEvents: AnalyticsEvent[];
}

interface AnalyticsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/analytics')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setData(json.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl p-5 bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#70d6ff] font-mono"
          >
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-4">
              <h3 className="text-sm font-extrabold uppercase text-black dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-500 stroke-[2.5]" />
                VISITOR INTELLIGENCE & LOCATION ANALYTICS
              </h3>
              <button
                onClick={onClose}
                className="p-1 border border-black dark:border-white hover:bg-red-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center font-mono text-xs uppercase animate-pulse">
                Fetching Real-time Visitor Telemetry...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-yellow-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
                    <Eye className="w-4 h-4 mb-1" />
                    <span className="text-xl font-extrabold block">{data?.totalViews || 0}</span>
                    <span className="text-[10px] font-bold uppercase block">Page Views</span>
                  </div>

                  <div className="p-3 bg-pink-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
                    <Download className="w-4 h-4 mb-1" />
                    <span className="text-xl font-extrabold block">{data?.totalResumeDownloads || 0}</span>
                    <span className="text-[10px] font-bold uppercase block">CV Downloads</span>
                  </div>

                  <div className="p-3 bg-emerald-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000]">
                    <Mail className="w-4 h-4 mb-1" />
                    <span className="text-xl font-extrabold block">{data?.totalContactClicks || 0}</span>
                    <span className="text-[10px] font-bold uppercase block">Email Clicks</span>
                  </div>
                </div>

                <div className="border-t-2 border-black dark:border-white pt-3">
                  <h4 className="text-xs font-bold uppercase text-black dark:text-white mb-2 flex items-center justify-between">
                    <span>Recent Visitor Log & Geo Intelligence</span>
                    <span className="text-[10px] bg-black text-yellow-300 px-2 py-0.5 font-bold">
                      {data?.recentEvents?.length || 0} EVENTS
                    </span>
                  </h4>

                  <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                    {data?.recentEvents && data.recentEvents.length > 0 ? (
                      data.recentEvents.map((evt, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-slate-700 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold uppercase px-1.5 py-0.5 bg-pink-300 text-black border border-black text-[10px]">
                              {evt.type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {new Date(evt.timestamp).toLocaleString()}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="flex items-center gap-1.5 truncate text-black dark:text-slate-200">
                              <Globe className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                              <span className="font-bold truncate">
                                {evt.city || 'Unknown'}, {evt.country || 'Global'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 truncate text-slate-600 dark:text-slate-400">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span className="truncate">IP: {evt.ip || '127.0.0.1'}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-1">
                            <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                              <Monitor className="w-3 h-3" />
                              {evt.device || 'Desktop'} • {evt.os || 'OS'} • {evt.browser || 'Browser'}
                            </span>
                            <span>{evt.screen || '1920x1080'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs italic">No visitor sessions logged yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
