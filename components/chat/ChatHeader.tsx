'use client';

import React from 'react';
import { Bot, Minimize2, X } from 'lucide-react';
import { ChatConfig } from '@/types/portfolio';

interface ChatHeaderProps {
  profile: {
    name?: string;
    avatar?: string;
  };
  config?: ChatConfig;
  onClose: () => void;
  onMinimize: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  profile,
  config,
  onClose,
  onMinimize,
}) => {
  const headerTitle = config?.headerTitle
    ? config.headerTitle.replace(/\{name\}/gi, profile.name || 'Michael')
    : `${profile.name || 'Michael'}'s AI Twin`;

  const headerSubtitle = config?.headerSubtitle || 'Online';
  const headerBadge = config?.headerBadge || 'RESUME AI';
  const headerBg = config?.accentColor || '#facc15';

  return (
    <div
      style={{ backgroundColor: headerBg }}
      className="p-3.5 border-b-3 border-black text-black flex items-center justify-between shrink-0"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 border-2 border-black bg-white overflow-hidden shrink-0">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt={profile.name || 'Profile'}
              className="w-full h-full object-cover"
            />
          ) : (
            <Bot className="w-full h-full p-1 text-black" />
          )}
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-black rounded-full" />
        </div>

        <div>
          <h4 className="text-xs font-extrabold uppercase leading-tight text-black flex items-center gap-1.5">
            {headerTitle}
            <span className="text-[8px] bg-black text-white px-1 py-0.2 font-mono">
              {headerBadge}
            </span>
          </h4>
          <span className="text-[10px] text-slate-900 font-bold block">
            {headerSubtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onMinimize}
          className="p-1 border-2 border-black hover:bg-black hover:text-white cursor-pointer transition-colors bg-white/40"
          title="Minimize"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClose}
          className="p-1 border-2 border-black hover:bg-red-500 hover:text-white cursor-pointer transition-colors bg-white/40"
          title="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

