'use client';

import React from 'react';
import { SkillGroup } from '@/types/portfolio';
import { BrutalInput } from '@/components/ui/BrutalInput';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { Plus, Trash2 } from 'lucide-react';

interface SkillsEditorProps {
  skills: SkillGroup[];
  onChange: (updated: SkillGroup[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onChange }) => {
  const handleAddGroup = () => {
    const newGroup: SkillGroup = {
      id: `skill-${Date.now()}`,
      category: 'New Skill Category',
      skills: ['TypeScript', 'React', 'Node.js'],
      badgeColor: '#facc15',
    };
    onChange([...skills, newGroup]);
  };

  const handleRemoveGroup = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const handleUpdateGroup = (id: string, field: keyof SkillGroup, value: SkillGroup[keyof SkillGroup]) => {
    onChange(skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white">
          🛠️ Edit Skills & Tech Categories ({skills.length})
        </h3>
        <BrutalButton variant="yellow" size="sm" onClick={handleAddGroup}>
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </BrutalButton>
      </div>

      <div className="space-y-3 max-h-112.5 overflow-y-auto pr-1">
        {skills.map((group, idx) => (
          <div
            key={group.id}
            className="p-3 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 space-y-2 shadow-[3px_3px_0px_0px_#000]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase bg-yellow-300 text-black px-2 py-0.5 border border-black">
                Category #{idx + 1}: {group.category}
              </span>
              <button
                onClick={() => handleRemoveGroup(group.id)}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer font-bold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <BrutalInput
                label="Category Name"
                value={group.category}
                onChange={(e) => handleUpdateGroup(group.id, 'category', e.target.value)}
              />
              <BrutalInput
                label="Badge Color Hex (e.g. #facc15)"
                value={group.badgeColor}
                onChange={(e) => handleUpdateGroup(group.id, 'badgeColor', e.target.value)}
              />
            </div>

            <BrutalInput
              label="Skills List (comma separated)"
              value={group.skills.join(', ')}
              onChange={(e) =>
                handleUpdateGroup(
                  group.id,
                  'skills',
                  e.target.value.split(',').map((s) => s.trim())
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};
