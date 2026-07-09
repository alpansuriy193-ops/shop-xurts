ALTER TABLE public.wishlist_items
  ADD CONSTRAINT wishlist_items_user_product_unique UNIQUE (user_id, product_id);