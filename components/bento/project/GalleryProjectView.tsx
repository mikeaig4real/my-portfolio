'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Plus } from 'lucide-react';
import { Project } from '@/types/portfolio';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { InlineText } from '@/components/inline/InlineText';
import { InlineImagePicker } from '@/components/inline/InlineImagePicker';
import { EditableTagList } from '@/components/inline/EditableTagList';
import { InlineLinkPopover } from '@/components/inline/InlineLinkPopover';
import { logger } from '@/lib/logger';

interface GalleryProjectViewProps {
  project: Project;
  accentColor: string;
  cardTitle?: string;
  onUpdateCardTitle?: (newTitle: string) => void;
  isEditingActive?: boolean;
  onUpdateProject?: (updated: Project) => void;
}

export const GalleryProjectView: React.FC<GalleryProjectViewProps> = ({
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

  const handleImageUploaded = (newUrl: string) => {
    logger.debug(`[GalleryProjectView] Image uploaded/attached for slide #${galleryIdx + 1}:`, newUrl);
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
      title={cardTitle || `GALLERY // ${project.title}`}
      isEditingActive={isEditingActive}
      onUpdateTitle={onUpdateCardTitle || ((val) => updateField('title', val))}
      className="h-full flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="relative w-full h-36 md:h-44 border-2 border-black dark:border-white overflow-hidden shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
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
                placeholderText="Upload Gallery Image"
              />
            </motion.div>
          </AnimatePresence>

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
          <h3 className="text-lg font-bold text-black dark:text-white font-mono uppercase">
            <InlineText
              value={project.title}
              onChange={(val) => updateField('title', val)}
              isEditingActive={isEditingActive}
            />
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
            <InlineText
              value={project.description}
              onChange={(val) => updateField('description', val)}
              isEditingActive={isEditingActive}
              multiline
            />
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2 pt-2 border-t-2 border-black dark:border-white">
        <EditableTagList
          tags={project.tags}
          onChangeTags={(tags) => updateField('tags', tags)}
          isEditingActive={isEditingActive}
          accentBg="bg-cyan-200 text-black"
        />

        <div className="flex items-center justify-between pt-1">
          <InlineLinkPopover
            label="Visit Demo"
            url={project.demoUrl || ''}
            variant="cyan"
            icon={<ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />}
            isEditingActive={isEditingActive}
            onUpdateLink={(_, newUrl) => updateField('demoUrl', newUrl)}
          />
        </div>
      </div>
    </BrutalCard>
  );
};
