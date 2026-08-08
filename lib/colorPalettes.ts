import { PortfolioData } from '@/types/portfolio';

export interface ColorSchemePreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  backgroundLight?: string;
  backgroundDark?: string;
  cardBgLight?: string;
  cardBgDark?: string;
  colors: string[];
}

export const COLOR_SCHEMES: ColorSchemePreset[] = [
  {
    id: 'cyber_yellow',
    name: '⚡ Classic Cyber Yellow',
    primary: '#facc15',
    secondary: '#70d6ff',
    accent: '#ff70a6',
    colors: ['#facc15', '#ff70a6', '#70d6ff', '#a7f3d0', '#d8b4fe', '#ff9f1c'],
  },
  {
    id: 'synthwave',
    name: '🌆 Neon Synthwave',
    primary: '#ff007f',
    secondary: '#00dfd8',
    accent: '#7928ca',
    colors: ['#ff007f', '#7928ca', '#00dfd8', '#ff4e50', '#f9d423', '#00f2fe'],
  },
  {
    id: 'retro_arcade',
    name: '🕹️ Retro Arcade Green',
    primary: '#4ade80',
    secondary: '#38bdf8',
    accent: '#facc15',
    colors: ['#4ade80', '#38bdf8', '#facc15', '#fb7185', '#c084fc', '#f97316'],
  },
  {
    id: 'acid_lime',
    name: '🧪 Acid Lime & Neon',
    primary: '#ccff00',
    secondary: '#00ffcc',
    accent: '#ff00ff',
    colors: ['#ccff00', '#00ffcc', '#ff00ff', '#ffcc00', '#00ccff', '#ff3366'],
  },
  {
    id: 'vivid_sunset',
    name: '🌅 Vivid Sunset',
    primary: '#ff5964',
    secondary: '#ffe74c',
    accent: '#35a7ff',
    colors: ['#ff5964', '#ffe74c', '#6bf178', '#35a7ff', '#9b5de5', '#f15bb5'],
  },
  {
    id: 'pure_monochrome',
    name: '🏁 Pure Black & White (Monochrome)',
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#27272a',
    colors: ['#000000', '#ffffff', '#18181b', '#f4f4f5', '#27272a', '#e4e4e7'],
  },
  {
    id: 'monochrome_noir',
    name: '🖤 Minimalist Noir & Slate',
    primary: '#18181b',
    secondary: '#a1a1aa',
    accent: '#e4e4e7',
    colors: ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7'],
  },
  {
    id: 'nordic_emerald',
    name: '🌿 Minimalist Emerald & Mint',
    primary: '#064e3b',
    secondary: '#10b981',
    accent: '#a7f3d0',
    colors: ['#064e3b', '#047857', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  },
  {
    id: 'obsidian_cobalt',
    name: '🌌 Minimalist Cobalt & Midnight',
    primary: '#0f172a',
    secondary: '#0284c7',
    accent: '#38bdf8',
    colors: ['#0f172a', '#1e293b', '#0369a1', '#0284c7', '#38bdf8', '#7dd3fc'],
  },
  {
    id: 'warm_amber',
    name: '🍯 Minimalist Amber & Cream',
    primary: '#78350f',
    secondary: '#d97706',
    accent: '#fde68a',
    colors: ['#78350f', '#b45309', '#d97706', '#f59e0b', '#fbbf24', '#fde68a'],
  },
  {
    id: 'random',
    name: '🎲 Dynamic Random Theme',
    primary: '#facc15',
    secondary: '#70d6ff',
    accent: '#ff70a6',
    colors: ['#facc15', '#ff70a6', '#70d6ff', '#a7f3d0', '#d8b4fe', '#ff9f1c'],
  },
];

export function getThemePreset(schemeId?: string): ColorSchemePreset {
  if (!schemeId || schemeId === 'random') {
    const regularSchemes = COLOR_SCHEMES.filter((s) => s.id !== 'random');
    const randomPreset = regularSchemes[Math.floor(Math.random() * regularSchemes.length)];
    return { ...randomPreset, id: 'random', name: `🎲 Dynamic (${randomPreset.name})` };
  }
  return COLOR_SCHEMES.find((s) => s.id === schemeId) || COLOR_SCHEMES[0];
}

export function applyColorScheme(data: PortfolioData, schemeId: string): PortfolioData {
  const scheme = getThemePreset(schemeId);
  const colors = scheme.colors;

  const updatedCards = data.cards.map((card, idx) => ({
    ...card,
    accentColor: colors[idx % colors.length],
  }));

  const updatedProjects = data.projects.map((proj, idx) => ({
    ...proj,
    accentColor: colors[(idx + 1) % colors.length],
  }));

  const updatedSkills = data.skills.map((skill, idx) => ({
    ...skill,
    badgeColor: colors[idx % colors.length],
  }));

  return {
    ...data,
    colorScheme: schemeId,
    customization: {
      ...data.customization,
      colorScheme: schemeId,
      layoutMode: data.customization?.layoutMode || 'bento',
      gridColumns: data.customization?.gridColumns || 4,
      gridGap: data.customization?.gridGap || 20,
      shadowOffset: data.customization?.shadowOffset || 4,
      borderWidth: data.customization?.borderWidth || 2,
      enableAnimations: data.customization?.enableAnimations ?? true,
    },
    cards: updatedCards,
    projects: updatedProjects,
    skills: updatedSkills,
  };
}

export function randomizeCardColors(data: PortfolioData): PortfolioData {
  return applyColorScheme(data, 'random');
}
