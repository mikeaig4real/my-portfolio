'use client';

import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputFormProps {
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  inputValue,
  isLoading,
  onInputChange,
  onSend,
  inputRef,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-2.5 bg-white dark:bg-slate-900 border-t-3 border-black dark:border-white shrink-0 flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about my projects, stack, or experience..."
        disabled={isLoading}
        className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white text-xs outline-none text-black dark:text-white placeholder:text-slate-400 focus:bg-yellow-100 dark:focus:bg-slate-700"
      />
      <button
        onClick={onSend}
        disabled={!inputValue.trim() || isLoading}
        className="p-2 bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-transform active:translate-x-0.5 active:translate-y-0.5"
        title="Send Message"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
