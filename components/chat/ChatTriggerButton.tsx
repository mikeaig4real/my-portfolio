'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Bot, Sparkles } from 'lucide-react';
import { ChatConfig } from '@/types/portfolio';

interface ChatTriggerButtonProps {
  profile: {
    name?: string;
    avatar?: string;
  };
  config?: ChatConfig;
  hasPromptedVisitor: boolean;
  onOpen: () => void;
  onDismissPrompt: () => void;
}

export const ChatTriggerButton: React.FC<ChatTriggerButtonProps> = ({
  profile,
  config,
  hasPromptedVisitor,
  onOpen,
  onDismissPrompt,
}) => {
  const isBubbleEnabled = config?.bubbleVisible !== false;
  const bubbleText = config?.bubbleText || 'Questions about my experience? Chat with my AI twin!';
  const triggerText = config?.triggerButtonText || 'AI Assistant';
  const triggerSubtext = config?.triggerButtonSubtext || 'Ask My Resume';
  const accentColor = config?.accentColor || '#facc15';

  return (
    <div className="relative">
      {/* Teaser Bubble */}
      <AnimatePresence>
        {isBubbleEnabled && hasPromptedVisitor && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ backgroundColor: accentColor }}
            className="absolute bottom-18 right-0 w-64 p-3 border-3 border-black text-black shadow-[4px_4px_0px_0px_#000] text-xs font-bold leading-tight flex items-start gap-2"
          >
            <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{bubbleText}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismissPrompt();
              }}
              className="p-0.5 hover:bg-black hover:text-white border border-black cursor-pointer bg-white/40"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        style={{ backgroundColor: accentColor }}
        className="group relative flex items-center gap-2 p-2.5 border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] cursor-pointer hover:brightness-105 transition-all"
        title="Chat with AI Resume Assistant"
      >
        <div className="relative w-10 h-10 rounded-none border-2 border-black bg-white overflow-hidden shrink-0">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt={profile.name || 'Profile'}
              className="w-full h-full object-cover"
            />
          ) : (
            <Bot className="w-full h-full p-1.5 text-black" />
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full" />
        </div>

        <div className="hidden sm:flex flex-col text-left pr-2">
          <span className="text-[11px] font-extrabold uppercase text-black flex items-center gap-1">
            {triggerText}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
          </span>
          <span className="text-[9px] font-bold text-slate-800 uppercase">{triggerSubtext}</span>
        </div>

        <span className="sm:hidden p-1 bg-black text-yellow-300">
          <MessageSquare className="w-4 h-4" />
        </span>
      </motion.button>
    </div>
  );
};

