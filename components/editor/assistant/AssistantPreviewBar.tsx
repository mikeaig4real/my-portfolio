'use client';

import React from 'react';
import { Bot, Eye } from 'lucide-react';
import { ChatConfig } from '@/types/portfolio';

interface AssistantPreviewBarProps {
  config: ChatConfig;
  profileName: string;
}

export const AssistantPreviewBar: React.FC<AssistantPreviewBarProps> = ({
  config,
  profileName,
}) => {
  const displayTitle = (config.headerTitle || "{name}'s AI Twin").replace(
    /\{name\}/gi,
    profileName || 'Michael'
  );

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-900 border-2 border-black dark:border-white space-y-2 font-mono">
      <span className="text-[10px] font-extrabold uppercase text-slate-500 flex items-center gap-1">
        <Eye className="w-3 h-3" /> Live Header & Button Theme Preview
      </span>
      <div className="flex flex-wrap items-center gap-4">
        {/* Header Preview */}
        <div
          style={{ backgroundColor: config.accentColor || '#facc15' }}
          className="p-2 border-2 border-black text-black flex items-center gap-2 max-w-xs flex-1 shadow-[2px_2px_0px_0px_#000]"
        >
          <Bot className="w-4 h-4 text-black shrink-0" />
          <div className="truncate">
            <span className="text-xs font-extrabold uppercase block truncate">
              {displayTitle}
            </span>
            <span className="text-[9px] font-bold text-slate-900 block">
              {config.headerSubtitle || 'Online'}
            </span>
          </div>
          <span className="text-[8px] bg-black text-white px-1 font-mono ml-auto">
            {config.headerBadge || 'RESUME AI'}
          </span>
        </div>

        {/* Trigger Button Preview */}
        <div
          style={{ backgroundColor: config.accentColor || '#facc15' }}
          className="p-2 border-2 border-black text-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]"
        >
          <Bot className="w-4 h-4 text-black" />
          <div className="text-left">
            <span className="text-[10px] font-extrabold uppercase block">
              {config.triggerButtonText || 'AI Assistant'}
            </span>
            <span className="text-[8px] font-bold text-slate-800 uppercase block">
              {config.triggerButtonSubtext || 'Ask My Resume'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
