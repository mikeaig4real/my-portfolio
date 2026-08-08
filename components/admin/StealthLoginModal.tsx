'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, X } from 'lucide-react';

interface StealthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StealthLoginModal: React.FC<StealthLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode }),
      });
      const json = await res.json();

      if (json.success) {
        onSuccess();
        onClose();
        setPasscode('');
      } else {
        setError(json.error || 'Invalid passcode');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_#facc15]"
          >
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-4">
              <h2 className="text-lg font-mono font-extrabold uppercase text-black dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-pink-500 stroke-[2.5]" />
                Admin Authentication
              </h2>
              <button
                onClick={onClose}
                className="p-1 border border-black dark:border-white hover:bg-red-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Enter Admin Passcode:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border-2 border-black dark:border-white font-mono text-sm outline-none text-black dark:text-white focus:bg-yellow-300 focus:text-black dark:focus:bg-yellow-300 dark:focus:text-black placeholder:text-slate-400"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2 bg-red-100 border border-red-500 text-red-700 text-xs font-mono font-bold">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-yellow-300 text-black border-2 border-black font-mono font-extrabold text-sm uppercase shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-400 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Unlock Studio'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
