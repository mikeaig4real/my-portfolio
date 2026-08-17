'use client';

import React from 'react';

interface AssistantIntroMessageSectionProps {
  introMessage: string;
  onChangeIntroMessage: (message: string) => void;
}

export const AssistantIntroMessageSection: React.FC<AssistantIntroMessageSectionProps> = ({
  introMessage,
  onChangeIntroMessage,
}) => {
  return (
    <div className="p-3 bg-white dark:bg-slate-900 border-2 border-black dark:border-white space-y-2 shadow-[3px_3px_0px_0px_#000] font-mono">
      <div className="flex items-center justify-between border-b border-black dark:border-white pb-1">
        <label className="text-xs font-extrabold uppercase text-black dark:text-white">
          Initial Welcome Intro Message (First-Person Persona):
        </label>
        <span className="text-[9px] text-slate-400 font-mono">
          {introMessage?.length || 0} characters
        </span>
      </div>

      <textarea
        rows={3}
        value={introMessage || ''}
        onChange={(e) => onChangeIntroMessage(e.target.value)}
        placeholder="Hey there! 👋 I'm {name}'s AI Assistant, trained directly on my live resume & project portfolio.\n\nAsk me anything about my experience, frameworks, architectural choices, or availability! What brings you by today? 🚀"
        className="w-full p-2 text-xs border-2 border-black bg-slate-50 dark:bg-slate-800 text-black dark:text-white font-bold leading-relaxed resize-y"
      />
      <p className="text-[9px] text-slate-500 dark:text-slate-400">
        💡 Tip: Use <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5">{'{name}'}</code> to automatically insert your profile name. No asterisks are needed.
      </p>
    </div>
  );
};
