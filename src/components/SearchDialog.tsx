import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { products, collections } from "@/data/products";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(path);
  };

  const q = query.trim().toLowerCase();
  const matchedProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q)
      ).slice(0, 8)
    : products.filter((p) => p.featured).slice(0, 5);

  const matchedCollections = q
    ? collections.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
    : [];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Cari parfum, fashion, sepatu, elektronik..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>Tidak ada hasil untuk "{query}".</CommandEmpty>

        {matchedCollections.length > 0 && (
          <CommandGroup heading="Collections">
            {matchedCollections.map((c) => (
              <CommandItem key={c.id} value={`collection-${c.slug}`} onSelect={() => go(`/products?collection=${c.slug}`)}>
                <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{c.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedProducts.length > 0 && (
          <CommandGroup heading={q ? "Products" : "Featured"}>
            {matchedProducts.map((p) => (
              <CommandItem key={p.id} value={p.name} onSelect={() => go(`/product/${p.slug}`)}>
                <img src={p.images[0]} alt="" className="w-8 h-10 object-cover mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">${p.price.toLocaleString()} · {p.collection}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};