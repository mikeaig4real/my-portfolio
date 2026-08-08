'use client';

import { useEffect } from 'react';
import { BentoCardConfig } from '@/types/portfolio';

export function useScrollToCard(
  lastAddedCardId: string | null,
  cards: BentoCardConfig[],
  onClear: () => void
) {
  useEffect(() => {
    if (!lastAddedCardId) return;

    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-bento-card-id="${lastAddedCardId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    const clearTimer = setTimeout(() => {
      onClear();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(clearTimer);
    };
  }, [lastAddedCardId, cards, onClear]);
}
