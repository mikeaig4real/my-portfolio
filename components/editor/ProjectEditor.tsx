'use client';

import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { Project, BentoCardConfig } from '@/types/portfolio';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { Plus } from 'lucide-react';
import { scrapeUrlMetadata } from '@/lib/utils/urlMetadata';
import { showBentoToast } from '@/components/ui/BentoToast';
import { createNewDefaultProject } from './project/projectEditorConstants';
import { ProjectItemCard } from './project/ProjectItemCard';

interface ProjectEditorProps {
  projects: Project[];
  cards?: BentoCardConfig[];
  onChange: (updated: Project[]) => void;
  onAddCardToGrid?: (newCard: BentoCardConfig) => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  projects,
  cards = [],
  onChange,
  onAddCardToGrid,
}) => {
  const [fetchingId, setFetchingId] = useState<string | null>(null);

  const handleAdd = () => {
    onChange([createNewDefaultProject(), ...projects]);
  };

  const handleRemove = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Project, value: Project[keyof Project]) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleAddProjectToGrid = (proj: Project) => {
    if (!onAddCardToGrid) return;
    const maxOrder = Math.max(0, ...cards.map((c) => c.order));
    const newCard: BentoCardConfig = {
      id: `card_${nanoid()}`,
      type: proj.viewType === 'featured' ? 'featured_project' : 'project_view',
      title: proj.title,
      colSpan: proj.viewType === 'featured' ? 3 : 2,
      rowSpan: 2,
      order: maxOrder + 1,
      visible: true,
      accentColor: proj.accentColor || '#facc15',
      targetId: proj.id,
    };
    onAddCardToGrid(newCard);
    showBentoToast.success(`Added "${proj.title}" card to canvas grid!`, 'GRID CARD ADDED');
  };

  const handleAutoFetch = async (proj: Project) => {
    const targetUrl = proj.demoUrl || proj.githubUrl;
    if (!targetUrl || targetUrl.trim() === '' || targetUrl === 'https://') {
      showBentoToast.info('Please enter a valid Live Demo Link or GitHub Repo Link first.', 'URL REQUIRED');
      return;
    }

    setFetchingId(proj.id);
    const toastId = showBentoToast.loading(`Scraping live metadata from ${targetUrl}...`, 'AUTO-FETCHING');

    try {
      const meta = await scrapeUrlMetadata(targetUrl);
      showBentoToast.dismiss(toastId);

      if (meta.isRequestable) {
        const updated: Project = {
          ...proj,
          title: meta.title || proj.title,
          description: meta.description || proj.description,
          tagline: meta.siteName ? `Built on ${meta.siteName}` : proj.tagline,
          coverImage: meta.image || proj.coverImage,
        };
        onChange(projects.map((p) => (p.id === proj.id ? updated : p)));
        showBentoToast.success(`Successfully populated project fields from ${meta.siteName || 'link'}!`, 'PROJECT UPDATED');
      } else {
        showBentoToast.error(meta.error || 'Failed to fetch metadata from link. Verify the URL is reachable.', 'FETCH FAILED');
      }
    } catch {
      showBentoToast.dismiss(toastId);
      showBentoToast.error('An unexpected error occurred while fetching link metadata.', 'ERROR');
    } finally {
      setFetchingId(null);
    }
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
        {projects.map((proj, idx) => {
          const isOnCanvas = cards.some((c) => c.targetId === proj.id);

          return (
            <ProjectItemCard
              key={proj.id}
              proj={proj}
              idx={idx}
              isOnCanvas={isOnCanvas}
              isFetching={fetchingId === proj.id}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              onAddToGrid={handleAddProjectToGrid}
              onAutoFetch={handleAutoFetch}
            />
          );
        })}
      </div>
    </div>
  );
};
