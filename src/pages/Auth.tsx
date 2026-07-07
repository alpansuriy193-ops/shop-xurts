import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.string().trim().email("Email tidak valid").max(255);
const passwordSchema = z.string().min(6, "Password minimal 6 karakter").max(72);
const nameSchema = z.string().trim().min(1, "Nama tidak boleh kosong").max(80);

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRes = emailSchema.safeParse(signInEmail);
    const passRes = passwordSchema.safeParse(signInPassword);
    if (!emailRes.success || !passRes.success) {
      toast({ title: "Data tidak valid", description: emailRes.error?.issues[0]?.message ?? passRes.error?.issues[0]?.message });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: emailRes.data, password: passRes.data });
    setLoading(false);
    if (error) {
      toast({ title: "Login gagal", description: error.message });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameRes = nameSchema.safeParse(signUpName);
    const emailRes = emailSchema.safeParse(signUpEmail);
    const passRes = passwordSchema.safeParse(signUpPassword);
    if (!nameRes.success || !emailRes.success || !passRes.success) {
      toast({
        title: "Data tidak valid",
        description: nameRes.error?.issues[0]?.message ?? emailRes.error?.issues[0]?.message ?? passRes.error?.issues[0]?.message,
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: emailRes.data,
      password: passRes.data,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: nameRes.data },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up gagal", description: error.message });
    } else {
      toast({ title: "Akun berhasil dibuat", description: "Selamat datang di xurts_shop." });
      navigate("/");
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast({ title: "Google sign-in gagal", description: result.error.message });
    }
  };

  return (
    <Layout>
      <section className="container-full py-16 md:py-24 min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-3">Account</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground">Welcome</h1>
            <p className="text-sm text-muted-foreground mt-3">
              Masuk atau daftar untuk menyimpan wishlist dan menulis review.
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none h-11">
              <TabsTrigger value="signin" className="text-xs tracking-[0.15em] uppercase rounded-none">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-xs tracking-[0.15em] uppercase rounded-none">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-8">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="si-email" className="text-[11px] tracking-[0.2em] uppercase">Email</Label>
                  <Input id="si-email" type="email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} className="rounded-none h-11" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-pass" className="text-[11px] tracking-[0.2em] uppercase">Password</Label>
                  <Input id="si-pass" type="password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} className="rounded-none h-11" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-none py-6 text-xs tracking-[0.15em] uppercase">
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-8">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="su-name" className="text-[11px] tracking-[0.2em] uppercase">Nama</Label>
                  <Input id="su-name" value={signUpName} onChange={(e) => setSignUpName(e.target.value)} className="rounded-none h-11" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email" className="text-[11px] tracking-[0.2em] uppercase">Email</Label>
                  <Input id="su-email" type="email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} className="rounded-none h-11" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-pass" className="text-[11px] tracking-[0.2em] uppercase">Password</Label>
                  <Input id="su-pass" type="password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} className="rounded-none h-11" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-none py-6 text-xs tracking-[0.15em] uppercase">
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button variant="outline" onClick={handleGoogle} className="w-full rounded-none py-6 text-xs tracking-[0.15em] uppercase gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/" className="hover:text-foreground transition-colors">← Kembali ke Home</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;