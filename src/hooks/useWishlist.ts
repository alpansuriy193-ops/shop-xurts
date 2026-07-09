import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, products as allProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';

interface WishlistState {
  items: Product[];
  userId: string | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithUser: (userId: string | null) => Promise<void>;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      addItem: (product) => {
        const { items } = get();
        if (!items.find((item) => item.id === product.id)) {
          set({ items: [...items, product] });
          const uid = get().userId;
          if (uid) {
            supabase
              .from('wishlist_items')
              .insert({ user_id: uid, product_id: product.id })
              .then(({ error }) => {
                if (error && !`${error.message}`.toLowerCase().includes('duplicate')) {
                  console.error('wishlist insert failed', error);
                }
              });
          }
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        const uid = get().userId;
        if (uid) {
          supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', uid)
            .eq('product_id', productId)
            .then(({ error }) => {
              if (error) console.error('wishlist delete failed', error);
            });
        }
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
      clearWishlist: () => set({ items: [] }),
      syncWithUser: async (userId) => {
        set({ userId });
        if (!userId) return;
        const localItems = get().items;
        // Push local-only items to the server (merge)
        if (localItems.length > 0) {
          const rows = localItems.map((p) => ({ user_id: userId, product_id: p.id }));
          const { error: upErr } = await supabase
            .from('wishlist_items')
            .upsert(rows, { onConflict: 'user_id,product_id', ignoreDuplicates: true });
          if (upErr) console.error('wishlist merge failed', upErr);
        }
        // Pull authoritative state from the server
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('product_id')
          .eq('user_id', userId);
        if (error) {
          console.error('wishlist fetch failed', error);
          return;
        }
        const productIds = new Set((data ?? []).map((r) => r.product_id));
        // Include any local items whose product still resolves, in case of merge race
        const merged = allProducts.filter((p) => productIds.has(p.id));
        set({ items: merged });
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
