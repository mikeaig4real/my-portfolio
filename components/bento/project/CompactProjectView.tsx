'use client';

import React from 'react';
import { Github } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { InlineText } from '@/components/inline/InlineText';
import { EditableTagList } from '@/components/inline/EditableTagList';
import { InlineLinkPopover } from '@/components/inline/InlineLinkPopover';
import { trackProjectClick } from '@/lib/analyticsTracker';

interface CompactProjectViewProps {
  project: Project;
  accentColor: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateProject?: (updated: Project) => void;
}

export const CompactProjectView: React.FC<CompactProjectViewProps> = ({
  project,
  accentColor,
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateProject,
}) => {
  const updateField = <K extends keyof Project>(field: K, val: Project[K]) => {
    if (onUpdateProject) {
      onUpdateProject({ ...project, [field]: val });
    }
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || project.title}
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle || ((val) => updateField('title', val))}
      className="h-full flex flex-col justify-between"
    >
      <div>
        <h3 className="text-base font-extrabold text-black dark:text-white font-mono uppercase">
          <InlineText
            value={project.title}
            onChange={(val) => updateField('title', val)}
            isEditingActive={isEditingActive}
          />
        </h3>
        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium line-clamp-2">
          <InlineText
            value={project.description}
            onChange={(val) => updateField('description', val)}
            isEditingActive={isEditingActive}
            multiline
          />
        </p>

        <div className="mt-2">
          <EditableTagList
            tags={project.tags}
            onChangeTags={(tags) => updateField('tags', tags)}
            isEditingActive={isEditingActive}
            accentBg="bg-lime-200 text-black"
          />
        </div>
      </div>

      <div className="mt-3 pt-2 border-t-2 border-black dark:border-white flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold bg-lime-200 text-black px-1.5 py-0.5 border border-black">
          <InlineText
            value={project.category}
            onChange={(val) => updateField('category', val)}
            isEditingActive={isEditingActive}
          />
        </span>

        <InlineLinkPopover
          label="Code"
          url={project.githubUrl || ''}
          variant="lime"
          icon={<Github className="w-3.5 h-3.5 stroke-[2.5]" />}
          isEditingActive={isEditingActive}
          onClick={() => trackProjectClick(project.id, project.title, 'compact_code')}
          onUpdateLink={(_, newUrl) => updateField('githubUrl', newUrl)}
        />
      </div>
    </BrutalCard>
  );
};
