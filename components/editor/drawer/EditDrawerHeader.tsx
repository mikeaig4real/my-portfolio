'use client';

import React from 'react';
import { X } from 'lucide-react';

interface EditDrawerHeaderProps {
  onClose: () => void;
}

export const EditDrawerHeader: React.FC<EditDrawerHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 bg-[#facc15] border-b-3 border-black text-black flex items-center justify-between font-mono">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <h2 className="text-lg font-extrabold uppercase tracking-wide">
          Bento Studio // Live Customizer
        </h2>
      </div>

      <button
        onClick={onClose}
        className="p-1.5 bg-black text-white border border-black hover:bg-red-600 cursor-pointer transition-colors"
        aria-label="Close Customizer Drawer"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
