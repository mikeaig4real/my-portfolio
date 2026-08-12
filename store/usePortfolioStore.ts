import { create } from 'zustand';
import { PortfolioData, CheckpointSnapshot } from '@/types/portfolio';
import { defaultPortfolioData } from '@/lib/defaultData';
import { randomizeCardColors } from '@/lib/colorPalettes';
import { STORAGE_KEYS, APP_CONSTANTS } from '@/lib/constants';
import { logger } from '@/lib/logger';

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

/** Strips any accidental `checkpoints` key before sending data to the API / DB */
function sanitizePortfolioData(data: PortfolioData): PortfolioData {
  const clean = Object.assign({}, data as unknown as Record<string, unknown>);
  delete clean['checkpoints'];
  return clean as unknown as PortfolioData;
}

let autoSaveDebounceTimer: ReturnType<typeof setTimeout> | null = null;

export const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  data: defaultPortfolioData,
  loading: true,
  isDrawerOpen: false,
  dataSource: 'default',
  autoSaveEnabled: false,
  checkpoints: [],

  setIsDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),

  setData: (updatedData: PortfolioData) => {
    const sanitized = sanitizePortfolioData(updatedData);
    set({ data: sanitized });

    // Always update localStorage instantly (0ms delay) so UI & refreshes are bulletproof
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PORTFOLIO_DRAFT, JSON.stringify(sanitized));
    }

    // Debounce the heavy server API network sync & checkpoint creation by 1500ms
    if (get().autoSaveEnabled) {
      if (autoSaveDebounceTimer) {
        clearTimeout(autoSaveDebounceTimer);
      }
      autoSaveDebounceTimer = setTimeout(() => {
        autoSaveDebounceTimer = null;
        get().savePortfolio(sanitized);
      }, APP_CONSTANTS.AUTO_SAVE_DEBOUNCE_MS);
    }
  },

  /**
   * Toggles autoSave at the store level AND persists the setting inside
   * `data.customization.autoSaveEnabled` so it survives a DB round-trip.
   */
  setAutoSaveEnabled: (enabled: boolean) => {
    if (!enabled && autoSaveDebounceTimer) {
      clearTimeout(autoSaveDebounceTimer);
      autoSaveDebounceTimer = null;
    }
    const currentData = get().data;
    const updatedData: PortfolioData = {
      ...currentData,
      customization: {
        layoutMode: currentData.customization?.layoutMode || 'bento',
        gridColumns: currentData.customization?.gridColumns ?? 4,
        gridGap: currentData.customization?.gridGap ?? 16,
        shadowOffset: currentData.customization?.shadowOffset ?? 4,
        borderWidth: currentData.customization?.borderWidth ?? 2,
        colorScheme: currentData.customization?.colorScheme || 'cyber_yellow',
        enableAnimations: currentData.customization?.enableAnimations ?? true,
        fontFamily: currentData.customization?.fontFamily || 'font-mono',
        autoSaveEnabled: enabled,
      },
    };
    set({ autoSaveEnabled: enabled, data: updatedData });
    // Persist the setting immediately to DB so it survives page reload
    get().savePortfolio(updatedData);
  },

  createCheckpoint: (name: string) => {
    const currentData = get().data;
    const newCheckpoint: CheckpointSnapshot = {
      id: `ckpt-${Date.now()}`,
      name: name || `Checkpoint ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      // Deep-clone the current data snapshot — checkpoints key must NOT be here
      data: JSON.parse(JSON.stringify(sanitizePortfolioData(currentData))),
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
      // Restore data but keep the CURRENT checkpoints list untouched
      const restoredData = sanitizePortfolioData(target.data);
      set({ data: restoredData });
      // Restore autoSave from the customization embedded in that snapshot
      const autoSave = restoredData.customization?.autoSaveEnabled ?? get().autoSaveEnabled;
      set({ autoSaveEnabled: autoSave });
      get().savePortfolio(restoredData);
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

    // Always reload checkpoints from localStorage first (they are checkpoint-isolated)
    if (typeof window !== 'undefined') {
      const savedCkpts = localStorage.getItem(STORAGE_KEYS.CHECKPOINTS);
      if (savedCkpts) {
        try {
          set({ checkpoints: JSON.parse(savedCkpts) });
        } catch {
          // corrupt data — ignore
        }
      }
    }

    try {
      const res = await fetch('/api/portfolio');
      const json = await res.json();
      if (json.success && json.data) {
        const fetchedData: PortfolioData = sanitizePortfolioData(json.data);
        // Restore autoSaveEnabled from the persisted customization field
        const persistedAutoSave = fetchedData.customization?.autoSaveEnabled ?? false;
        set({
          data: fetchedData,
          dataSource: json.source === 'mongodb' ? 'mongodb' : 'default',
          autoSaveEnabled: persistedAutoSave,
          loading: false,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.PORTFOLIO_DRAFT, JSON.stringify(fetchedData));
        }
        return;
      }
    } catch (err) {
      logger.warn('Failed to fetch portfolio from API, falling back to localStorage', err);
    }

    // Fallback: localStorage draft
    const saved =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.PORTFOLIO_DRAFT) : null;
    if (saved) {
      try {
        const parsedDraft: PortfolioData = sanitizePortfolioData(JSON.parse(saved));
        const persistedAutoSave = parsedDraft.customization?.autoSaveEnabled ?? false;
        set({
          data: parsedDraft,
          dataSource: 'localStorage',
          autoSaveEnabled: persistedAutoSave,
        });
      } catch {
        set({ data: defaultPortfolioData, dataSource: 'default' });
      }
    } else {
      set({ data: defaultPortfolioData, dataSource: 'default' });
    }
    set({ loading: false });
  },

  savePortfolio: async (updatedData?: PortfolioData) => {
    // Clear any queued debounced save timer since we are executing a save immediately now
    if (autoSaveDebounceTimer) {
      clearTimeout(autoSaveDebounceTimer);
      autoSaveDebounceTimer = null;
    }

    const currentData = get().data;
    // Always sanitize to ensure checkpoints NEVER reach the DB
    const targetData = sanitizePortfolioData(updatedData || currentData);

    // Create an automatic rollback checkpoint before auto-saving
    if (get().autoSaveEnabled) {
      const rollbackCheckpoint: CheckpointSnapshot = {
        id: `auto-rollback-${Date.now()}`,
        name: `🔄 Auto-Save Rollback (${new Date().toLocaleTimeString()})`,
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(sanitizePortfolioData(currentData))),
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
        body: JSON.stringify(targetData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        logger.warn('API save validation warnings/errors', { error: json.error, details: json.details });
      } else if (json.source === 'mongodb') {
        set({ dataSource: 'mongodb' });
      }
    } catch (err) {
      logger.warn('Network or server error while persisting portfolio:', err);
    }
  },

  quickRandomize: async () => {
    const currentData = get().data;
    const randomized = randomizeCardColors(currentData);
    await get().savePortfolio(randomized);
  },
}));
