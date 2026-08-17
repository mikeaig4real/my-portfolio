'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Plus } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { InlineText } from '@/components/inline/InlineText';
import { InlineImagePicker } from '@/components/inline/InlineImagePicker';
import { EditableTagList } from '@/components/inline/EditableTagList';
import { InlineLinkPopover } from '@/components/inline/InlineLinkPopover';
import { logger } from '@/lib/logger';

interface FeaturedProjectViewProps {
  project: Project;
  accentColor: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateProject?: (updated: Project) => void;
}

export const FeaturedProjectView: React.FC<FeaturedProjectViewProps> = ({
  project,
  accentColor,
  cardTitle,
  onUpdateCardTitle,
  isEditingActive = false,
  onUpdateProject,
}) => {
  const [galleryIdx, setGalleryIdx] = useState(0);

  const defaultImages = [
    project.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
  ];

  const images = (project.galleryImages && project.galleryImages.length > 0)
    ? project.galleryImages
    : defaultImages;

  const updateField = <K extends keyof Project>(field: K, val: Project[K]) => {
    if (onUpdateProject) {
      onUpdateProject({ ...project, [field]: val });
    }
  };

  const updateMetric = (field: 'label' | 'value', val: string) => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        metric: {
          label: project.metric?.label || 'Metric',
          value: project.metric?.value || '100%',
          [field]: val,
        },
      });
    }
  };

  const handleImageUploaded = (newUrl: string) => {
    logger.debug(`[FeaturedProjectView] Image uploaded/attached for slide #${galleryIdx + 1}:`, newUrl);
    const currentList = (project.galleryImages && project.galleryImages.length > 0)
      ? [...project.galleryImages]
      : [...defaultImages];

    currentList[galleryIdx] = newUrl;

    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        galleryImages: currentList,
        ...(galleryIdx === 0 ? { coverImage: newUrl } : {}),
      });
    }
  };

  const handleImageRemoved = () => {
    const currentList = (project.galleryImages && project.galleryImages.length > 0)
      ? [...project.galleryImages]
      : [...defaultImages];

    const updatedGallery = currentList.filter((_, idx) => idx !== galleryIdx);
    updateField('galleryImages', updatedGallery);
    setGalleryIdx(0);
  };

  const handleAddGallerySlide = () => {
    const currentList = (project.galleryImages && project.galleryImages.length > 0)
      ? [...project.galleryImages]
      : [...defaultImages];

    if (currentList.length >= 5) return;
    const newPlaceholder = 'https://images.unsplash.com/photo-1507925921958-81fcd9a457c6?auto=format&fit=crop&w=600&q=80';
    const updated = [...currentList, newPlaceholder];
    updateField('galleryImages', updated);
    setGalleryIdx(updated.length - 1);
  };

  return (
    <BrutalCard
      accentColor={accentColor}
      title={cardTitle || `FEATURED // ${project.title}`}
      badge="FLAGSHIP"
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle || ((val) => updateField('title', val))}
      className="h-full flex flex-col justify-between overflow-hidden"
    >
      <div className="overflow-y-auto max-h-95 md:max-h-110 pr-1.5 flex-1 space-y-3">
        <div className="relative w-full h-40 md:h-48 border-2 border-black dark:border-white overflow-hidden shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
          <AnimatePresence mode="wait">
            <motion.div
              key={galleryIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <InlineImagePicker
                imageUrl={images[galleryIdx]}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
                isEditingActive={isEditingActive}
                className="w-full h-full"
                alt={project.title}
                placeholderText="Upload Showcase Image"
              />
            </motion.div>
          </AnimatePresence>

          {/* Metric Pill Overlay */}
          <div className="absolute top-2 right-2 z-10 bg-black text-yellow-300 px-2 py-0.5 text-xs font-mono font-bold border border-white shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
            <span>⚡</span>
            <InlineText
              value={project.metric?.label || 'Metric'}
              onChange={(val) => updateMetric('label', val)}
              isEditingActive={isEditingActive}
            />
            <span>:</span>
            <InlineText
              value={project.metric?.value || '100%'}
              onChange={(val) => updateMetric('value', val)}
              isEditingActive={isEditingActive}
            />
          </div>

          {/* Gallery Slide Indicator & Add Button */}
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-black/80 p-1 border border-white">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setGalleryIdx(idx)}
                className={`w-2.5 h-2.5 border border-black cursor-pointer ${
                  galleryIdx === idx ? 'bg-yellow-400' : 'bg-white'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}

            {isEditingActive && images.length < 3 && (
              <button
                onClick={handleAddGallerySlide}
                className="ml-1 p-0.5 bg-yellow-300 text-black border border-black hover:bg-yellow-400 cursor-pointer"
                title="Add 3rd Slide (Max 3)"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-black dark:text-white font-mono uppercase">
            <InlineText
              value={project.title}
              onChange={(val) => updateField('title', val)}
              isEditingActive={isEditingActive}
            />
          </h3>
          <p className="text-xs font-bold text-slate-800 dark:text-yellow-300 uppercase tracking-wide mt-0.5">
            <InlineText
              value={project.tagline}
              onChange={(val) => updateField('tagline', val)}
              isEditingActive={isEditingActive}
            />
          </p>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 mt-2 font-medium">
            <InlineText
              value={project.description}
              onChange={(val) => updateField('description', val)}
              isEditingActive={isEditingActive}
              multiline
            />
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t-2 border-black dark:border-white space-y-3 shrink-0">
        <EditableTagList
          tags={project.tags}
          onChangeTags={(tags) => updateField('tags', tags)}
          isEditingActive={isEditingActive}
          accentBg="bg-yellow-200 dark:bg-slate-800 text-black dark:text-white"
        />

        <div className="flex flex-wrap items-center gap-2">
          <InlineLinkPopover
            label="Live Demo"
            url={project.demoUrl || ''}
            variant="yellow"
            icon={<ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />}
            isEditingActive={isEditingActive}
            onUpdateLink={(_, newUrl) => updateField('demoUrl', newUrl)}
          />

          <InlineLinkPopover
            label="GitHub"
            url={project.githubUrl || ''}
            variant="white"
            icon={<Github className="w-3.5 h-3.5 stroke-[2.5]" />}
            isEditingActive={isEditingActive}
            onUpdateLink={(_, newUrl) => updateField('githubUrl', newUrl)}
          />
        </div>
      </div>
    </BrutalCard>
  );
};
