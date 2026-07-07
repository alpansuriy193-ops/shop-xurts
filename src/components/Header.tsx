import { Link } from "react-router-dom";
import { Heart, Menu, X, Trash2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { CartIcon } from "@/components/CartIcon";
import { SearchDialog } from "@/components/SearchDialog";
import { UserMenu } from "@/components/UserMenu";
import { collections } from "@/data/products";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { items, removeItem } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <nav className="container-full">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif italic text-2xl md:text-3xl tracking-tight text-foreground hover:text-primary transition-colors duration-300"
          >
            xurts_shop
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground">
                    Collections
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {collections.map((collection) => (
                        <li key={collection.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/products?collection=${collection.slug}`}
                              className={cn(
                                "block select-none space-y-1 rounded-sm p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {collection.name}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {collection.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              to="/products"
              className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline"
            >
              Shop All
            </Link>

            <Link
              to="/about"
              className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline"
            >
              About
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-accent transition-colors duration-300 group"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </button>

            {/* User Menu */}
            <UserMenu />

            {/* Wishlist Icon with Drawer */}
            <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
              <SheetTrigger asChild>
                <button
                  className="relative p-2 hover:bg-accent transition-colors duration-300 group"
                  aria-label="Open wishlist"
                >
                  <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <AnimatePresence>
                    {items.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center"
                      >
                        {items.length > 9 ? "9+" : items.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="px-6 py-5 border-b border-border">
                  <SheetTitle className="font-serif text-2xl flex items-baseline gap-2">
                    Wishlist
                    <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <Heart className="w-10 h-10 text-muted-foreground/40 mb-4" />
                    <p className="font-serif text-xl text-foreground mb-2">
                      Your wishlist is empty
                    </p>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                      Simpan barang favorit dari parfum, fashion, sepatu, aksesoris, hingga elektronik untuk dilihat lagi nanti.
                    </p>
                    <SheetClose asChild>
                      <Button asChild className="rounded-none px-8 py-5 text-xs tracking-[0.15em] uppercase">
                        <Link to="/products">Browse Products</Link>
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 group border-b border-border/60 pb-4 last:border-0"
                        >
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={() => setWishlistOpen(false)}
                            className="w-20 h-24 flex-shrink-0 overflow-hidden bg-muted/50"
                          >
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>
                          <div className="flex-1 min-w-0 flex flex-col">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={() => setWishlistOpen(false)}
                              className="font-serif text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <p className="text-sm font-medium text-foreground">
                                ${item.price.toLocaleString()}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-muted-foreground hover:text-primary transition-colors p-1"
                                aria-label={`Remove ${item.name} from wishlist`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border px-6 py-4">
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full rounded-none py-5 text-xs tracking-[0.15em] uppercase"
                        >
                          <Link to="/products">Continue Shopping</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>

            {/* Cart Icon */}
            <CartIcon />

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-accent transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="py-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground/50 px-2 mb-3">
                    Collections
                  </p>
                  {collections.slice(0, 6).map((collection, i) => (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={`/products?collection=${collection.slug}`}
                        className="block px-2 py-2.5 text-sm hover:bg-accent transition-colors duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {collection.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="pt-6 border-t border-border space-y-1">
                  {[
                    { to: "/products", label: "Shop All" },
                    { to: "/about", label: "About" },
                    { to: "/cart", label: "Shopping Bag" },
                  ].map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        className="block px-2 py-2.5 text-sm font-medium hover:bg-accent transition-colors duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
