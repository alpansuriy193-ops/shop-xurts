import { create } from "zustand";

interface DeleteModeState {
  deleteMode: boolean;
  toggle: () => void;
  setDeleteMode: (value: boolean) => void;
}

/** Admin-only "pilih produk untuk dihapus" mode — reveals the X button on product cards. */
export const useDeleteMode = create<DeleteModeState>((set) => ({
  deleteMode: false,
  toggle: () => set((s) => ({ deleteMode: !s.deleteMode })),
  setDeleteMode: (value) => set({ deleteMode: value }),
}));
