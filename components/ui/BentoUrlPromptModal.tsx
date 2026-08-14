'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, X, ArrowRight } from 'lucide-react';
import { BrutalInput } from './BrutalInput';
import { BrutalButton } from './BrutalButton';

interface BentoUrlPromptModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

export const BentoUrlPromptModal: React.FC<BentoUrlPromptModalProps> = ({
  isOpen,
  title = '⚡ Auto-Fetch Metadata from Link',
  subtitle = 'Enter a Live Demo, GitHub Repo, or Credential URL to automatically parse titles, descriptions, and cover images.',
  placeholder = 'https://github.com/username/project',
  onClose,
  onSubmit,
}) => {
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || url.trim() === '') return;
    onSubmit(url.trim());
    setUrl('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_#fff] p-5"
        >
          <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-yellow-400 stroke-[2.5]" />
              <h3 className="text-sm font-extrabold text-black dark:text-white uppercase tracking-wider">
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 bg-red-500 text-white border-2 border-black hover:bg-red-600 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-4 leading-relaxed">
            {subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <BrutalInput
                label="Target Link URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={placeholder}
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/20 dark:border-white/20">
              <BrutalButton type="button" variant="white" size="sm" onClick={onClose}>
                Cancel
              </BrutalButton>
              <BrutalButton type="submit" variant="yellow" size="sm" disabled={!url.trim()}>
                <span>Auto-Fetch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </BrutalButton>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
