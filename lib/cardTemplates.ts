import { nanoid } from 'nanoid';
import { BentoCardConfig, Project } from '@/types/portfolio';
import { CARD_TYPE_BOUNDS, BENTO_CARD_TYPES, PROJECT_VIEW_TYPES } from '@/lib/constants';
import { ScrapedMetadataResult } from '@/lib/utils/urlMetadata';
import { createPlaceholderProject } from './templates/placeholderProject';
import { CARD_TEMPLATES, CardTemplateOption } from './templates/cardTemplateOptions';

export { createPlaceholderProject, CARD_TEMPLATES };
export type { CardTemplateOption };

export const buildNewCard = (
  tpl: CardTemplateOption,
  cards: BentoCardConfig[],
  scrapedMeta?: ScrapedMetadataResult
): { newCard: BentoCardConfig; newProject?: Project } => {
  const bounds = CARD_TYPE_BOUNDS[tpl.type] || { minCol: 1, maxCol: 2, minRow: 1, maxRow: 2 };
  const maxOrder = Math.max(0, ...cards.map((c) => c.order));
  const cardId = `card_${nanoid()}`;

  let assignedTargetId: string | undefined = undefined;
  let newProject: Project | undefined = undefined;

  if (tpl.type === BENTO_CARD_TYPES.FEATURED_PROJECT || tpl.type === BENTO_CARD_TYPES.PROJECT_VIEW) {
    const projId = `proj_${nanoid()}`;
    assignedTargetId = projId;
    newProject = createPlaceholderProject(projId, tpl.title, tpl.viewType || PROJECT_VIEW_TYPES.COMPACT);

    if (scrapedMeta) {
      if (scrapedMeta.title) newProject.title = scrapedMeta.title;
      if (scrapedMeta.description) newProject.description = scrapedMeta.description;
      if (scrapedMeta.image) newProject.coverImage = scrapedMeta.image;
      if (scrapedMeta.url) newProject.demoUrl = scrapedMeta.url;
      if (scrapedMeta.siteName) newProject.tagline = `Built on ${scrapedMeta.siteName}`;
    }
  }

  const defaultContent: Record<string, string> = { ...tpl.defaultContent };
  if (scrapedMeta) {
    if (scrapedMeta.title) defaultContent.title = scrapedMeta.title;
    if (scrapedMeta.description) defaultContent.body = scrapedMeta.description;
    if (scrapedMeta.siteName) defaultContent.issuer = scrapedMeta.siteName;
    if (scrapedMeta.url) defaultContent.credentialUrl = scrapedMeta.url;
  }

  const newCard: BentoCardConfig = {
    id: cardId,
    type: tpl.type,
    title: scrapedMeta?.title || (newProject ? newProject.title : tpl.title),
    colSpan: bounds.minCol,
    rowSpan: bounds.minRow,
    order: maxOrder + 1,
    visible: true,
    accentColor: tpl.accentColor,
    targetId: assignedTargetId,
    customContent: Object.keys(defaultContent).length > 0 ? defaultContent : tpl.defaultContent,
  };

  return { newCard, newProject };
};
