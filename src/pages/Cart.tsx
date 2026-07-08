import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Trash2, Tag, X, Check } from "lucide-react";
import { Layout } from "@/components/Layout";
import { QuantitySelector } from "@/components/QuantitySelector";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateQuantity, removeItem, getSubtotal, getDiscount, coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const freeShip = coupon?.freeShipping || subtotal - discount > 500;
  const shipping = freeShip ? 0 : 25;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(code);
    if (result.ok) {
      toast.success(result.message);
      setCode("");
    } else {
      toast.error(result.message);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-narrow py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" />
            <h1 className="font-serif text-4xl mb-4">Your Bag is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Discover our curated collection of handcrafted home goods and find
              pieces that speak to you.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase btn-premium"
            >
              <Link to="/products">
                Start Shopping
                <ArrowRight className="ml-3 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container-full py-6 border-b border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link to="/products" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground">Your Bag</span>
        </div>
      </div>

      <section className="py-10 md:py-16">
        <div className="container-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl mb-12"
          >
            Your Bag
          </motion.h1>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-7">
              <div className="space-y-0">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-6 py-8 border-b border-border"
                  >
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="w-28 h-32 md:w-36 md:h-44 flex-shrink-0 overflow-hidden bg-muted/30 group"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="font-serif text-lg md:text-xl hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.product.description}
                        </p>
                        <p className="font-serif text-lg mt-3">
                          ${item.product.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(qty) =>
                            updateQuantity(item.product.id, qty)
                          }
                        />
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-8 text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="bg-linen p-8 lg:sticky lg:top-28">
                <h2 className="font-serif text-2xl mb-8">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && coupon && (
                    <div className="flex justify-between text-sm text-primary">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Diskon ({coupon.code})
                      </span>
                      <span>−${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? "Complimentary" : `$${shipping}`}
                    </span>
                  </div>
                  {!freeShip && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders over $500
                    </p>
                  )}
                </div>

                {/* Promo code */}
                <div className="mb-6">
                  {coupon ? (
                    <div className="flex items-center justify-between gap-3 border border-primary/40 bg-primary/5 px-3 py-2.5">
                      <div className="flex items-center gap-2 text-xs">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="font-semibold tracking-[0.15em] uppercase text-foreground">
                          {coupon.code}
                        </span>
                        <span className="text-muted-foreground">— {coupon.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          removeCoupon();
                          toast("Kupon dihapus.");
                        }}
                        aria-label="Remove coupon"
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-2">
                      <label className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
                        <Tag className="w-3.5 h-3.5" />
                        Kode Promo
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Masukkan kode"
                          className="rounded-none h-11 uppercase tracking-wide"
                        />
                        <Button
                          type="submit"
                          variant="outline"
                          className="rounded-none h-11 px-5 text-xs tracking-[0.15em] uppercase"
                        >
                          Apply
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Coba <span className="text-foreground font-medium">XURTS10</span>, <span className="text-foreground font-medium">NEWUSER20</span>, atau <span className="text-foreground font-medium">FREESHIP</span>.
                      </p>
                    </form>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-8">
                  <div className="flex justify-between font-serif text-xl">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-none py-6 text-sm tracking-[0.15em] uppercase btn-premium"
                >
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-3 w-4 h-4" />
                  </Link>
                </Button>

                {/* Trust signals */}
                <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-1">
                      Shipping
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Worldwide delivery
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-1">
                      Returns
                    </p>
                    <p className="text-xs text-muted-foreground">
                      14-day policy
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
