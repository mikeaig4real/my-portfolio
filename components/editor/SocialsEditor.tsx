'use client';

import React from 'react';
import { SocialLink } from '@/types/portfolio';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { Plus, Trash2 } from 'lucide-react';

interface SocialsEditorProps {
  socials: SocialLink[];
  onChange: (updated: SocialLink[]) => void;
}

export const SocialsEditor: React.FC<SocialsEditorProps> = ({ socials, onChange }) => {
  const handleAdd = () => {
    const newSoc: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: 'GitHub',
      url: 'https://github.com',
      username: '@username',
    };
    onChange([...socials, newSoc]);
  };

  const handleRemove = (id: string) => {
    onChange(socials.filter((s) => s.id !== id));
  };

  const handleUpdate = (id: string, field: keyof SocialLink, value: string) => {
    onChange(socials.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white">
          🔗 Edit Social Links ({socials.length})
        </h3>
        <BrutalButton variant="purple" size="sm" onClick={handleAdd}>
          <Plus className="w-3.5 h-3.5" />
          Add Social
        </BrutalButton>
      </div>

      <div className="space-y-3 max-h-112.5 overflow-y-auto pr-1">
        {socials.map((soc, idx) => (
          <div
            key={soc.id}
            className="p-3 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 space-y-2 shadow-[3px_3px_0px_0px_#000]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase bg-purple-300 text-black px-2 py-0.5 border border-black">
                Link #{idx + 1}: {soc.platform}
              </span>
              <button
                onClick={() => handleRemove(soc.id)}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer font-bold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <BrutalInput
                label="Platform Name"
                value={soc.platform}
                onChange={(e) => handleUpdate(soc.id, 'platform', e.target.value)}
              />
              <BrutalInput
                label="Profile URL"
                value={soc.url}
                onChange={(e) => handleUpdate(soc.id, 'url', e.target.value)}
              />
              <BrutalInput
                label="Username Display"
                value={soc.username}
                onChange={(e) => handleUpdate(soc.id, 'username', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
