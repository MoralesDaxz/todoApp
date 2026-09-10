import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useSupabaseAuth } from "../features/auth/hooks/useSupabaseAuth";
import { LoginForm } from "../features/auth/components/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    loading,
    email,
    setEmail,
    password,
    setPassword,
    handleMagicLinkLogin,
    handlePasswordLogin,
    cooldown,
  } = useSupabaseAuth();

  useEffect(() => {
    // Redirigir SOLO si el usuario está autenticado
    if (user) {
      const pendingCode = sessionStorage.getItem("pendingJoinCode");

      if (pendingCode) {
        navigate(`/join/${pendingCode}`, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      cooldown={cooldown}
      handleMagicLinkLogin={handleMagicLinkLogin}
      handlePasswordLogin={handlePasswordLogin}
    />
  );
};

export default Login;