import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Car, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// ── Spinner ────────────────────────────────────────────────────────────────

const Spinner = () => (
  <svg
    className="animate-spin w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ── Stats data ─────────────────────────────────────────────────────────────

const STATS = [
  { value: "500+",  label: "Workshops" },
  { value: "99.9%", label: "Uptime"    },
  { value: "24/7",  label: "Support"   },
];

// ── Component ──────────────────────────────────────────────────────────────

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]       = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [formError, setFormError]     = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);
    try {
      // Simulate auth — replace with real call
      await new Promise((res) => setTimeout(res, 1000));
      navigate("/workshop");
    } catch {
      setFormError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left: brand panel ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden flex-shrink-0 flex-col justify-between p-12 xl:p-16"
        style={{
          background:
            "linear-gradient(160deg, hsl(222,47%,8%) 0%, hsl(222,47%,13%) 55%, hsl(218,47%,11%) 100%)",
        }}
      >
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Radial accent glow — bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-150px",
            left: "-100px",
            width: "560px",
            height: "560px",
            background:
              "radial-gradient(ellipse at center, hsl(217,91%,60%,0.07) 0%, transparent 65%)",
          }}
        />

        {/* Right-edge separator */}
        <div className="absolute right-0 inset-y-0 w-px bg-white/[0.06]" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block text-[1.05rem] font-bold text-white tracking-tight leading-none">
                Mobilis
              </span>
              <span className="block text-xs text-white/40 mt-0.5 tracking-wide">
                Workshop Suite
              </span>
            </div>
          </div>

          {/* Headline + features */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <div className="w-8 h-px bg-accent/60" />
              <h1 className="text-4xl xl:text-[2.75rem] font-bold text-white leading-[1.1] tracking-tight">
                Everything your<br />
                workshop needs,<br />
                <span className="text-accent">in one place.</span>
              </h1>
              <p className="text-white/50 text-[0.9375rem] leading-relaxed">
                Inventory, invoicing, service records and vehicle history —
                built for modern automotive workshops.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-2.5">
              {[
                "Reduce paperwork and manual errors",
                "Keep every vehicle's history in one place",
                "Build trust and transparency with customers",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/55">
                  <span className="w-1 h-1 rounded-full bg-accent/70 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="flex items-center border-t border-white/[0.08] pt-6">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex-1 ${
                    i < STATS.length - 1 ? "border-r border-white/10 pr-5 mr-5" : ""
                  }`}
                >
                  <div className="text-2xl font-bold text-white leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/35 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <p className="relative z-10 text-white/20 text-xs">
            © {new Date().getFullYear()} Mobilis Suite. All rights reserved.
          </p>

      </div>

      {/* ── Right: form panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14 min-w-0">
        <div
          className="w-full max-w-[360px] animate-fade-in"
          style={{ animationFillMode: "both" }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Mobilis Suite
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[1.6rem] font-bold text-foreground tracking-tight leading-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm mt-1.5">
              Sign in to your workshop account
            </p>
          </div>

          {/* Error banner */}
          {formError && (
            <div className="flex items-start gap-3 p-3.5 mb-6 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@workshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                  tabIndex={-1}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-11"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal text-muted-foreground cursor-pointer select-none"
              >
                Remember me for 30 days
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-semibold gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>

          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Contact sales
            </button>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
