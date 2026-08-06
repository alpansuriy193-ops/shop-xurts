import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Heart, Package, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/i18n/LanguageContext";

export const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    (supabase as any).rpc("is_admin").then(({ data }: { data: boolean | null }) => setIsAdmin(!!data));
  }, [user]);

  if (!user) {
    return (
      <Button asChild variant="ghost" size="sm" className="p-2" aria-label={t("userMenuSignIn")}>
        <Link to="/auth">
          <User className="w-5 h-5" />
        </Link>
      </Button>
    );
  }

  const displayName = (user.user_metadata?.display_name as string | undefined) ?? user.email ?? t("authAccount");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-accent transition-colors" aria-label={t("userMenuAccountMenu")}>
          <User className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-none">
        <DropdownMenuLabel className="font-normal">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{t("userMenuSignedInAs")}</p>
          <p className="text-sm truncate">{displayName}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/orders")} className="text-xs tracking-[0.1em] uppercase cursor-pointer">
          <Package className="w-4 h-4 mr-2" /> {t("userMenuMyOrders")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/products")} className="text-xs tracking-[0.1em] uppercase cursor-pointer">
          <Heart className="w-4 h-4 mr-2" /> {t("userMenuShop")}
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/products")} className="text-xs tracking-[0.1em] uppercase cursor-pointer">
              <Settings className="w-4 h-4 mr-2" /> Kelola Produk
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => { await signOut(); navigate("/"); }}
          className="text-xs tracking-[0.1em] uppercase cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" /> {t("userMenuSignOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
