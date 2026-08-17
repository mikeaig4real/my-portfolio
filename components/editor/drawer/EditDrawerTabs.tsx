'use client';

import React from 'react';
import { User, Briefcase, Rocket, LayoutGrid, Palette, Link, Wrench, Bot } from 'lucide-react';

export type DrawerTab = 'profile' | 'experience' | 'projects' | 'skills' | 'socials' | 'assistant' | 'layout' | 'colors';

interface EditDrawerTabsProps {
  activeTab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
}

export const EditDrawerTabs: React.FC<EditDrawerTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-3.5 h-3.5 stroke-[2.5]" /> },
    { id: 'experience', label: 'Work', icon: <Briefcase className="w-3.5 h-3.5 stroke-[2.5]" /> },
    { id: 'projects', label: 'Projects', icon: <Rocket className="w-3.5 h-3.5 stroke-[2.5]" /> },
    { id: 'skills', label: 'Skills', icon: <Wrench className="w-3.5 h-3.5 stroke-[2.5]" /> },
    { id: 'socials', label: 'Socials', icon: <Link className="w-3.5 h-3.5 stroke-[2.5]" /> },
    { id: 'assistant', label: 'AI Chat', icon: <Bot className="w-3.5 h-3.5 stroke-[2.5]" /> },
    { id: 'layout', label: 'Layout', icon: <LayoutGrid className="w-3.5 h-3.5 stroke-[2.5]" /> },
    { id: 'colors', label: 'Theme', icon: <Palette className="w-3.5 h-3.5 stroke-[2.5]" /> },
  ] as const;


  return (
    <div className="flex border-b-3 border-black dark:border-white bg-slate-100 dark:bg-slate-800 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as DrawerTab)}
          className={`flex-1 min-w-18.75 py-3 px-1.5 text-[11px] font-mono font-bold uppercase border-r-2 border-black dark:border-white flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            activeTab === tab.id
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'text-black dark:text-white hover:bg-yellow-200 dark:hover:bg-slate-700'
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
};
