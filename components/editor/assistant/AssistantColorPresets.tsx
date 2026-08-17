'use client';

import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { ASSISTANT_COLOR_PRESETS } from './assistantConstants';

interface AssistantColorPresetsProps {
  currentColor: string;
  onSelectColor: (colorHex: string) => void;
}

export const AssistantColorPresets: React.FC<AssistantColorPresetsProps> = ({
  currentColor,
  onSelectColor,
}) => {
  return (
    <div className="space-y-2 font-mono">
      <label className="block text-xs font-extrabold uppercase items-center gap-1.5 text-black dark:text-white">
        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        Chatbot Accent Color Preset:
      </label>
      <div className="flex flex-wrap gap-2">
        {ASSISTANT_COLOR_PRESETS.map((color) => {
          const isSelected =
            (currentColor || '#facc15').toLowerCase() === color.hex.toLowerCase();
          return (
            <button
              key={color.hex}
              onClick={() => onSelectColor(color.hex)}
              style={{ backgroundColor: color.hex }}
              className={`px-3 py-1.5 border-2 border-black text-xs font-extrabold uppercase flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#000] text-black ${
                isSelected ? 'ring-2 ring-black scale-105' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-3" />}
              {color.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
