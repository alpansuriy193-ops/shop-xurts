import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";

/** Syncs the local wishlist with the signed-in user's server-side wishlist. */
export const WishlistSync = () => {
  const { user, loading } = useAuth();
  const syncWithUser = useWishlist((s) => s.syncWithUser);

  useEffect(() => {
    if (loading) return;
    syncWithUser(user?.id ?? null);
  }, [user?.id, loading, syncWithUser]);

  return null;
};