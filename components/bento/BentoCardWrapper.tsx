'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, EyeOff, Settings2, X, Trash2, Wand2 } from 'lucide-react';
import { BentoCardConfig } from '@/types/portfolio';
import { CardResizeControls } from '@/components/inline/CardResizeControls';
import { ColorSwatchPicker } from '@/components/inline/ItemEdgeControls';

interface BentoCardWrapperProps {
  card: BentoCardConfig;
  isEditingActive?: boolean;
  onUpdateSpan?: (colSpan: number, rowSpan: number) => void;
  onUpdateColor?: (color: string) => void;
  onToggleVisible?: () => void;
  onDeleteCard?: () => void;
  onAutoFetchCard?: () => void;
  onDragHandlePointerDown?: (e: React.PointerEvent) => void;
  children: React.ReactNode;
}

export const BentoCardWrapper: React.FC<BentoCardWrapperProps> = ({
  card,
  isEditingActive = false,
  onUpdateSpan,
  onUpdateColor,
  onToggleVisible,
  onDeleteCard,
  onAutoFetchCard,
  onDragHandlePointerDown,
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!card.visible && !isEditingActive) {
    return null;
  }

  const supportsAutoFetch = ['featured_project', 'project_view', 'certification', 'custom_note'].includes(card.type);

  return (
    <div className="group/card relative w-full h-full min-h-55 max-h-162.5 overflow-visible">
      {/* Inner Scrollable Card Content */}
      <div className="w-full h-full overflow-y-auto no-scrollbar">
        {children}
      </div>

      {/* Bottom-Right Outer Tag Controls */}
      {isEditingActive && (
        <div
          className={`absolute -bottom-3 -right-3 z-50 transition-all duration-200 ${
            isMenuOpen ? 'opacity-100 z-50' : 'opacity-30 group-hover/card:opacity-100'
          }`}
        >
          {!isMenuOpen ? (
            <div className="flex items-center gap-1 bg-yellow-300 border-2 border-black p-0.5 shadow-[3px_3px_0px_0px_#000]">
              <div
                onPointerDown={onDragHandlePointerDown}
                title="Drag card position freely"
                className="p-1 text-black hover:bg-yellow-400 cursor-grab active:cursor-grabbing flex items-center justify-center select-none touch-none"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              {supportsAutoFetch && onAutoFetchCard && (
                <button
                  onClick={onAutoFetchCard}
                  title="⚡ Auto-Fetch metadata from link to populate this card"
                  className="p-1 bg-yellow-400 text-black border border-black hover:bg-yellow-500 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(true)}
                title="Open Settings (Resize, Color, Hide, Delete)"
                className="p-1 bg-white text-black border border-black hover:bg-slate-100 cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>

              {onDeleteCard && (
                <button
                  onClick={onDeleteCard}
                  title="Delete Card from Canvas"
                  className="p-1 bg-red-500 text-white border border-black hover:bg-red-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-yellow-300 dark:bg-slate-900 border-2 border-black dark:border-white p-1 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] flex items-center gap-1.5"
              >
                <div
                  onPointerDown={onDragHandlePointerDown}
                  title="Drag card position freely"
                  className="p-1 cursor-grab active:cursor-grabbing text-black dark:text-white flex items-center justify-center bg-white dark:bg-slate-800 border border-black dark:border-white select-none touch-none"
                >
                  <GripVertical className="w-3.5 h-3.5 text-pink-500" />
                </div>

                {onUpdateSpan && (
                  <CardResizeControls
                    colSpan={card.colSpan}
                    rowSpan={card.rowSpan}
                    cardType={card.type}
                    onUpdateSpan={onUpdateSpan}
                  />
                )}

                {onUpdateColor && (
                  <ColorSwatchPicker
                    currentColor={card.accentColor}
                    onChangeColor={onUpdateColor}
                  />
                )}

                {onToggleVisible && (
                  <button
                    onClick={onToggleVisible}
                    title={card.visible ? 'Hide Card' : 'Show Card'}
                    className="p-1 bg-white dark:bg-slate-800 border border-black dark:border-white hover:bg-slate-200 cursor-pointer text-black dark:text-white"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                )}

                {onDeleteCard && (
                  <button
                    onClick={onDeleteCard}
                    title="Delete Card Permanently"
                    className="p-1 bg-red-500 text-white border border-black hover:bg-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setIsMenuOpen(false)}
                  title="Close Settings"
                  className="p-1 bg-slate-200 dark:bg-slate-800 text-black dark:text-white border border-black hover:bg-slate-300 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
};
