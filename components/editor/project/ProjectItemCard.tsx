'use client';

import React from 'react';
import { Project, ProjectViewType } from '@/types/portfolio';
import { BrutalInput, BrutalTextarea, BrutalSelect } from '@/components/ui/BrutalInput';
import { Trash2, Wand2, Loader2, LayoutGrid, Check } from 'lucide-react';
import { VIEW_TYPE_OPTIONS } from './projectEditorConstants';

interface ProjectItemCardProps {
  proj: Project;
  idx: number;
  isOnCanvas: boolean;
  isFetching: boolean;
  onUpdate: (id: string, field: keyof Project, value: Project[keyof Project]) => void;
  onRemove: (id: string) => void;
  onAddToGrid: (proj: Project) => void;
  onAutoFetch: (proj: Project) => void;
}

export const ProjectItemCard: React.FC<ProjectItemCardProps> = ({
  proj,
  idx,
  isOnCanvas,
  isFetching,
  onUpdate,
  onRemove,
  onAddToGrid,
  onAutoFetch,
}) => {
  return (
    <div className="p-3.5 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 space-y-3 shadow-[3px_3px_0px_0px_#000]">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase bg-pink-300 text-black px-2 py-0.5 border border-black">
            Project #{idx + 1}: {proj.title}
          </span>
          {isOnCanvas && (
            <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 border border-emerald-700 flex items-center gap-0.5">
              <Check className="w-3 h-3" /> On Grid
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onAddToGrid(proj)}
            className="px-2 py-0.5 bg-cyan-300 hover:bg-cyan-400 text-black border border-black font-mono font-bold text-xs flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
            title="Add this project as a card on the Bento Grid canvas"
          >
            <LayoutGrid className="w-3 h-3" />
            <span>+ Add to Grid</span>
          </button>

          <button
            type="button"
            onClick={() => onAutoFetch(proj)}
            disabled={isFetching}
            className="px-2 py-0.5 bg-yellow-300 hover:bg-yellow-400 text-black border border-black font-mono font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-[1px_1px_0px_0px_#000]"
            title="Auto-populate title, description, and cover image from link metadata"
          >
            {isFetching ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Wand2 className="w-3 h-3" />
            )}
            <span>Auto-Fetch</span>
          </button>

          <button
            onClick={() => onRemove(proj.id)}
            className="text-red-500 hover:text-red-700 p-1 cursor-pointer font-bold text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* View Type Selector */}
      <div className="bg-yellow-100 dark:bg-slate-900 p-2.5 border-2 border-black">
        <BrutalSelect
          label="Card View Type Style"
          options={VIEW_TYPE_OPTIONS}
          value={proj.viewType}
          onChange={(e) =>
            onUpdate(proj.id, 'viewType', e.target.value as ProjectViewType)
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <BrutalInput
          label="Project Title"
          value={proj.title}
          onChange={(e) => onUpdate(proj.id, 'title', e.target.value)}
        />
        <BrutalInput
          label="Category"
          value={proj.category}
          onChange={(e) => onUpdate(proj.id, 'category', e.target.value)}
        />
      </div>

      <BrutalInput
        label="Tagline"
        value={proj.tagline}
        onChange={(e) => onUpdate(proj.id, 'tagline', e.target.value)}
      />

      <BrutalTextarea
        label="Description"
        value={proj.description}
        onChange={(e) => onUpdate(proj.id, 'description', e.target.value)}
        rows={2}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <BrutalInput
          label="Live Demo Link"
          value={proj.demoUrl || ''}
          onChange={(e) => onUpdate(proj.id, 'demoUrl', e.target.value)}
        />
        <BrutalInput
          label="GitHub Repo Link"
          value={proj.githubUrl || ''}
          onChange={(e) => onUpdate(proj.id, 'githubUrl', e.target.value)}
        />
      </div>

      <BrutalInput
        label="Cover Image URL"
        value={proj.coverImage}
        onChange={(e) => onUpdate(proj.id, 'coverImage', e.target.value)}
      />

      <BrutalInput
        label="Tags (comma separated)"
        value={proj.tags.join(', ')}
        onChange={(e) =>
          onUpdate(
            proj.id,
            'tags',
            e.target.value.split(',').map((t) => t.trim())
          )
        }
      />

      {proj.viewType === 'metric' && (
        <div className="grid grid-cols-2 gap-2 bg-emerald-100 dark:bg-slate-900 p-2 border border-black">
          <BrutalInput
            label="Metric Label"
            value={proj.metric?.label || ''}
            onChange={(e) =>
              onUpdate(proj.id, 'metric', {
                label: e.target.value,
                value: proj.metric?.value || '',
              })
            }
          />
          <BrutalInput
            label="Metric Value (e.g. 100k+)"
            value={proj.metric?.value || ''}
            onChange={(e) =>
              onUpdate(proj.id, 'metric', {
                label: proj.metric?.label || '',
                value: e.target.value,
              })
            }
          />
        </div>
      )}

      {proj.viewType === 'code' && (
        <BrutalTextarea
          label="Code Snippet"
          value={proj.codeSnippet?.code || ''}
          onChange={(e) =>
            onUpdate(proj.id, 'codeSnippet', {
              language: 'typescript',
              code: e.target.value,
            })
          }
          rows={3}
        />
      )}
    </div>
  );
};
