import { create } from 'zustand';
import { PortfolioData, CheckpointSnapshot } from '@/types/portfolio';
import { defaultPortfolioData } from '@/lib/defaultData';
import { randomizeCardColors } from '@/lib/colorPalettes';
import { STORAGE_KEYS } from '@/lib/constants';

export interface PortfolioState {
  data: PortfolioData;
  loading: boolean;
  isDrawerOpen: boolean;
  dataSource: 'mongodb' | 'localStorage' | 'default';
  autoSaveEnabled: boolean;
  checkpoints: CheckpointSnapshot[];

  // Actions
  fetchPortfolio: () => Promise<void>;
  savePortfolio: (updatedData?: PortfolioData) => Promise<void>;
  quickRandomize: () => Promise<void>;
  setIsDrawerOpen: (open: boolean) => void;
  setData: (data: PortfolioData) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  createCheckpoint: (name: string) => void;
  restoreCheckpoint: (checkpointId: string) => void;
  deleteCheckpoint: (checkpointId: string) => void;
}

export const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  data: defaultPortfolioData,
  loading: true,
  isDrawerOpen: false,
  dataSource: 'default',
  autoSaveEnabled: false,
  checkpoints: [],

  setIsDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),

  setData: (updatedData: PortfolioData) => {
    set({ data: updatedData });
    if (get().autoSaveEnabled) {
      get().savePortfolio(updatedData);
    }
  },

  setAutoSaveEnabled: (enabled: boolean) => set({ autoSaveEnabled: enabled }),

  createCheckpoint: (name: string) => {
    const currentData = get().data;
    const newCheckpoint: CheckpointSnapshot = {
      id: `ckpt-${Date.now()}`,
      name: name || `Checkpoint ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(currentData)),
    };
    const updatedCheckpoints = [newCheckpoint, ...(get().checkpoints || [])];
    set({ checkpoints: updatedCheckpoints });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(updatedCheckpoints));
    }
  },

  restoreCheckpoint: (checkpointId: string) => {
    const target = get().checkpoints.find((c) => c.id === checkpointId);
    if (target) {
      set({ data: target.data });
      get().savePortfolio(target.data);
    }
  },

  deleteCheckpoint: (checkpointId: string) => {
    const updated = get().checkpoints.filter((c) => c.id !== checkpointId);
    set({ checkpoints: updated });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(updated));
    }
  },

  fetchPortfolio: async () => {
    set({ loading: true });

    // Load checkpoints from localStorage
    if (typeof window !== 'undefined') {
      const savedCkpts = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
      if (savedCkpts) {
        try {
          set({ checkpoints: JSON.parse(savedCkpts) });
        } catch {
          // ignore
        }
      }
    }

    try {
      const res = await fetch('/api/portfolio');
      const json = await res.json();
      if (json.success && json.data) {
        set({
          data: json.data,
          dataSource: json.source === 'mongodb' ? 'mongodb' : 'default',
          loading: false,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.PORTFOLIO_DRAFT, JSON.stringify(json.data));
        }
        return;
      }
    } catch {
      // fallback
    }

    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.PORTFOLIO_DRAFT) : null;
    if (saved) {
      try {
        set({ data: JSON.parse(saved), dataSource: 'localStorage' });
      } catch {
        set({ data: defaultPortfolioData, dataSource: 'default' });
      }
    } else {
      set({ data: defaultPortfolioData, dataSource: 'default' });
    }
    set({ loading: false });
  },

  savePortfolio: async (updatedData?: PortfolioData) => {
    const currentData = get().data;
    const targetData = updatedData || currentData;

    // Create an automatic rollback checkpoint snapshot before auto-saving
    if (get().autoSaveEnabled) {
      const rollbackCheckpoint: CheckpointSnapshot = {
        id: `auto-rollback-${Date.now()}`,
        name: `🔄 Auto-Save Rollback (${new Date().toLocaleTimeString()})`,
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(currentData)),
      };
      const existingCkpts = get().checkpoints || [];
      const updatedCkpts = [rollbackCheckpoint, ...existingCkpts].slice(0, 15);
      set({ checkpoints: updatedCkpts });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CHECKPOINTS, JSON.stringify(updatedCkpts));
      }
    }

    set({ data: targetData });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO_DRAFT, JSON.stringify(targetData));
    }

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.warn('API save validation warnings/errors:', json.error, json.details);
      } else if (json.source === 'mongodb') {
        set({ dataSource: 'mongodb' });
      }
    } catch (err) {
      console.warn('Network or server error while persisting portfolio:', err);
    }
  },

  quickRandomize: async () => {
    const currentData = get().data;
    const randomized = randomizeCardColors(currentData);
    await get().savePortfolio(randomized);
  },
}));
