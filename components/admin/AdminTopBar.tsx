'use client';

import React from 'react';
import { Save, ExternalLink, LogOut, BarChart2, Edit3, Sliders, Bookmark, Plus, Sparkles, Eye } from 'lucide-react';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface AdminTopBarProps {
  onSave: () => void;
  saving: boolean;
  savedSuccess: boolean;
  autoSaveEnabled: boolean;
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  onOpenDrawer: () => void;
  onOpenAnalytics: () => void;
  onOpenSettings: () => void;
  onOpenCheckpoints: () => void;
  onOpenAddCard: () => void;
  onOpenAIOnboarding: () => void;
  onLogout: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  onSave,
  saving,
  savedSuccess,
  autoSaveEnabled,
  isPreviewMode,
  onTogglePreviewMode,
  onOpenDrawer,
  onOpenAnalytics,
  onOpenSettings,
  onOpenCheckpoints,
  onOpenAddCard,
  onOpenAIOnboarding,
  onLogout,
}) => {
  return (
    <div className="sticky top-0 z-40 bg-slate-900 text-white border-b-4 border-black dark:border-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-[0px_4px_0px_0px_#000] dark:shadow-[0px_4px_0px_0px_#fff] font-mono">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-600 animate-ping inline-block" />
        <span className="text-xs font-extrabold uppercase">
          {isPreviewMode ? '👁️ VIEWER PREVIEW MODE' : '⚡ LIVE IN-PLACE STUDIO'}
        </span>
        <span className="hidden sm:inline-block text-[10px] bg-black text-white px-2 py-0.5 font-bold">
          {autoSaveEnabled ? '⚡ AUTO-SAVE ACTIVE' : 'MANUAL SAVE MODE'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <BrutalButton
          variant={isPreviewMode ? 'yellow' : 'cyan'}
          size="sm"
          onClick={onTogglePreviewMode}
        >
          {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {isPreviewMode ? 'Studio Mode' : 'Preview Mode'}
        </BrutalButton>
        <BrutalButton variant="pink" size="sm" onClick={onOpenAIOnboarding}>
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          AI Quickstart
        </BrutalButton>

        <BrutalButton variant="yellow" size="sm" onClick={onOpenAddCard}>
          <Plus className="w-3.5 h-3.5 stroke-3" />
          Add Card
        </BrutalButton>

        <BrutalButton variant="cyan" size="sm" onClick={onOpenAnalytics}>
          <BarChart2 className="w-3.5 h-3.5" />
          Analytics
        </BrutalButton>

        <BrutalButton variant="lime" size="sm" onClick={onOpenCheckpoints}>
          <Bookmark className="w-3.5 h-3.5" />
          Checkpoints
        </BrutalButton>

        <BrutalButton variant="pink" size="sm" onClick={onOpenSettings}>
          <Sliders className="w-3.5 h-3.5" />
          Design & Fonts
        </BrutalButton>

        <BrutalButton variant="yellow" size="sm" onClick={onOpenDrawer}>
          <Edit3 className="w-3.5 h-3.5" />
          Drawer
        </BrutalButton>

        <BrutalButton
          variant="yellow"
          size="sm"
          onClick={onSave}
          disabled={saving}
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : savedSuccess ? '✓ Saved!' : 'Save All'}
        </BrutalButton>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 bg-white border-2 border-black font-bold text-xs hover:bg-slate-100 flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000]"
          title="Open Public Site in New Tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Public Site
        </a>

        <button
          onClick={onLogout}
          className="p-1.5 bg-red-500 text-white border-2 border-black hover:bg-red-600 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
          title="Exit Admin Session"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
