'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, X, Check, Type, Bookmark, Zap } from 'lucide-react';
import { COLOR_SCHEMES } from '@/lib/colorPalettes';
import { FONT_PRESETS } from '@/lib/constants';

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentScheme?: string;
  currentFont?: string;
  autoSaveEnabled?: boolean;
  onSelectScheme: (schemeId: string) => void;
  onSelectFont: (fontId: string) => void;
  onToggleAutoSave: (enabled: boolean) => void;
  onOpenCheckpoints: () => void;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  isOpen,
  onClose,
  currentScheme = 'cyber_yellow',
  currentFont = 'font-mono',
  autoSaveEnabled = false,
  onSelectScheme,
  onSelectFont,
  onToggleAutoSave,
  onOpenCheckpoints,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-5 bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#ff70a6]"
          >
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-4">
              <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-pink-500 stroke-[2.5]" />
                Centralized Design & Customization Engine
              </h3>
              <button
                onClick={onClose}
                className="p-1 border border-black dark:border-white hover:bg-red-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 font-mono">
              <div className="flex items-center justify-between p-2.5 bg-yellow-100 dark:bg-slate-800 border-2 border-black">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold uppercase text-black dark:text-white">
                    Auto-Save Canvas Edits:
                  </span>
                </div>
                <button
                  onClick={() => onToggleAutoSave(!autoSaveEnabled)}
                  className={`px-3 py-1 text-xs font-extrabold border border-black uppercase cursor-pointer ${
                    autoSaveEnabled
                      ? 'bg-emerald-300 text-black shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {autoSaveEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCheckpoints();
                  }}
                  className="w-full py-2 bg-emerald-300 text-black border-2 border-black font-extrabold text-xs uppercase shadow-[3px_3px_0px_0px_#000] hover:bg-emerald-400 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bookmark className="w-4 h-4 stroke-[2.5]" /> Manage Editing Checkpoints & History
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black dark:text-white mb-2 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-cyan-500" /> Typography / Font Family:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_PRESETS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => onSelectFont(font.id)}
                      className={`p-2 border-2 border-black text-xs text-left cursor-pointer transition-all ${
                        currentFont === font.id
                          ? 'bg-cyan-300 text-black font-bold shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white hover:bg-cyan-100 hover:text-black'
                      }`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-black dark:text-white mb-2">
                  Color Scheme Preset (Primary, Secondary, Accent Tokens):
                </label>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {COLOR_SCHEMES.map((scheme) => (
                    <button
                      key={scheme.id}
                      onClick={() => onSelectScheme(scheme.id)}
                      className={`w-full p-2 border-2 border-black dark:border-white flex items-center justify-between transition-all cursor-pointer ${
                        currentScheme === scheme.id
                          ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-slate-100 dark:bg-slate-800 text-black dark:text-white hover:bg-yellow-100 hover:text-black dark:hover:text-black'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{scheme.name}</span>
                        {currentScheme === scheme.id && <Check className="w-4 h-4 text-black" />}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold uppercase px-1 bg-black text-white border border-white">
                          P
                        </span>
                        <span
                          className="w-3.5 h-3.5 border border-black inline-block shadow-[1px_1px_0px_0px_#000]"
                          style={{ backgroundColor: scheme.primary }}
                          title={`Primary: ${scheme.primary}`}
                        />
                        <span
                          className="w-3.5 h-3.5 border border-black inline-block shadow-[1px_1px_0px_0px_#000]"
                          style={{ backgroundColor: scheme.secondary }}
                          title={`Secondary: ${scheme.secondary}`}
                        />
                        <span
                          className="w-3.5 h-3.5 border border-black inline-block shadow-[1px_1px_0px_0px_#000]"
                          style={{ backgroundColor: scheme.accent }}
                          title={`Accent: ${scheme.accent}`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
