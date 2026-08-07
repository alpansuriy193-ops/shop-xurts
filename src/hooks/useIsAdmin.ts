import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/** True when the signed-in user has the admin role. */
export const useIsAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    (supabase as any).rpc("is_admin").then(({ data }: { data: boolean | null }) => {
      if (active) setIsAdmin(data === true);
    });
    return () => {
      active = false;
    };
  }, [user]);

  return isAdmin;
};
