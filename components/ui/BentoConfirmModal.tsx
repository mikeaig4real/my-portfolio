'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';
import { BrutalButton } from './BrutalButton';

interface BentoConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onClose: () => void;
  onConfirm: () => void;
}

export const BentoConfirmModal: React.FC<BentoConfirmModalProps> = ({
  isOpen,
  title = '⚠️ CONFIRM ACTION',
  message = 'Are you sure you want to proceed with this action? This cannot be undone.',
  confirmText = 'Yes, Proceed',
  cancelText = 'Cancel',
  variant = 'danger',
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const headerBg =
    variant === 'danger'
      ? 'bg-red-400 text-black'
      : variant === 'warning'
      ? 'bg-yellow-300 text-black'
      : 'bg-cyan-300 text-black';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#000] dark:shadow-[10px_10px_0px_0px_#fff] p-5 space-y-4"
        >
          <div className={`p-3 border-2 border-black font-mono flex items-center justify-between shadow-[3px_3px_0px_0px_#000] ${headerBg}`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 stroke-[2.5] shrink-0" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-black text-white hover:bg-slate-800 cursor-pointer border border-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {message}
          </p>

          <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-black/20 dark:border-white/20">
            <BrutalButton variant="white" size="sm" onClick={onClose}>
              <X className="w-3.5 h-3.5" />
              <span>{cancelText}</span>
            </BrutalButton>

            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-3 py-1.5 font-mono font-extrabold text-xs uppercase border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#000] cursor-pointer ${
                variant === 'danger'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-yellow-300 hover:bg-yellow-400 text-black'
              }`}
            >
              <span>{confirmText}</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
