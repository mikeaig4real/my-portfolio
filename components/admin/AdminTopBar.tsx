'use client';

import React, { useState } from 'react';
import {
  Save,
  ExternalLink,
  LogOut,
  BarChart2,
  Edit3,
  Sliders,
  Bookmark,
  Plus,
  Sparkles,
  Eye,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-slate-900 text-white border-b-4 border-black dark:border-white px-3 sm:px-4 py-2 font-mono shadow-[0px_4px_0px_0px_#000] dark:shadow-[0px_4px_0px_0px_#fff]">
      {/* Primary Top Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left Side: Status & Mode Indicators */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block shrink-0" />
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide truncate max-w-[180px] sm:max-w-none">
            {isPreviewMode ? '👁️ PREVIEW MODE' : '⚡ LIVE STUDIO'}
          </span>
          <span className="hidden lg:inline-block text-[10px] bg-black text-white px-2 py-0.5 font-bold border border-white/20">
            {autoSaveEnabled ? '⚡ AUTO-SAVE ACTIVE' : 'MANUAL SAVE MODE'}
          </span>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          <BrutalButton
            variant={isPreviewMode ? 'yellow' : 'cyan'}
            size="sm"
            onClick={onTogglePreviewMode}
            className="text-[11px] px-2 py-1"
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{isPreviewMode ? 'Studio' : 'Preview'}</span>
          </BrutalButton>

          <BrutalButton
            variant="yellow"
            size="sm"
            onClick={onSave}
            disabled={saving}
            className="text-[11px] px-2 py-1"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save'}</span>
          </BrutalButton>

          {/* Desktop Full Toolbar (hidden on mobile/tablet) */}
          <div className="hidden xl:flex items-center gap-2">
            <BrutalButton variant="pink" size="sm" onClick={onOpenAIOnboarding}>
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              AI Onboard
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

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-white border-2 border-black font-bold text-xs hover:bg-slate-100 flex items-center gap-1 text-black shadow-[2px_2px_0px_0px_#000]"
              title="Open Public Site"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public
            </a>

            <button
              onClick={onLogout}
              className="p-1.5 bg-red-500 text-white border-2 border-black hover:bg-red-600 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
              title="Exit Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile & Tablet Action Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1.5 bg-yellow-300 text-black border-2 border-black font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="hidden sm:inline">Tools</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Collapsible Mobile & Tablet Tools Dropdown Bar */}
      {isMobileMenuOpen && (
        <div className="xl:hidden mt-2 pt-2 border-t-2 border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => { onOpenAIOnboarding(); setIsMobileMenuOpen(false); }}
            className="px-2.5 py-1.5 bg-pink-400 text-black border-2 border-black font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Onboard
          </button>

          <button
            onClick={() => { onOpenAddCard(); setIsMobileMenuOpen(false); }}
            className="px-2.5 py-1.5 bg-yellow-300 text-black border-2 border-black font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <Plus className="w-3.5 h-3.5" /> Add Card
          </button>

          <button
            onClick={() => { onOpenAnalytics(); setIsMobileMenuOpen(false); }}
            className="px-2.5 py-1.5 bg-cyan-300 text-black border-2 border-black font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <BarChart2 className="w-3.5 h-3.5" /> Analytics
          </button>

          <button
            onClick={() => { onOpenCheckpoints(); setIsMobileMenuOpen(false); }}
            className="px-2.5 py-1.5 bg-emerald-300 text-black border-2 border-black font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <Bookmark className="w-3.5 h-3.5" /> Checkpoints
          </button>

          <button
            onClick={() => { onOpenSettings(); setIsMobileMenuOpen(false); }}
            className="px-2.5 py-1.5 bg-purple-300 text-black border-2 border-black font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <Sliders className="w-3.5 h-3.5" /> Design & Fonts
          </button>

          <button
            onClick={() => { onOpenDrawer(); setIsMobileMenuOpen(false); }}
            className="px-2.5 py-1.5 bg-orange-300 text-black border-2 border-black font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <Edit3 className="w-3.5 h-3.5" /> Drawer
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="px-2.5 py-1.5 bg-white text-black border-2 border-black font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Public Site
          </a>

          <button
            onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
            className="px-2.5 py-1.5 bg-red-500 text-white border-2 border-black font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000]"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
