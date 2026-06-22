import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const useSupabaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  // Tipamos claims explícitamente para evitar problemas de "any"
  const [claims, setClaims] = useState<unknown>(null); 
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");

    if (token_hash) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVerifying(true);
      
      supabase.auth
        .verifyOtp({
          token_hash,
          // Forzamos el tipo explícito para verifyOtp según la API de Supabase
          type: (type as "email" | "magiclink" | "signup" | "invite" | "recovery") || "email",
        })
        .then(({ error }) => {
          if (error) {
            setAuthError(error.message);
          } else {
            setAuthSuccess(true);
            window.history.replaceState({}, document.title, "/");
          }
          setVerifying(false);
        });
    }

    // CORRECCIÓN 1: Manejo seguro de nulos con Optional Chaining (?.)
    supabase.auth.getClaims().then(({ data }) => {
      setClaims(data?.claims || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // CORRECCIÓN 1: Manejo seguro de nulos aquí también
      supabase.auth.getClaims().then(({ data }) => {
        setClaims(data?.claims || null);
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
      // CORRECCIÓN 2: Supabase v2 AuthError solo utiliza 'message'
      alert(error.message);
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