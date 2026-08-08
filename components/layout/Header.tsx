'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  showEditButtons?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  const { data } = usePortfolioStore();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b-4 border-black dark:border-white shadow-[0px_4px_0px_0px_#000] dark:shadow-[0px_4px_0px_0px_#fff]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="w-9 h-9 bg-yellow-400 border-2 border-black flex items-center justify-center font-extrabold text-black font-mono shadow-[2px_2px_0px_0px_#000]"
          >
            {data.profile.statusEmoji || '⚡'}
          </motion.div>
          <div>
            <h1 className="text-base md:text-lg font-mono font-extrabold uppercase tracking-wider text-black dark:text-white">
              {data.profile.name.toUpperCase()}{' '}
              <span className="hidden sm:inline-block text-xs bg-yellow-300 dark:bg-yellow-400 text-black px-1.5 py-0.5 border border-black ml-1">
                PORTFOLIO
              </span>
            </h1>
            <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 uppercase">
              {data.profile.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
