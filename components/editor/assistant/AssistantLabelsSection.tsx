'use client';

import React from 'react';
import { ChatConfig } from '@/types/portfolio';

interface AssistantLabelsSectionProps {
  config: ChatConfig;
  onChangeConfig: (patch: Partial<ChatConfig>) => void;
}

export const AssistantLabelsSection: React.FC<AssistantLabelsSectionProps> = ({
  config,
  onChangeConfig,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
      {/* Header labels */}
      <div className="p-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-white space-y-2 shadow-[3px_3px_0px_0px_#000]">
        <h5 className="text-xs font-extrabold uppercase border-b border-black dark:border-white pb-1 text-black dark:text-white">
          Drawer Header Configuration
        </h5>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Header Title: <span className="text-pink-500 font-mono text-[9px]">(use {'{name}'} for dynamic name)</span>
          </label>
          <input
            type="text"
            value={config.headerTitle || ''}
            onChange={(e) => onChangeConfig({ headerTitle: e.target.value })}
            placeholder="{name}'s AI Twin"
            className="w-full p-1.5 text-xs border-2 border-black bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Status Subtitle (e.g. Online):
          </label>
          <input
            type="text"
            value={config.headerSubtitle || ''}
            onChange={(e) => onChangeConfig({ headerSubtitle: e.target.value })}
            placeholder="Online"
            className="w-full p-1.5 text-xs border-2 border-black bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Header Badge (e.g. RESUME AI):
          </label>
          <input
            type="text"
            value={config.headerBadge || ''}
            onChange={(e) => onChangeConfig({ headerBadge: e.target.value })}
            placeholder="RESUME AI"
            className="w-full p-1.5 text-xs border-2 border-black bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold"
          />
        </div>
      </div>

      {/* Button labels */}
      <div className="p-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-white space-y-2 shadow-[3px_3px_0px_0px_#000]">
        <h5 className="text-xs font-extrabold uppercase border-b border-black dark:border-white pb-1 text-black dark:text-white">
          Trigger Button Labels
        </h5>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Main Button Label:
          </label>
          <input
            type="text"
            value={config.triggerButtonText || ''}
            onChange={(e) => onChangeConfig({ triggerButtonText: e.target.value })}
            placeholder="AI Assistant"
            className="w-full p-1.5 text-xs border-2 border-black bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
            Button Subtitle:
          </label>
          <input
            type="text"
            value={config.triggerButtonSubtext || ''}
            onChange={(e) => onChangeConfig({ triggerButtonSubtext: e.target.value })}
            placeholder="Ask My Resume"
            className="w-full p-1.5 text-xs border-2 border-black bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold"
          />
        </div>
      </div>
    </div>
  );
};
