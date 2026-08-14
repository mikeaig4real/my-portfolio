import { Project } from '@/types/portfolio';

export const VIEW_TYPE_OPTIONS = [
  { label: '🌟 Featured Wide View', value: 'featured' },
  { label: '🖼️ Image Gallery View', value: 'gallery' },
  { label: '📊 Big Metric / Stat View', value: 'metric' },
  { label: '💻 Code Snippet View', value: 'code' },
  { label: '⚡ Compact View', value: 'compact' },
];

export const createNewDefaultProject = (): Project => ({
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
});
