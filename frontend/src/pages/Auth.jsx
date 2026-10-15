import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignup, setIsSignup] = useState(location.pathname === "/register");
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
    setError();
    setFieldErrors();
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
      await login;
    } catch (error) {}
  }

  return (
    <div className="flex justify-center items-center bg-bg-page p-6 min-h-screen font-sans">
      <div className="bg-surface shadow-brutal p-7 border-[3px] border-border-ink rounded w-full max-w-97.5 overflow-hidden">
        {/* Title */}
        <h1 className="mb-5 text-border-ink font-black text-[32px] text-center uppercase tracking-tight">
          Login
        </h1>

        {/* Tab Control */}
        <div className="relative flex bg-surface mb-6 border-[3px] border-border-ink rounded h-12.5 overflow-hidden">
          <div></div>
          <div className="z-10 flex flex-1 justify-center items-center to-border-ink font-bold text-sm uppercase cursor-pointer select-none">
            Login
          </div>
          <div className="z-10 flex flex-1 justify-center items-center to-border-ink font-bold text-sm uppercase cursor-pointer select-none">
            Signup
          </div>
        </div>
      </div>
    </div>
  );
}
