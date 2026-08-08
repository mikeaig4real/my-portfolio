'use client';

import React from 'react';
import { RotateCcw, Save, Check } from 'lucide-react';
import { BrutalButton } from '@/components/ui/BrutalButton';

interface EditDrawerFooterProps {
  saving: boolean;
  savedSuccess: boolean;
  onResetDefaults: () => void;
  onSave: () => void;
}

export const EditDrawerFooter: React.FC<EditDrawerFooterProps> = ({
  saving,
  savedSuccess,
  onResetDefaults,
  onSave,
}) => {
  return (
    <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t-3 border-black dark:border-white flex items-center justify-between gap-3">
      <button
        onClick={onResetDefaults}
        className="px-3 py-2 text-xs font-mono font-bold uppercase bg-rose-200 text-black border-2 border-black hover:bg-rose-300 shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
      </button>

      <BrutalButton
        variant={savedSuccess ? 'lime' : 'yellow'}
        size="md"
        onClick={onSave}
        disabled={saving}
      >
        {savedSuccess ? (
          <>
            <Check className="w-4 h-4 stroke-3" /> Saved to MongoDB!
          </>
        ) : (
          <>
            <Save className="w-4 h-4 stroke-[2.5]" />
            {saving ? 'Saving...' : 'Save & Publish'}
          </>
        )}
      </BrutalButton>
    </div>
  );
};
