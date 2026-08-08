import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HiddenProductsState {
  hiddenIds: string[];
  hide: (id: string) => void;
  restoreAll: () => void;
}

/** Admin-only: demo/static products can't be deleted from the DB, so we hide them locally. */
export const useHiddenProducts = create<HiddenProductsState>()(
  persist(
    (set) => ({
      hiddenIds: [],
      hide: (id) => set((s) => (s.hiddenIds.includes(id) ? s : { hiddenIds: [...s.hiddenIds, id] })),
      restoreAll: () => set({ hiddenIds: [] }),
    }),
    { name: "xurts-hidden-products" }
  )
);

export const HIDDEN_PRODUCTS_KEY = "xurts-hidden-products";

/** Read hidden ids straight from storage (used before React mounts). */
export const readHiddenIds = (): string[] => {
  try {
    const raw = localStorage.getItem(HIDDEN_PRODUCTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const ids = parsed?.state?.hiddenIds ?? parsed?.hiddenIds;
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
};
