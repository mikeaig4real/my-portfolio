'use client';

import React from 'react';
import { motion, useDragControls } from 'framer-motion';
import { PortfolioData, BentoCardConfig, Profile, Workplace, SkillGroup, Project, SocialLink } from '@/types/portfolio';
import { BENTO_CARD_TYPES } from '@/lib/constants';
import { HeroProfileCard } from './HeroProfileCard';
import { WorkplaceCard } from './WorkplaceCard';
import { ProjectCard } from './ProjectCard';
import { TechStackCard } from './TechStackCard';
import { SocialsCard } from './SocialsCard';
import { NoteCard } from './NoteCard';
import { CertificationCard } from './CertificationCard';
import { BentoCardWrapper } from './BentoCardWrapper';

interface BentoGridProps {
  data: PortfolioData;
  isEditingActive?: boolean;
  newlyAddedCardId?: string | null;
  onUpdateCards?: (cards: BentoCardConfig[]) => void;
  onUpdateProfile?: (profile: Profile) => void;
  onUpdateWorkplaces?: (workplaces: Workplace[]) => void;
  onUpdateSkills?: (skills: SkillGroup[]) => void;
  onUpdateProjects?: (projects: Project[]) => void;
  onUpdateSocials?: (socials: SocialLink[]) => void;
  onOpenResumeManager?: () => void;
}

const getColSpanClass = (span: number) => {
  switch (span) {
    case 2:
      return 'col-span-1 md:col-span-2';
    case 3:
      return 'col-span-1 md:col-span-3';
    case 4:
      return 'col-span-1 md:col-span-4';
    default:
      return 'col-span-1';
  }
};

const getRowSpanClass = (span: number) => {
  switch (span) {
    case 2:
      return 'row-span-1 md:row-span-2';
    case 3:
      return 'row-span-1 md:row-span-3';
    default:
      return 'row-span-1';
  }
};

