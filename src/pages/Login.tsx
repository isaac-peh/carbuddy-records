import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

// ── Icons ──────────────────────────────────────────────────────────────────

const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 .38-1.22L6 4h12l2.62 3.78A2 2 0 0 1 21 9v6a2 2 0 0 1-2 2z"/>
    <path d="M17 17v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-2"/>
    <path d="M7 17v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2"/>
    <circle cx="7.5" cy="13.5" r="1.5"/>
    <circle cx="16.5" cy="13.5" r="1.5"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

// ── Component ──────────────────────────────────────────────────────────────

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/workshop");
  };

  return (
    <div className="login-root">
      {/* Background atmosphere */}
      <div className="login-bg-glow" />
      <div className="login-bg-grid" />
      <div className="login-grain" />

      <div className="login-content">

        {/* Brand mark */}
        <div className="login-block" style={{ animationDelay: "0ms" }}>
          <div className="login-brand">
            <div className="login-logo-icon">
              <CarIcon />
            </div>
            <div>
              <div className="login-brand-name">MOBILIS</div>
              <div className="login-brand-sub">Workshop Suite</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="login-block" style={{ animationDelay: "80ms" }}>
          <div className="login-divider-line" />
        </div>

        {/* Headline */}
        <div className="login-block" style={{ animationDelay: "160ms" }}>
          <div className="login-headline">
            <h1>
              Welcome<br />back.
            </h1>
            <p>Sign in to your workshop account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="login-block login-field" style={{ animationDelay: "240ms" }}>
            <label className="login-label" htmlFor="email">
              Email address
            </label>
            <div className="login-input-wrap">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@workshop.com"
                required
                className={`login-input${focused === "email" ? " focused" : ""}`}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-block login-field" style={{ animationDelay: "300ms" }}>
            <div className="login-label-row">
              <label className="login-label" htmlFor="password">
                Password
              </label>
              <button type="button" className="login-forgot">
                Forgot?
              </button>
            </div>
            <div className="login-input-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`login-input has-toggle${focused === "password" ? " focused" : ""}`}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="login-block" style={{ animationDelay: "360ms" }}>
            <div className="login-remember-row">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" className="login-remember-label">
                Keep me signed in
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="login-block" style={{ animationDelay: "420ms" }}>
            <button type="submit" className="login-submit">
              <span>Sign in</span>
              <ArrowRightIcon />
            </button>
          </div>

        </form>

        {/* Footer */}
        <div className="login-block login-footer" style={{ animationDelay: "480ms" }}>
          Need access?{" "}
          <button type="button" className="login-contact">
            Contact sales
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
