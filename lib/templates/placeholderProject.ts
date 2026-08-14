import { faker } from '@faker-js/faker';
import { Project, ProjectViewType } from '@/types/portfolio';
import { PROJECT_VIEW_TYPES } from '@/lib/constants';

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
