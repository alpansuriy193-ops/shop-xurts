import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  /** Percent off subtotal (0-100) */
  percentOff?: number;
  /** Free shipping flag */
  freeShipping?: boolean;
  label: string;
}

export const COUPONS: Record<string, Coupon> = {
  XURTS10: { code: "XURTS10", percentOff: 10, label: "10% off" },
  NEWUSER20: { code: "NEWUSER20", percentOff: 20, label: "20% off (pengguna baru)" },
  FREESHIP: { code: "FREESHIP", freeShipping: true, label: "Gratis ongkir" },
};

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  getDiscount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, 10) }
              : item
          ),
        }));
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      applyCoupon: (code: string) => {
        const normalized = code.trim().toUpperCase();
        if (!normalized) return { ok: false, message: "Masukkan kode kupon." };
        const found = COUPONS[normalized];
        if (!found) return { ok: false, message: "Kode kupon tidak valid." };
        set({ coupon: found });
        return { ok: true, message: `Kupon ${found.code} berhasil dipakai — ${found.label}.` };
      },

      removeCoupon: () => set({ coupon: null }),

      getDiscount: () => {
        const { coupon } = get();
        if (!coupon?.percentOff) return 0;
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * (coupon.percentOff / 100));
      },
    }),
    {
      name: "maison-cart",
    }
  )
);
