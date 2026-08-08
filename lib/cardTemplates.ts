import React from 'react';
import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';
import { BentoCardConfig, BentoCardType, Project, ProjectViewType } from '@/types/portfolio';
import { SINGLETON_CARD_TYPES, CARD_TYPE_BOUNDS, BENTO_CARD_TYPES, PROJECT_VIEW_TYPES } from '@/lib/constants';

export interface CardTemplateOption {
  type: BentoCardType;
  title: string;
  category: string;
  description: string;
  accentColor: string;
  viewType?: ProjectViewType;
  defaultContent?: Record<string, string>;
}

export const createPlaceholderProject = (
  id: string,
  baseTitle: string,
  viewType: ProjectViewType
): Project => {
  const companyName = faker.company.name();
  const catchPhrase = faker.company.catchPhrase();
  const techStack1 = faker.hacker.adjective();
  const techStack2 = faker.hacker.noun();

  switch (viewType) {
    case PROJECT_VIEW_TYPES.FEATURED:
      return {
        id,
        title: `${baseTitle}: ${catchPhrase}`,
        tagline: `${faker.hacker.ingverb()} ${companyName} Platform`,
        description: `${faker.lorem.paragraph()} Built with modern cloud infrastructure, real-time metrics, and agentic workflows.`,
        category: 'Full Stack',
        tags: [
          'Next.js 15',
          'TypeScript',
          techStack1.toUpperCase(),
          techStack2.toUpperCase(),
        ],
        viewType: PROJECT_VIEW_TYPES.FEATURED,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507925921958-81fcd9a457c6?auto=format&fit=crop&w=800&q=80',
        ],
        demoUrl: faker.internet.url(),
        githubUrl: 'https://github.com',
        metric: {
          label: 'System Score',
          value: `${faker.number.int({ min: 95, max: 99 })}.${faker.number.int({ min: 1, max: 9 })}%`,
        },
        featured: true,
        accentColor: '#ff9f1c',
      };

    case PROJECT_VIEW_TYPES.GALLERY:
      return {
        id,
        title: `${baseTitle}: ${faker.commerce.productName()}`,
        tagline: 'Interactive UI/UX Screenshot Gallery',
        description: faker.lorem.sentences(2),
        category: 'Frontend',
        tags: ['React', 'Framer Motion', 'Tailwind', 'UI/UX'],
        viewType: PROJECT_VIEW_TYPES.GALLERY,
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        ],
        demoUrl: faker.internet.url(),
        githubUrl: 'https://github.com',
        featured: false,
        accentColor: '#ff70a6',
      };

    case PROJECT_VIEW_TYPES.CODE:
      return {
        id,
        title: `${baseTitle}: ${faker.hacker.noun()} Controller`,
        tagline: 'High-Performance Backend Logic',
        description: faker.lorem.sentences(2),
        category: 'Backend',
        tags: ['TypeScript', 'Node.js', 'Express', 'Zustand'],
        viewType: PROJECT_VIEW_TYPES.CODE,
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        galleryImages: [],
        codeSnippet: {
          language: 'typescript',
          code: `// ${companyName} API Service\nexport async function handleRequest(req: Request) {\n  const data = await fetch("${faker.internet.url()}");\n  return NextResponse.json({ status: 200, data });\n}`,
        },
        demoUrl: faker.internet.url(),
        githubUrl: 'https://github.com',
        featured: false,
        accentColor: '#a7f3d0',
      };

    case PROJECT_VIEW_TYPES.METRIC:
      return {
        id,
        title: `${baseTitle}: ${faker.hacker.adjective()} Telemetry`,
        tagline: 'Real-Time Operational Monitoring',
        description: faker.lorem.sentences(2),
        category: 'DevOps',
        tags: ['Analytics', 'Monitoring', 'Web Vitals'],
        viewType: PROJECT_VIEW_TYPES.METRIC,
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        galleryImages: [],
        metric: {
          label: 'Uptime Reliability',
          value: '99.99%',
        },
        demoUrl: faker.internet.url(),
        githubUrl: 'https://github.com',
        featured: false,
        accentColor: '#70d6ff',
      };

    case PROJECT_VIEW_TYPES.COMPACT:
    default:
      return {
        id,
        title: `${baseTitle}: ${faker.company.buzzPhrase()}`,
        tagline: 'Modular Component System',
        description: faker.lorem.sentences(2),
        category: 'Full Stack',
        tags: ['React', 'TypeScript', 'Tailwind'],
        viewType: PROJECT_VIEW_TYPES.COMPACT,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        galleryImages: [],
        demoUrl: faker.internet.url(),
        githubUrl: 'https://github.com',
        featured: false,
        accentColor: '#a7f3d0',
      };
  }
};

