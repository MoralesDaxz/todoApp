import { useState, useEffect } from "react";
import { supabase } from "../config/supabase/supabaseClient";

export const useSupabaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
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
          type:
            (type as
              | "email"
              | "magiclink"
              | "signup"
              | "invite"
              | "recovery") || "email",
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
      supabase.auth.getClaims().then(({ data }) => {
        setClaims(data?.claims || null);
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nickname.trim()) {
      alert("Por favor, ingresa un apodo.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          nickname: nickname.trim(), // 2. Se guarda en user_metadata
        },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("¡Revisa tu correo para el enlace de acceso!");
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
    setNickname,
    nickname
  };
};
