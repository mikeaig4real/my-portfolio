'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Laptop } from 'lucide-react';
import { STORAGE_KEYS } from '@/lib/constants';

type ThemeMode = 'light' | 'dark' | 'system';

export const ThemeToggle = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const applyTheme = (mode: ThemeMode) => {
    let isDark = false;
    if (mode === 'dark') {
      isDark = true;
    } else if (mode === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const savedMode = (localStorage.getItem(STORAGE_KEYS.THEME_MODE) as ThemeMode) || 'system';
    setThemeMode(savedMode);
    applyTheme(savedMode);
  }, []);

  const handleCycleTheme = () => {
    let nextMode: ThemeMode = 'light';
    if (themeMode === 'light') nextMode = 'dark';
    else if (themeMode === 'dark') nextMode = 'system';
    else nextMode = 'light';

    setThemeMode(nextMode);
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, nextMode);
    applyTheme(nextMode);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08, rotate: 12 }}
      whileTap={{ scale: 0.92, rotate: -12 }}
      onClick={handleCycleTheme}
      className="p-2 bg-yellow-300 dark:bg-cyan-400 text-black border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] cursor-pointer font-mono font-bold text-xs flex items-center gap-1.5 transition-all"
      title={`Current Theme: ${themeMode.toUpperCase()}. Click to cycle (Light -> Dark -> System).`}
    >
      {themeMode === 'light' && <Sun className="w-4 h-4 stroke-[2.5]" />}
      {themeMode === 'dark' && <Moon className="w-4 h-4 stroke-[2.5]" />}
      {themeMode === 'system' && <Laptop className="w-4 h-4 stroke-[2.5]" />}
      <span className="uppercase text-[11px] font-extrabold hidden sm:inline">
        {themeMode}
      </span>
    </motion.button>
  );
};
