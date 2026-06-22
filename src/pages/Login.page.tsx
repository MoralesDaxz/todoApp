import { Navigate } from "react-router";
import { AuthError } from "../features/auth/AuthError";
import { AuthSuccess } from "../features/auth/AuthSuccess";
import { LoginForm } from "../features/auth/LoginForm";
import { VerifyingAuth } from "../features/auth/VerifyingAuth";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";

const Login = () => {
  const {
    loading,
    email,
    setEmail,
    claims, // Asumo que claims representa al usuario logueado
    verifying,
    authError,
    authSuccess,
    handleLogin,
    clearAuthError,
  } = useSupabaseAuth();

  if (verifying) {
    return <VerifyingAuth />;
  }

  if (authError) {
    return <AuthError error={authError} onClear={clearAuthError} />;
  }

  if (authSuccess && !claims) {
    return <AuthSuccess />;
  }

  // MEJORA CRÍTICA: Redirigir en lugar de renderizar directamente
  // El 'replace' borra el /login del historial para que el botón "Atrás" no los devuelva aquí.
  if (claims) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      loading={loading}
      handleLogin={handleLogin}
    />
  );
};

export default Login;