export const CARD_TEMPLATES: CardTemplateOption[] = [
  {
    type: BENTO_CARD_TYPES.HERO_PROFILE,
    title: 'Hero Profile',
    category: 'PROFILE',
    description: 'Bio, avatar, availability, and main introduction.',
    accentColor: '#facc15',
  },
  {
    type: BENTO_CARD_TYPES.WORKPLACE,
    title: 'Work Experience',
    category: 'TIMELINE',
    description: 'Interactive career history tabs and tech stack badges.',
    accentColor: '#70d6ff',
  },
  {
    type: BENTO_CARD_TYPES.TECH_STACK,
    title: 'Tech Stack Matrix',
    category: 'SKILLS',
    description: 'Categorized technical skills & proficiency badges.',
    accentColor: '#a7f3d0',
  },
  {
    type: BENTO_CARD_TYPES.SOCIALS,
    title: 'Connect & Links',
    category: 'CONTACT',
    description: 'Social links grid (GitHub, LinkedIn, Twitter, Email).',
    accentColor: '#d8b4fe',
  },
  {
    type: BENTO_CARD_TYPES.CERTIFICATION,
    title: 'Certification Badge',
    category: 'CREDENTIALS',
    description: 'Professional or technical certifications with verification link.',
    accentColor: '#ff70a6',
    defaultContent: {
      title: 'Professional Certified Engineer',
      issuer: 'Certification Authority / Training',
      issueDate: '2025',
      credentialUrl: 'https://example.com',
    },
  },
  {
    type: BENTO_CARD_TYPES.FEATURED_PROJECT,
    title: 'Featured Flagship Showcase',
    category: 'PROJECT',
    description: 'Large cover image, carousel slides, metrics, tags, live & repo links.',
    accentColor: '#ff9f1c',
    viewType: PROJECT_VIEW_TYPES.FEATURED,
  },
  {
    type: BENTO_CARD_TYPES.PROJECT_VIEW,
    title: 'Gallery Slide Project',
    category: 'PROJECT',
    description: 'Multi-image slide carousel showcasing project UI & screenshots.',
    accentColor: '#ff70a6',
    viewType: PROJECT_VIEW_TYPES.GALLERY,
  },
  {
    type: BENTO_CARD_TYPES.PROJECT_VIEW,
    title: 'Code Snippet Project',
    category: 'PROJECT',
    description: 'Code snippet preview with syntax highlighting & copy button.',
    accentColor: '#a7f3d0',
    viewType: PROJECT_VIEW_TYPES.CODE,
  },
  {
    type: BENTO_CARD_TYPES.PROJECT_VIEW,
    title: 'Stats & Metrics Project',
    category: 'PROJECT',
    description: 'Highlighted performance metric & analytics dashboard link.',
    accentColor: '#70d6ff',
    viewType: PROJECT_VIEW_TYPES.METRIC,
  },
  {
    type: BENTO_CARD_TYPES.CUSTOM_NOTE,
    title: 'Custom Note Card',
    category: 'NOTE',
    description: 'Custom markdown note, verification badge, or text highlight.',
    accentColor: '#facc15',
    defaultContent: {
      title: 'Architecture & System Note',
      body: 'Building scalable modern web applications with agentic workflows, responsive UI, and high-performance serverless backends.',
      metricValue: 'Verified',
      metricLabel: 'Status',
    },
  },
];

export const buildNewCard = (
  tpl: CardTemplateOption,
  cards: BentoCardConfig[]
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
  }

  const newCard: BentoCardConfig = {
    id: cardId,
    type: tpl.type,
    title: newProject ? newProject.title : tpl.title,
    colSpan: bounds.minCol,
    rowSpan: bounds.minRow,
    order: maxOrder + 1,
    visible: true,
    accentColor: tpl.accentColor,
    targetId: assignedTargetId,
    customContent: tpl.defaultContent,
  };

  return { newCard, newProject };
};
