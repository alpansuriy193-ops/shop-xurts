import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Heart, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button asChild variant="ghost" size="sm" className="p-2" aria-label="Sign in">
        <Link to="/auth">
          <User className="w-5 h-5" />
        </Link>
      </Button>
    );
  }

  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-accent transition-colors" aria-label="Account menu">
          <User className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-none">
        <DropdownMenuLabel className="font-normal">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Signed in as</p>
          <p className="text-sm truncate">{displayName}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/products")} className="text-xs tracking-[0.1em] uppercase cursor-pointer">
          <Package className="w-4 h-4 mr-2" /> Shop
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
          <Heart className="w-4 h-4 mr-2" /> Wishlist (via icon)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => { await signOut(); navigate("/"); }}
          className="text-xs tracking-[0.1em] uppercase cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};