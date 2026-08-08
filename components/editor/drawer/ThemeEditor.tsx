'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { COLOR_SCHEMES } from '@/lib/colorPalettes';

interface ThemeEditorProps {
  currentScheme?: string;
  onApplyScheme: (schemeId: string) => void;
  onRandomize: () => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  currentScheme,
  onApplyScheme,
  onRandomize,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white">
          🎨 Color Schemes & Randomizer
        </h3>

        <BrutalButton variant="pink" size="sm" onClick={onRandomize}>
          <Dices className="w-3.5 h-3.5" />
          Randomize Palette
        </BrutalButton>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
        Choose a preset Neobrutalist color palette or click <strong>Randomize</strong> to generate fresh card accent colors!
      </p>

      <div className="space-y-3">
        {COLOR_SCHEMES.map((scheme) => (
          <motion.button
            key={scheme.id}
            whileHover={{ x: 3 }}
            onClick={() => onApplyScheme(scheme.id)}
            className={`w-full p-3 border-2 border-black dark:border-white text-left shadow-[3px_3px_0px_0px_#000] cursor-pointer transition-all flex items-center justify-between ${
              currentScheme === scheme.id
                ? 'bg-yellow-200 dark:bg-slate-800 border-l-8 border-l-black'
                : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs font-mono font-bold uppercase text-black dark:text-white">
              {scheme.name}
            </span>

            <div className="flex items-center gap-1">
              {scheme.colors.map((c, idx) => (
                <span
                  key={idx}
                  className="w-4 h-4 rounded-full border border-black inline-block"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
