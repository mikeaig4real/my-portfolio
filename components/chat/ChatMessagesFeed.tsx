'use client';

import React from 'react';
import { User } from 'lucide-react';
import { ChatMessage } from './types';

interface ChatMessagesFeedProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessagesFeed: React.FC<ChatMessagesFeedProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 text-xs">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex items-start gap-2 ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {msg.role === 'assistant' && (
            <div className="w-6 h-6 border border-black bg-yellow-300 shrink-0 flex items-center justify-center text-[10px] font-extrabold text-black">
              AI
            </div>
          )}

          <div
            className={`max-w-[82%] p-2.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-cyan-300 text-black dark:bg-cyan-400'
                : 'bg-white dark:bg-slate-900 text-black dark:text-slate-100'
            }`}
          >
            {msg.content}
          </div>

          {msg.role === 'user' && (
            <div className="w-6 h-6 border border-black bg-cyan-300 shrink-0 flex items-center justify-center text-[10px] font-extrabold text-black">
              <User className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      ))}

      {/* Typing Animation */}
      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-black bg-yellow-300 shrink-0 flex items-center justify-center text-[10px] font-extrabold text-black">
            AI
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-900 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
            <span className="w-2 h-2 bg-pink-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-yellow-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
