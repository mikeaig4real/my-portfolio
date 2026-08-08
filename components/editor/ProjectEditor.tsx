'use client';

import React from 'react';
import { Project, ProjectViewType } from '@/types/portfolio';
import { BrutalInput, BrutalTextarea, BrutalSelect } from '@/components/ui/BrutalInput';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { Plus, Trash2 } from 'lucide-react';

interface ProjectEditorProps {
  projects: Project[];
  onChange: (updated: Project[]) => void;
}

const VIEW_TYPE_OPTIONS = [
  { label: '🌟 Featured Wide View', value: 'featured' },
  { label: '🖼️ Image Gallery View', value: 'gallery' },
  { label: '📊 Big Metric / Stat View', value: 'metric' },
  { label: '💻 Code Snippet View', value: 'code' },
  { label: '⚡ Compact View', value: 'compact' },
];

export const ProjectEditor: React.FC<ProjectEditorProps> = ({ projects, onChange }) => {
  const handleAdd = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'New Project',
      tagline: 'Awesome new application',
      description: 'Built with modern full-stack web technologies.',
      category: 'Web App',
      tags: ['React', 'Next.js', 'Tailwind'],
      viewType: 'featured',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      galleryImages: [],
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      featured: true,
      accentColor: '#facc15',
    };
    onChange([newProj, ...projects]);
  };

  const handleRemove = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Project, value: Project[keyof Project]) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2">
        <h3 className="text-sm font-mono font-extrabold uppercase text-black dark:text-white">
          🚀 Edit Projects & Card View Types ({projects.length})
        </h3>
        <BrutalButton variant="cyan" size="sm" onClick={handleAdd}>
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </BrutalButton>
      </div>

      <div className="space-y-4 max-h-120 overflow-y-auto pr-1">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="p-3.5 border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 space-y-3 shadow-[3px_3px_0px_0px_#000]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase bg-pink-300 text-black px-2 py-0.5 border border-black">
                Project #{idx + 1}: {proj.title}
              </span>
              <button
                onClick={() => handleRemove(proj.id)}
                className="text-red-500 hover:text-red-700 p-1 cursor-pointer font-bold text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>

            {/* View Type Selector */}
            <div className="bg-yellow-100 dark:bg-slate-900 p-2.5 border-2 border-black">
              <BrutalSelect
                label="Card View Type Style"
                options={VIEW_TYPE_OPTIONS}
                value={proj.viewType}
                onChange={(e) =>
                  handleUpdate(proj.id, 'viewType', e.target.value as ProjectViewType)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <BrutalInput
                label="Project Title"
                value={proj.title}
                onChange={(e) => handleUpdate(proj.id, 'title', e.target.value)}
              />
              <BrutalInput
                label="Category"
                value={proj.category}
                onChange={(e) => handleUpdate(proj.id, 'category', e.target.value)}
              />
            </div>

            <BrutalInput
              label="Tagline"
              value={proj.tagline}
              onChange={(e) => handleUpdate(proj.id, 'tagline', e.target.value)}
            />

            <BrutalTextarea
              label="Description"
              value={proj.description}
              onChange={(e) => handleUpdate(proj.id, 'description', e.target.value)}
              rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <BrutalInput
                label="Live Demo Link"
                value={proj.demoUrl || ''}
                onChange={(e) => handleUpdate(proj.id, 'demoUrl', e.target.value)}
              />
              <BrutalInput
                label="GitHub Repo Link"
                value={proj.githubUrl || ''}
                onChange={(e) => handleUpdate(proj.id, 'githubUrl', e.target.value)}
              />
            </div>

            <BrutalInput
              label="Cover Image URL"
              value={proj.coverImage}
              onChange={(e) => handleUpdate(proj.id, 'coverImage', e.target.value)}
            />

            <BrutalInput
              label="Tags (comma separated)"
              value={proj.tags.join(', ')}
              onChange={(e) =>
                handleUpdate(
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
                    handleUpdate(proj.id, 'metric', {
                      label: e.target.value,
                      value: proj.metric?.value || '',
                    })
                  }
                />
                <BrutalInput
                  label="Metric Value (e.g. 100k+)"
                  value={proj.metric?.value || ''}
                  onChange={(e) =>
                    handleUpdate(proj.id, 'metric', {
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
                  handleUpdate(proj.id, 'codeSnippet', {
                    language: 'typescript',
                    code: e.target.value,
                  })
                }
                rows={3}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
