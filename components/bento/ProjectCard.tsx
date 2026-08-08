'use client';

import React from 'react';
import { Project } from '@/types/portfolio';
import { PROJECT_VIEW_TYPES } from '@/lib/constants';
import { FeaturedProjectView } from './project/FeaturedProjectView';
import { GalleryProjectView } from './project/GalleryProjectView';
import { CodeProjectView } from './project/CodeProjectView';
import { MetricProjectView } from './project/MetricProjectView';
import { CompactProjectView } from './project/CompactProjectView';

interface ProjectCardProps {
  project: Project;
  accentColor?: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateProject?: (updated: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  accentColor,
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateProject,
}) => {
  const cardAccent = accentColor || project.accentColor || '#70d6ff';

  const renderView = () => {
    switch (project.viewType) {
      case PROJECT_VIEW_TYPES.FEATURED:
        return (
          <FeaturedProjectView
            project={project}
            accentColor={cardAccent}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateProject={onUpdateProject}
          />
        );
      case PROJECT_VIEW_TYPES.GALLERY:
        return (
          <GalleryProjectView
            project={project}
            accentColor={cardAccent}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateProject={onUpdateProject}
          />
        );
      case PROJECT_VIEW_TYPES.CODE:
        return (
          <CodeProjectView
            project={project}
            accentColor={cardAccent}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateProject={onUpdateProject}
          />
        );
      case PROJECT_VIEW_TYPES.METRIC:
        return (
          <MetricProjectView
            project={project}
            accentColor={cardAccent}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateProject={onUpdateProject}
          />
        );
      case PROJECT_VIEW_TYPES.COMPACT:
      default:
        return (
          <CompactProjectView
            project={project}
            accentColor={cardAccent}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateProject={onUpdateProject}
          />
        );
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {renderView()}
    </div>
  );
};
