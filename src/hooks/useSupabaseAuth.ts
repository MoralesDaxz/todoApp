import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const useSupabaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [claims, setClaims] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);

  // Check URL params on initial render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");

    if (token_hash) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVerifying(true);
      // Verify the OTP token
      supabase.auth
        .verifyOtp({
          token_hash,
          type: type || "email",
        })
        .then(({ error }) => {
          if (error) {
            setAuthError(error.message);
          } else {
            setAuthSuccess(true);
            // Clear URL params
            window.history.replaceState({}, document.title, "/");
          }
          setVerifying(false);
        });
    }

    // Check for existing session using getClaims
    supabase.auth.getClaims().then(({ data: { claims } }) => {
      setClaims(claims);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getClaims().then(({ data: { claims } }) => {
        setClaims(claims);
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setClaims(null);
  };

  const clearAuthError = () => {
    setAuthError("");
    window.history.replaceState({}, document.title, "/");
  };

  return {
    loading,
    email,
    setEmail,
    claims,
    verifying,
    authError,
    authSuccess,
    handleLogin,
    handleLogout,
    clearAuthError,
  };
};
