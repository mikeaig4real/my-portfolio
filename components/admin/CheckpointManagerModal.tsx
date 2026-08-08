'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, RotateCcw, Trash2, Plus, X } from 'lucide-react';
import { usePortfolioStore } from '@/store/usePortfolioStore';

interface CheckpointManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckpointManagerModal: React.FC<CheckpointManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { checkpoints, createCheckpoint, restoreCheckpoint, deleteCheckpoint } =
    usePortfolioStore();
  const [ckptName, setCkptName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCheckpoint(ckptName || `Snapshot ${new Date().toLocaleTimeString()}`);
    setCkptName('');
  };

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-5 bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#a7f3d0]"
          >
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-4">
              <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                Editing Checkpoints & History
              </h3>
              <button
                onClick={onClose}
                className="p-1 border border-black dark:border-white hover:bg-red-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex items-center gap-2 mb-4 font-mono">
              <input
                type="text"
                value={ckptName}
                onChange={(e) => setCkptName(e.target.value)}
                placeholder="Checkpoint label (e.g. Before Color Revamp)..."
                className="flex-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white text-xs outline-none text-black dark:text-white focus:bg-yellow-300 focus:text-black dark:focus:bg-yellow-300 dark:focus:text-black placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-300 text-black border-2 border-black font-extrabold text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-emerald-400 cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Save Checkpoint
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto font-mono">
              {checkpoints && checkpoints.length > 0 ? (
                checkpoints.map((ckpt) => (
                  <div
                    key={ckpt.id}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-black dark:border-white flex items-center justify-between shadow-[2px_2px_0px_0px_#000]"
                  >
                    <div>
                      <span className="text-xs font-bold text-black dark:text-white block">
                        {ckpt.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {new Date(ckpt.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          restoreCheckpoint(ckpt.id);
                          onClose();
                        }}
                        className="px-2 py-1 bg-yellow-300 text-black border border-black font-bold text-xs hover:bg-yellow-400 cursor-pointer flex items-center gap-1 shadow-[1px_1px_0px_0px_#000]"
                        title="Restore this checkpoint"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>

                      <button
                        onClick={() => deleteCheckpoint(ckpt.id)}
                        className="p-1 bg-red-500 text-white border border-black hover:bg-red-600 cursor-pointer"
                        title="Delete checkpoint"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs italic text-center py-4">
                  No editing checkpoints saved yet. Create one above to preserve your progress!
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
