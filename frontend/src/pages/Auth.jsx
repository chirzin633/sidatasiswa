import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContect";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [isSignup, setIsSignup] = useState(location.pathname === "/register");
  useEffect(() => {
    setIsSignup(location.pathname === "/register");
  }, [location.pathname]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  function resetMessages() {
    setError("");
    setFieldErrors({});
  }

  function switchTab(toSignup) {
    setIsSignup(toSignup);
    resetMessages();
    navigate(toSignup ? "/register" : "/login", { replace: true });
  }

  async function handleLogin(e) {
    e.preventDefault();
    resetMessages();

    if (!loginEmail || !loginPassword) {
      setError("Email dan password wajib diisi");
      return;
    }

    setSubmitting(true);

    try {
      await login(loginEmail, loginPassword);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const res = error.response;

      if (res?.status === 401) {
        setError(res.data?.message || "Email atau password salah");
      } else if (res?.status === 422) {
        setFieldErrors(res.data?.errors || {});
        setError("Validasi gagal");
      } else {
        setError("Tidak dapat terhubung ke server");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    resetMessages();

    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setError("Semua field wajib diisi");
      return;
    }

    if (signupPassword !== signupConfirm) {
      setFieldErrors({
        password_confirmation: ["Konfirmasi password tidak cocok."],
      });
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    if (signupPassword.length < 6) {
      setFieldErrors({
        password: ["Password minimal 6 karakter"],
      });
      setError("Password minimal 6 karakter");
      return;
    }

    setSubmitting(true);

    try {
      await register(signupName, signupEmail, signupPassword, signupConfirm);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const res = error.response;
      if (res?.status === 422) {
        setFieldErrors(res.data?.errors || {});
        setError("Validasi gagal");
      } else {
        setError("Tidak dapat terhubung ke server");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function FieldError({ field }) {
    const msg = fieldErrors?.[field]?.[0];
    return msg ? (
      <span className="block mt-1 font-bold text-error-text text-xs">
        {msg}
      </span>
    ) : null;
  }

  return (
    <div className="flex justify-center items-center bg-bg-page p-6 min-h-screen font-sans">
      <div className="bg-surface shadow-brutal p-7 border-[3px] border-border-ink rounded w-full max-w-97.5 overflow-hidden">
        {/* Title */}
        <h1 className="mb-5 text-border-ink font-black text-[32px] text-center uppercase tracking-tight">
          {isSignup ? "Signup" : "Login"}
        </h1>

        {/* Tab Control */}
        <div className="relative flex bg-surface mb-6 border-[3px] border-border-ink rounded h-12.5 overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-1/2 h-full bg-accent-pink z-1 transition-all duration-300 ease-in-out ${isSignup ? "left-1/2 border-l-[3px] border-border-ink" : "border-r-[3px] border-border-ink"} `}
          />
          <button type="button" onClick={() => switchTab(false)} aria-selected={!isSignup} className="z-10 flex flex-1 justify-center items-center text-border-ink font-bold text-sm uppercase cursor-pointer select-none">
            Login
          </button>
          <button type="button" onClick={() => switchTab(true)} aria-selected={isSignup} className="z-10 flex flex-1 justify-center items-center text-border-ink font-bold text-sm uppercase cursor-pointer select-none">
            Signup
          </button>
        </div>

        {/* Global Error */}
        {error && (
          <div className="bg-error shadow-brutal-error mb-4 p-3 border-[3px] border-border-ink text-border-ink rounded font-bold text-sm">
            {error}
          </div>
        )}

        {/* Form Container */}
        {!isSignup ? (
          <div key="login" className="animate-auth-in-left">
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label
                  htmlFor="login-email"
                  className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@mail.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 border-[3px] rounded font-sans font-bold text-sm bg-surface text-border-ink outline-none transition-colors duration-100 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent-blue ${fieldErrors.email ? "border-error-text bg-red-50" : "border-border-ink focus:border-accent-blue"}`}
                />
                <FieldError field={"email"} />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="login-password"
                  className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 border-[3px] rounded font-sans font-bold text-sm bg-surface text-border-ink outline-none transition-colors duration-100 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent-blue ${fieldErrors.password ? "border-error-text bg-red-50" : "border-border-ink focus:border-accent-blue"}`}
                />
                <FieldError field={"password"} />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="disabled:opacity-60 shadow-brutal-sm hover:shadow-brutal-press active:shadow-none py-3.5 border-[3px] border-border-ink text-border-ink rounded w-full font-sans font-black text-[15px] uppercase tracking-wide transition-all hover:translate-x-0.75 hover:translate-y-0.75 active:translate-x-1.5 active:translate-y-1.5 duration-100 bg-accent-green cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? "Memproses..." : "Masuk"}
              </button>
            </form>
            <p className="mt-5 font-bold text-[11px] text-gray-600 text-center uppercase tracking-wide">
              admin@mail.com / password
            </p>
          </div>
        ) : (
          <div key="signup" className="animate-auth-in-right">
            <form onSubmit={handleSignup}>
              {[
                {
                  label: "Nama",
                  value: signupName,
                  setter: setSignupName,
                  type: "text",
                  ph: "Chirzin",
                  field: "name",
                  ac: "name",
                },
                {
                  label: "Email",
                  value: signupEmail,
                  setter: setSignupEmail,
                  type: "email",
                  ph: "chirzin@mail.com",
                  field: "email",
                  ac: "email",
                },
                {
                  label: "Password",
                  value: signupPassword,
                  setter: setSignupPassword,
                  type: "password",
                  ph: "Min. 6 karakter",
                  field: "password",
                  ac: "new-password",
                },
                {
                  label: "Konfirmasi Password",
                  value: signupConfirm,
                  setter: setSignupConfirm,
                  type: "password",
                  ph: "Ulangi password",
                  field: "password_confirmation",
                  ac: "new-password",
                },
              ].map((f) => (
                <div className="mb-4" key={f.field}>
                  <label htmlFor={`signup-${f.field}`} className="block mb-1.5 text-border-ink font-bold text-[13px] uppercase">
                    {f.label}
                  </label>
                  <input
                    id={`signup-${f.field}`}
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    placeholder={f.ph}
                    autoComplete={f.ac}
                    className={`w-full px-4 py-3 border-[3px] rounded font-sans font-bold text-sm bg-surface text-border-ink outline-none transition-colors duration-100 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent-blue ${fieldErrors[f.field] ? "border-error-text bg-red-50" : "border-border-ink focus:border-accent-blue"}`}
                  />
                  <FieldError field={f.field} />
                </div>
              ))}
              <button
                type="submit"
                disabled={submitting}
                className="disabled:opacity-60 shadow-brutal-sm hover:shadow-brutal-press active:shadow-none py-3.5 border-[3px] border-border-ink text-border-ink rounded w-full font-sans font-black text-[15px] uppercase tracking-wide transition-all hover:translate-x-0.75 hover:translate-y-0.75 active:translate-x-1.5 active:translate-y-1.5 duration-100 bg-accent-green cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? "Memproses..." : "Daftar"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