const BentoDragCardItem: React.FC<{
  card: BentoCardConfig;
  cards: BentoCardConfig[];
  isEditingActive: boolean;
  isNewlyAdded?: boolean;
  onUpdateSpan: (c: number, r: number) => void;
  onUpdateColor: (col: string) => void;
  onToggleVisible: () => void;
  onDeleteCard?: () => void;
  onDropAtNewIndex: (draggedCardId: string, targetIdx: number) => void;
  children: React.ReactNode;
}> = ({
  card,
  cards,
  isEditingActive,
  isNewlyAdded,
  onUpdateSpan,
  onUpdateColor,
  onToggleVisible,
  onDeleteCard,
  onDropAtNewIndex,
  children,
}) => {
  const controls = useDragControls();
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrag = (_: unknown, info: { point: { x: number; y: number } }) => {
    const threshold = 120;
    const viewportHeight = window.innerHeight;
    const clientY = info.point.y - window.scrollY;

    if (clientY < threshold) {
      const scrollSpeed = Math.min(25, (threshold - clientY) / 3);
      window.scrollBy(0, -scrollSpeed);
    } else if (clientY > viewportHeight - threshold) {
      const scrollSpeed = Math.min(25, (clientY - (viewportHeight - threshold)) / 3);
      window.scrollBy(0, scrollSpeed);
    }
  };

  const handleDragEnd = (_: unknown, info: { point: { x: number; y: number } }) => {
    setIsDragging(false);

    const gridElements = document.querySelectorAll('[data-bento-card-id]');
    let closestCardId = card.id;
    let minDistance = Infinity;

    gridElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cardId = el.getAttribute('data-bento-card-id');
      if (!cardId) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(info.point.x - centerX, info.point.y - centerY);

      if (distance < minDistance) {
        minDistance = distance;
        closestCardId = cardId;
      }
    });

    if (closestCardId !== card.id) {
      const targetIdx = cards.findIndex((c) => c.id === closestCardId);
      if (targetIdx !== -1) {
        onDropAtNewIndex(card.id, targetIdx);
      }
    }
  };

  return (
    <motion.div
      data-bento-card-id={card.id}
      layout
      drag={isEditingActive}
      dragControls={controls}
      dragListener={false}
      dragSnapToOrigin={true}
      whileDrag={{ zIndex: 50, scale: 1.03, opacity: 0.95 }}
      onDragStart={() => setIsDragging(true)}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative ${getColSpanClass(card.colSpan)} ${getRowSpanClass(card.rowSpan)} ${
        isDragging ? 'z-50' : ''
      } ${!card.visible ? 'opacity-40 grayscale' : ''} ${
        isNewlyAdded ? 'ring-4 ring-yellow-400 dark:ring-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.9)] animate-pulse' : ''
      }`}
    >
      <BentoCardWrapper
        card={card}
        isEditingActive={isEditingActive}
        onUpdateSpan={onUpdateSpan}
        onUpdateColor={onUpdateColor}
        onToggleVisible={onToggleVisible}
        onDeleteCard={onDeleteCard}
        onDragHandlePointerDown={(e) => controls.start(e)}
      >
        {children}
      </BentoCardWrapper>
    </motion.div>
  );
};

export const BentoGrid: React.FC<BentoGridProps> = ({
  data,
  isEditingActive = false,
  newlyAddedCardId,
  onUpdateCards,
  onUpdateProfile,
  onUpdateWorkplaces,
  onUpdateSkills,
  onUpdateProjects,
  onUpdateSocials,
  onOpenResumeManager,
}) => {
  const cards = isEditingActive
    ? [...data.cards].sort((a, b) => a.order - b.order)
    : [...data.cards].filter((c) => c.visible).sort((a, b) => a.order - b.order);

  const handleUpdateCardSpan = (cardId: string, colSpan: number, rowSpan: number) => {
    if (!onUpdateCards) return;
    onUpdateCards(
      data.cards.map((c) => (c.id === cardId ? { ...c, colSpan, rowSpan } : c))
    );
  };

  const handleUpdateCardColor = (cardId: string, accentColor: string) => {
    if (!onUpdateCards) return;
    onUpdateCards(
      data.cards.map((c) => (c.id === cardId ? { ...c, accentColor } : c))
    );
  };

  const handleUpdateCardTitle = (cardId: string, title: string) => {
    if (!onUpdateCards) return;
    onUpdateCards(
      data.cards.map((c) => (c.id === cardId ? { ...c, title } : c))
    );
  };

  const handleToggleCardVisible = (cardId: string) => {
    if (!onUpdateCards) return;
    onUpdateCards(
      data.cards.map((c) => (c.id === cardId ? { ...c, visible: !c.visible } : c))
    );
  };

  const handleDeleteCard = (cardId: string) => {
    if (!onUpdateCards) return;
    onUpdateCards(data.cards.filter((c) => c.id !== cardId));
  };

  const handleDropAtNewIndex = (draggedCardId: string, targetIdx: number) => {
    if (!onUpdateCards) return;
    const currentCards = [...cards];
    const sourceIdx = currentCards.findIndex((c) => c.id === draggedCardId);
    if (sourceIdx === -1 || sourceIdx === targetIdx) return;

    const [movedCard] = currentCards.splice(sourceIdx, 1);
    currentCards.splice(targetIdx, 0, movedCard);

    const reorderedWithIndices = currentCards.map((c, idx) => ({
      ...c,
      order: idx + 1,
    }));

    onUpdateCards(reorderedWithIndices);
  };

  const handleUpdateCardTargetId = (cardId: string, targetId: string) => {
    if (!onUpdateCards) return;
    onUpdateCards(
      data.cards.map((c) => (c.id === cardId ? { ...c, targetId } : c))
    );
  };

  const renderCardContent = (card: BentoCardConfig) => {
    const cardTitle = card.title;
    const onUpdateCardTitle = (newTitle: string) => handleUpdateCardTitle(card.id, newTitle);

    switch (card.type) {
      case BENTO_CARD_TYPES.HERO_PROFILE:
        return (
          <HeroProfileCard
            profile={data.profile}
            accentColor={card.accentColor}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateProfile={onUpdateProfile}
            onOpenResumeManager={onOpenResumeManager}
          />
        );

      case BENTO_CARD_TYPES.WORKPLACE:
        return (
          <WorkplaceCard
            workplaces={data.workplaces}
            accentColor={card.accentColor}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateWorkplaces={onUpdateWorkplaces}
          />
        );

      case BENTO_CARD_TYPES.FEATURED_PROJECT:
      case BENTO_CARD_TYPES.PROJECT_VIEW: {
        const proj = data.projects.find((p) => p.id === card.targetId) || data.projects[0];
        if (!proj) return null;
        return (
          <ProjectCard
            project={proj}
            projects={data.projects}
            accentColor={card.accentColor}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onSelectTargetId={(newTargetId) => handleUpdateCardTargetId(card.id, newTargetId)}
            onUpdateProject={(updatedProj) => {
              if (onUpdateProjects) {
                onUpdateProjects(
                  data.projects.map((p) => (p.id === updatedProj.id ? updatedProj : p))
                );
              }
            }}
          />
        );
      }

      case BENTO_CARD_TYPES.TECH_STACK:
        return (
          <TechStackCard
            skills={data.skills}
            accentColor={card.accentColor}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateSkills={onUpdateSkills}
          />
        );

      case BENTO_CARD_TYPES.SOCIALS:
        return (
          <SocialsCard
            socials={data.socials}
            accentColor={card.accentColor}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateSocials={onUpdateSocials}
          />
        );

      case BENTO_CARD_TYPES.CERTIFICATION:
        return (
          <CertificationCard
            customContent={card.customContent}
            accentColor={card.accentColor}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateContent={(updatedContent) => {
              if (onUpdateCards) {
                onUpdateCards(
                  data.cards.map((c) =>
                    c.id === card.id ? { ...c, customContent: updatedContent } : c
                  )
                );
              }
            }}
          />
        );

      case BENTO_CARD_TYPES.CUSTOM_NOTE:
        return (
          <NoteCard
            customContent={card.customContent}
            accentColor={card.accentColor}
            cardTitle={cardTitle}
            onUpdateCardTitle={onUpdateCardTitle}
            isEditingActive={isEditingActive}
            onUpdateContent={(updatedContent) => {
              if (onUpdateCards) {
                onUpdateCards(
                  data.cards.map((c) =>
                    c.id === card.id ? { ...c, customContent: updatedContent } : c
                  )
                );
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[minmax(220px,auto)] relative"
    >
      {cards.map((card) => (
        <BentoDragCardItem
          key={card.id}
          card={card}
          cards={cards}
          isEditingActive={isEditingActive}
          isNewlyAdded={card.id === newlyAddedCardId}
          onUpdateSpan={(c, r) => handleUpdateCardSpan(card.id, c, r)}
          onUpdateColor={(col) => handleUpdateCardColor(card.id, col)}
          onToggleVisible={() => handleToggleCardVisible(card.id)}
          onDeleteCard={() => handleDeleteCard(card.id)}
          onDropAtNewIndex={handleDropAtNewIndex}
        >
          {renderCardContent(card)}
        </BentoDragCardItem>
      ))}
    </motion.div>
  );
};
