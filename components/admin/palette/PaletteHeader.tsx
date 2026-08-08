'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';

interface PaletteHeaderProps {
  onClose: () => void;
}

export const PaletteHeader: React.FC<PaletteHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between border-b-4 border-black dark:border-white pb-4 mb-4 font-mono">
      <div className="flex items-center gap-2">
        <Plus className="w-6 h-6 text-yellow-500 stroke-3" />
        <h2 className="text-xl font-extrabold text-black dark:text-white uppercase tracking-wider">
          ADD BENTO CARD PALETTE
        </h2>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 bg-red-500 text-white border-2 border-black hover:bg-red-600 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
        title="Close Palette Modal"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
