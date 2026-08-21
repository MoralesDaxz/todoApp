import { useState, useEffect } from "react";
import { supabase } from "../config/supabase/supabaseClient";

// Regex para validación estricta de correo electrónico
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Solo alfanuméricos, guiones y sin espacios (entre 3 y 20 caracteres)
const NICKNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

export const useSupabaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [claims, setClaims] = useState<unknown>(null);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState(false);
  // 1. Inicialización limpia del estado: si la URL trae token_hash, nace en true
  const [verifying, setVerifying] = useState(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("token_hash");
  });

  // Cooldown de seguridad para evitar spam de Magic Links
  const [cooldown, setCooldown] = useState(0);

  // Manejo del contador de cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type");

    if (token_hash) {
      supabase.auth
        .verifyOtp({
          token_hash,
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
            setAuthError(
              error.message.includes("expired")
                ? "El enlace ha expirado. Por favor, solicita uno nuevo."
                : error.message
            );
          } else {
            setAuthSuccess(true);
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .finally(() => {
          // Solo se ejecuta en la respuesta asíncrona (callback)
          setVerifying(false);
        });
    }

    supabase.auth.getClaims().then(({ data }) => {
      setClaims(data?.claims || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        supabase.auth.getClaims().then(({ data }) => {
          setClaims(data?.claims || null);
        });
      } else {
        setClaims(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // LOGIN SEGURO
  // src/hooks/useSupabaseAuth.ts

const handleLogin = async (
  event: React.FormEvent
): Promise<{ success: boolean; error?: string; message?: string }> => {
  event.preventDefault();

  const cleanEmail = email.trim().toLowerCase();
  const cleanNickname = nickname.trim();

  // Validaciones locales
if (!cleanNickname) {
      return { success: false, error: "Ingresa un apodo." };
    }

    if (!NICKNAME_REGEX.test(cleanNickname)) {
      return {
        success: false,
        error: "El usuario no puede contener espacios ni caracteres especiales (3 a 20 caracteres).",
      };
    }

    // 2. Validación del Correo
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      return { success: false, error: "Ingresa un correo electrónico válido." };
    }

  if (cooldown > 0) {
    return {
      success: false,
      error: `Debes esperar ${cooldown} segundos antes de solicitar otro enlace.`,
    };
  }

  setLoading(true);

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          nickname: cleanNickname,
        },
      },
    });

    if (error) {
      // 1. Si Supabase limita las peticiones, activamos el cooldown en la UI
      if (error.message.toLowerCase().includes("rate limit")) {
        setCooldown(60);
        return {
          success: false,
          error: "Has superado el límite de intentos. Por favor espera un minuto antes de reintentar.",
        };
      }

      return { success: false, error: error.message };
    }

    // 2. Si todo fue correcto, activamos el cooldown
    setCooldown(60);

    return {
      success: true,
      message: "Te hemos enviado un enlace de acceso a tu correo.",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error inesperado de red";
    return { success: false, error: msg };
  } finally {
    setLoading(false);
  }
};

  // LOGOUT SEGURO
  const handleLogout = async (): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Revoca el token en el servidor de Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      // Limpieza total de variables en estado
      setClaims(null);
      setEmail("");
      setNickname("");

      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al cerrar sesión";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const clearAuthError = () => {
    setAuthError("");
    window.history.replaceState({}, document.title, window.location.pathname);
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
    nickname,
    cooldown,
  };
};