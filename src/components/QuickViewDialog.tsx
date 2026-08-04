import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product, collections } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QuantitySelector } from "./QuantitySelector";
import { useLanguage } from "@/i18n/LanguageContext";

interface QuickViewDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickViewDialog = ({ product, open, onOpenChange }: QuickViewDialogProps) => {
  const { t, tCollection } = useLanguage();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const collection = collections.find((c) => c.id === product.collection);
  const soldOut = product.stock === 0;
  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;
  const inWishlist = isInWishlist(product.id);

  const handleAdd = () => {
    if (soldOut) return;
    addToCart(product, qty);
    toast.success(t("quickViewAddedToast", { count: qty, name: product.name }));
    onOpenChange(false);
    setQty(1);
  };

  const handleWishlist = () => {
    if (inWishlist) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-none p-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">{product.description}</DialogDescription>
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-muted/40">
            <img
              src={product.images[imgIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {soldOut && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <span className="px-4 py-2 text-xs font-semibold tracking-[0.25em] uppercase bg-foreground text-background">
                  {t("quickViewSoldOut")}
                </span>
              </div>
            )}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={cn(
                      "w-6 h-0.5 transition-all",
                      i === imgIdx ? "bg-foreground" : "bg-foreground/30"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col max-h-[80vh] overflow-y-auto">
            {collection && (
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-2">
                {tCollection(collection.slug, collection.name)}
              </p>
            )}
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3 leading-tight">
              {product.name}
            </h2>
            <p className="text-lg font-serif text-foreground mb-4">
              ${product.price.toLocaleString()}
            </p>

            {lowStock && (
              <p className="text-xs tracking-[0.15em] uppercase text-primary mb-4">
                {t("quickViewOnlyLeft", { count: product.stock })}
              </p>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            {!soldOut && (
              <div className="mb-4">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                  {t("quickViewQuantity")}
                </span>
                <QuantitySelector
                  quantity={qty}
                  onQuantityChange={setQty}
                  max={product.stock ?? 10}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 mt-auto">
              <Button
                onClick={handleAdd}
                disabled={soldOut}
                className="rounded-none py-5 text-xs tracking-[0.15em] uppercase btn-premium"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {soldOut ? t("quickViewSoldOut") : t("quickViewAddToBag")}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className="rounded-none py-5 text-xs tracking-[0.1em] uppercase"
                >
                  <Heart className={cn("w-4 h-4 mr-2", inWishlist && "fill-primary text-primary")} />
                  {inWishlist ? t("quickViewSaved") : t("quickViewWishlist")}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="rounded-none py-5 text-xs tracking-[0.1em] uppercase"
                >
                  <Link to={`/product/${product.slug}`}>
                    {t("quickViewFullDetail")}
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
