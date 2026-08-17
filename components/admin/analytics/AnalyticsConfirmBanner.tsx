'use client';

import React from 'react';

interface AnalyticsConfirmBannerProps {
  confirmAction: 'clear_events' | 'reset_all' | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AnalyticsConfirmBanner: React.FC<AnalyticsConfirmBannerProps> = ({
  confirmAction,
  onConfirm,
  onCancel,
}) => {
  if (!confirmAction) return null;

  return (
    <div className="mb-4 p-3 bg-red-100 dark:bg-red-950/80 border-2 border-red-500 text-black dark:text-white flex items-center justify-between gap-2 text-xs">
      <div>
        <span className="font-extrabold uppercase block">
          {confirmAction === 'clear_events'
            ? '⚠️ Confirm: Clear all recent event log entries?'
            : '⚠️ Confirm: Completely reset all analytics counters and history to 0?'}
        </span>
        <span className="text-[10px] text-slate-600 dark:text-slate-300">
          This action is permanent and cannot be undone.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onConfirm}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase border border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1 bg-white text-black font-bold text-xs uppercase border border-black cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
