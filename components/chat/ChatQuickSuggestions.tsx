'use client';

import React from 'react';

interface ChatQuickSuggestionsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const ChatQuickSuggestions: React.FC<ChatQuickSuggestionsProps> = ({
  prompts,
  onSelectPrompt,
}) => {
  return (
    <div className="p-2 bg-slate-100 dark:bg-slate-900 border-t-2 border-black dark:border-slate-800 shrink-0 overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(prompt)}
          className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-slate-800 text-black dark:text-slate-200 border border-black hover:bg-yellow-200 dark:hover:bg-yellow-900 cursor-pointer shrink-0 shadow-[1px_1px_0px_0px_#000]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
