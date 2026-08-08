'use client';

import React from 'react';
import { Workplace } from '@/types/portfolio';
import { BrutalInput, BrutalTextarea } from '@/components/ui/BrutalInput';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { Plus, Trash2 } from 'lucide-react';

interface WorkplaceEditorProps {
  workplaces: Workplace[];
  onChange: (updated: Workplace[]) => void;
}

export const WorkplaceEditor: React.FC<WorkplaceEditorProps> = ({ workplaces, onChange }) => {
  const handleAdd = () => {
    const newWork: Workplace = {
      id: `work-${Date.now()}`,
      company: 'New Company',
      role: 'Software Engineer',
      period: '2025 — Present',
      location: 'Remote',
      description: 'Worked on building scalable web apps and backend services.',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      isCurrent: true,
      logoBg: '#facc15',
    };
    onChange([newWork, ...workplaces]);
  };

  const handleRemove = (id: string) => {
    onChange(workplaces.filter((w) => w.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Workplace, value: Workplace[keyof Workplace]) => {
    onChange(
      workplaces.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white">
          💼 Edit Work Experience ({workplaces.length})
        </h3>
        <BrutalButton variant="lime" size="sm" onClick={handleAdd}>
          <Plus className="w-3.5 h-3.5" />
          Add Role
        </BrutalButton>
      </div>

      <div className="space-y-4 max-h-112.5 overflow-y-auto pr-1">
        {workplaces.map((work, idx) => (
          <div
            key={work.id}
            className="p-3 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 space-y-3 relative shadow-[3px_3px_0px_0px_#000]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase bg-yellow-300 text-black px-2 py-0.5 border border-black">
                Role #{idx + 1}
              </span>
              <button
                onClick={() => handleRemove(work.id)}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer font-bold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <BrutalInput
                label="Company Name"
                value={work.company}
                onChange={(e) => handleUpdate(work.id, 'company', e.target.value)}
              />
              <BrutalInput
                label="Role Title"
                value={work.role}
                onChange={(e) => handleUpdate(work.id, 'role', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <BrutalInput
                label="Period (e.g. 2024 — Present)"
                value={work.period}
                onChange={(e) => handleUpdate(work.id, 'period', e.target.value)}
              />
              <BrutalInput
                label="Location"
                value={work.location}
                onChange={(e) => handleUpdate(work.id, 'location', e.target.value)}
              />
            </div>

            <BrutalTextarea
              label="Description / Key Impact"
              value={work.description}
              onChange={(e) => handleUpdate(work.id, 'description', e.target.value)}
              rows={2}
            />

            <BrutalInput
              label="Tech Stack (comma separated)"
              value={work.skills.join(', ')}
              onChange={(e) =>
                handleUpdate(
                  work.id,
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
