'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Edit2, X, Check } from 'lucide-react';
import { BrutalButton } from '@/components/ui/BrutalButton';

interface InlineLinkPopoverProps {
  label: string;
  url: string;
  variant?: 'yellow' | 'cyan' | 'pink' | 'lime' | 'purple' | 'white' | 'orange' | 'dark';
  icon?: React.ReactNode;
  isEditingActive?: boolean;
  onUpdateLink: (label: string, url: string) => void;
}

export const InlineLinkPopover: React.FC<InlineLinkPopoverProps> = ({
  label,
  url,
  variant = 'yellow',
  icon,
  isEditingActive = false,
  onUpdateLink,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLabel, setTempLabel] = useState(label);
  const [tempUrl, setTempUrl] = useState(url);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTempLabel(label);
    setTempUrl(url);
  }, [label, url]);

  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position above or below depending on space
      const popoverHeight = 180;
      const topPos = rect.top - popoverHeight < 10 ? rect.bottom + 8 : rect.top - popoverHeight - 8;
      const leftPos = Math.min(Math.max(10, rect.left), window.innerWidth - 300);
      setCoords({ top: topPos, left: leftPos });
    }
    setIsOpen(!isOpen);
  };

  const handleSave = () => {
    onUpdateLink(tempLabel, tempUrl);
    setIsOpen(false);
  };

  if (!isEditingActive) {
    if (!url) return null;
    return (
      <BrutalButton variant={variant} size="sm" href={url} target="_blank" rel="noopener noreferrer">
        {icon || <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />}
        {label}
      </BrutalButton>
    );
  }

  return (
    <div ref={buttonRef} className="relative inline-block">
      <BrutalButton
        variant={variant}
        size="sm"
        onClick={toggleOpen}
        className="cursor-pointer"
      >
        {icon || <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />}
        <Edit2 className="w-3 h-3 ml-1 text-slate-700 dark:text-slate-200" />
      </BrutalButton>

      {mounted && isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 999999,
            }}
            className="w-72 p-3 bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#facc15] font-mono text-xs text-black dark:text-white"
          >
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-1.5 mb-2.5">
              <span className="font-extrabold uppercase text-[11px] flex items-center gap-1">
                ⚡ Configure Link
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-0.5 border border-black dark:border-white hover:bg-red-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-extrabold uppercase mb-0.5">
                  Button Label:
                </label>
                <input
                  type="text"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                  className="w-full text-xs font-mono font-bold p-1 bg-slate-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-white"
                  placeholder="e.g. Live Demo"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase mb-0.5">
                  Destination URL:
                </label>
                <input
                  type="url"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  className="w-full text-xs font-mono p-1 bg-slate-100 dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-white"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                {tempUrl ? (
                  <a
                    href={tempUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Test Link ↗
                  </a>
                ) : (
                  <span />
                )}

                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-yellow-300 hover:bg-yellow-400 text-black font-extrabold border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
