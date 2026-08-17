'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

interface AssistantBubbleSectionProps {
  bubbleVisible: boolean;
  bubbleText: string;
  onToggleBubble: (visible: boolean) => void;
  onChangeBubbleText: (text: string) => void;
}

export const AssistantBubbleSection: React.FC<AssistantBubbleSectionProps> = ({
  bubbleVisible,
  bubbleText,
  onToggleBubble,
  onChangeBubbleText,
}) => {
  return (
    <div className="p-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-white space-y-3 shadow-[3px_3px_0px_0px_#000] font-mono">
      <div className="flex items-center justify-between border-b border-black dark:border-white pb-2">
        <label className="text-xs font-extrabold uppercase flex items-center gap-1.5 text-black dark:text-white">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />
          Floating Teaser Bubble (Above Trigger Button):
        </label>
        <button
          onClick={() => onToggleBubble(!bubbleVisible)}
          className={`px-2.5 py-0.5 text-[10px] font-extrabold border border-black uppercase cursor-pointer ${
            bubbleVisible
              ? 'bg-yellow-300 text-black'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          {bubbleVisible ? 'VISIBLE' : 'HIDDEN'}
        </button>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
          Teaser Bubble Message:
        </label>
        <input
          type="text"
          value={bubbleText}
          onChange={(e) => onChangeBubbleText(e.target.value)}
          placeholder="Questions about my experience? Chat with my AI twin!"
          className="w-full p-2 text-xs border-2 border-black bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold"
        />
      </div>
    </div>
  );
};
