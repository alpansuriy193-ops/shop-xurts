import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { QuantitySelector } from "@/components/QuantitySelector";
import { ProductReviews } from "@/components/ProductReviews";
import { getProductBySlug, getRelatedProducts, collections } from "@/data/products";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Rough brightness check to pick an accessible check-icon color on a swatch
const isLight = (hex: string) => {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  // Perceived luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
};

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <Layout>
        <div className="container-wide py-28 text-center">
          <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The piece you're looking for doesn't exist.
          </p>
          <Button asChild className="rounded-none px-8 text-sm tracking-[0.1em] uppercase">
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = getRelatedProducts(product.id);
  const collection = collections.find((c) => c.id === product.collection);
  const sizeLabel = product.collection === "sepatu" ? "Size (EU)" : "Size";

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been saved to your wishlist.`,
      });
    }
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Pilih ukuran dulu",
        description: `Silakan pilih ${sizeLabel.toLowerCase()} sebelum menambahkan ke keranjang.`,
      });
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Pilih warna dulu",
        description: "Silakan pilih warna sebelum menambahkan ke keranjang.",
      });
      return;
    }
    addToCart(product, quantity);
    const variantBits = [selectedSize, selectedColor].filter(Boolean).join(" · ");
    toast({
      title: "Added to bag",
      description: variantBits
        ? `${quantity} × ${product.name} (${variantBits}) added to your bag.`
        : `${quantity} × ${product.name} added to your bag.`,
    });
    setQuantity(1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container-full py-6 border-b border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link
            to="/products"
            className="hover:text-foreground transition-colors"
          >
            Shop
          </Link>
          <span className="text-border">/</span>
          {collection && (
            <>
              <Link
                to={`/products?collection=${collection.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {collection.name}
              </Link>
              <span className="text-border">/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <section className="py-10 md:py-16">
        <div className="container-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Image Gallery — Takes 7 columns */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-muted/30 group cursor-zoom-in">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                </AnimatePresence>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-background/90 backdrop-blur-md hover:bg-background transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-background/90 backdrop-blur-md hover:bg-background transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            "w-8 h-0.5 transition-all duration-500",
                            index === currentImageIndex
                              ? "bg-foreground"
                              : "bg-foreground/20 hover:bg-foreground/40"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                  {product.new && (
                    <span className="px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase bg-foreground text-background">
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-24 h-24 overflow-hidden transition-all duration-300",
                        index === currentImageIndex
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info — Takes 5 columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start"
            >
              {collection && (
                <Link
                  to={`/products?collection=${collection.slug}`}
                  className="inline-block text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-5 hover:text-primary/80 transition-colors"
                >
                  {collection.name}
                </Link>
              )}

              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-5 leading-[1.05]">
                {product.name}
              </h1>

              <p className="text-2xl font-serif text-foreground mb-8">
                ${product.price.toLocaleString()}
              </p>

              <div className="w-12 h-px bg-border mb-8" />

              <p className="text-muted-foreground leading-[1.8] mb-10">
                {product.longDescription}
              </p>

              {/* Fragrance notes (parfum) */}
              {product.notes && (
                <div className="space-y-4 mb-10 pb-10 border-b border-border">
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block">
                    Fragrance Notes
                  </span>
                  <div className="grid grid-cols-1 gap-3">
                    {product.notes.top && (
                      <div className="flex gap-4">
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary w-14 pt-0.5">Top</span>
                        <span className="text-sm text-foreground leading-relaxed">{product.notes.top}</span>
                      </div>
                    )}
                    {product.notes.heart && (
                      <div className="flex gap-4">
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary w-14 pt-0.5">Heart</span>
                        <span className="text-sm text-foreground leading-relaxed">{product.notes.heart}</span>
                      </div>
                    )}
                    {product.notes.base && (
                      <div className="flex gap-4">
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary w-14 pt-0.5">Base</span>
                        <span className="text-sm text-foreground leading-relaxed">{product.notes.base}</span>
                      </div>
                    )}
                  </div>
                  {product.volume && (
                    <div className="pt-2">
                      <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">
                        Volume
                      </span>
                      <span className="text-sm text-foreground">{product.volume}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Color swatches */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                      Color
                    </span>
                    {selectedColor && (
                      <span className="text-xs text-foreground">{selectedColor}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => {
                      const active = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          aria-label={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={cn(
                            "relative w-10 h-10 rounded-full border transition-all duration-300",
                            active
                              ? "border-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background"
                              : "border-border hover:border-foreground/60"
                          )}
                          style={{ backgroundColor: c.hex }}
                        >
                          {active && (
                            <Check
                              className={cn(
                                "w-4 h-4 absolute inset-0 m-auto",
                                isLight(c.hex) ? "text-charcoal" : "text-white"
                              )}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                      {sizeLabel}
                    </span>
                    <button className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
                      Size guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {product.sizes.map((size) => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "h-11 text-xs tracking-[0.1em] uppercase border transition-all duration-300",
                            active
                              ? "border-foreground bg-foreground text-background"
                              : "border-border hover:border-foreground"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Generic details */}
              <div className="space-y-5 mb-10 pb-10 border-b border-border">
                <div>
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">
                    {product.collection === "parfum" ? "Composition" : "Materials"}
                  </span>
                  <span className="text-sm text-foreground">{product.materials}</span>
                </div>
                {product.dimensions && (
                  <div>
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">
                      Dimensions
                    </span>
                    <span className="text-sm text-foreground">{product.dimensions}</span>
                  </div>
                )}
                {product.fit && (
                  <div>
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">
                      Fit
                    </span>
                    <span className="text-sm text-foreground leading-relaxed">{product.fit}</span>
                  </div>
                )}
                {product.care && (
                  <div>
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">
                      Care
                    </span>
                    <span className="text-sm text-foreground leading-relaxed">{product.care}</span>
                  </div>
                )}
                {product.warranty && (
                  <div>
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-1.5">
                      Warranty
                    </span>
                    <span className="text-sm text-foreground">{product.warranty}</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground block mb-3">
                  Quantity
                </span>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="rounded-none w-full py-6 text-sm tracking-[0.15em] uppercase btn-premium"
                >
                  <ShoppingBag className="w-4 h-4 mr-3" />
                  Add to Bag
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none w-full py-6 text-sm tracking-[0.1em] uppercase"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 mr-3 transition-all duration-300",
                      inWishlist && "fill-primary text-primary"
                    )}
                  />
                  {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Trust signals */}
              <div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-1">
                    Shipping
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Complimentary worldwide
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-1">
                    Returns
                  </p>
                  <p className="text-xs text-muted-foreground">
                    14-day return policy
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specifications / In the box (elektronik & similar) */}
      {(product.specs?.length || product.inTheBox?.length) && (
        <section className="py-16 md:py-20 border-t border-border">
          <div className="container-full">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-5xl">
              {product.specs && product.specs.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">
                    Specifications
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
                    Built with intent
                  </h3>
                  <dl className="divide-y divide-border">
                    {product.specs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-6 py-3.5">
                        <dt className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                          {s.label}
                        </dt>
                        <dd className="text-sm text-foreground text-right max-w-[60%]">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {product.inTheBox && product.inTheBox.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">
                    In the Box
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
                    What ships to you
                  </h3>
                  <ul className="space-y-3">
                    {product.inTheBox.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-2 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 md:py-28 bg-linen">
          <div className="container-full">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">
                  You May Also Like
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                  More from {collection?.name}
                </h2>
              </div>
              <Link
                to={`/products?collection=${collection?.slug}`}
                className="hidden md:flex items-center gap-2 text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {relatedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductReviews productId={product.id} />
    </Layout>
  );
};

export default ProductDetail;
