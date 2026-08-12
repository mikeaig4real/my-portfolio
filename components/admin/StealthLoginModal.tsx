'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the password input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay so the animation doesn't interfere with keyboard on iOS
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    } else {
      setPasscode('');
      setError('');
    }
  }, [isOpen]);

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Modal — centered on desktop, bottom sheet on very small screens */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="
              fixed z-50
              bottom-0 left-0 right-0
              sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2
              sm:-translate-x-1/2 sm:-translate-y-1/2
              w-full sm:max-w-md
              p-6
              bg-white dark:bg-slate-900
              border-t-4 sm:border-4 border-black dark:border-white
              shadow-[0px_-6px_0px_0px_#facc15] sm:shadow-[10px_10px_0px_0px_#facc15]
              pb-[calc(1.5rem+env(safe-area-inset-bottom))]
              sm:pb-6
            "
          >
            {/* Drag handle on very small screens */}
            <div className="sm:hidden flex justify-center -mt-2 mb-4">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 mb-4">
              <h2 className="text-lg font-mono font-extrabold uppercase text-black dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-pink-500 stroke-[2.5]" />
                Admin Auth
              </h2>
              <button
                onClick={onClose}
                className="p-2 border border-black dark:border-white hover:bg-red-500 hover:text-white cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter Admin Passcode:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="password"
                    // Tells iOS/Android to show a secure keyboard without autocorrect
                    inputMode="text"
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••••••"
                    className="
                      w-full pl-9 pr-3 py-3
                      bg-slate-100 dark:bg-slate-800
                      border-2 border-black dark:border-white
                      font-mono text-base
                      outline-none
                      text-black dark:text-white
                      focus:bg-yellow-300 focus:text-black dark:focus:bg-yellow-300 dark:focus:text-black
                      placeholder:text-slate-400
                      /* Larger tap target on mobile */
                      min-h-12
                    "
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
                className="
                  w-full py-3
                  bg-yellow-300 text-black
                  border-2 border-black
                  font-mono font-extrabold text-sm uppercase
                  shadow-[3px_3px_0px_0px_#000]
                  hover:bg-yellow-400
                  active:shadow-none active:translate-x-0.75 active:translate-y-0.75
                  cursor-pointer disabled:opacity-50
                  min-h-12
                  transition-all
                "
              >
                {loading ? 'Authenticating...' : '🔓 Unlock Studio'}
              </button>

              <p className="text-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
                On desktop: Ctrl + Alt + Shift + A to open this prompt
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
