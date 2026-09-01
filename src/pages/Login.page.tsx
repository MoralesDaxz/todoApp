import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LoginForm } from "../features/auth/components/LoginForm";
import { useNavigate } from "react-router";
import { useSupabaseAuth } from "../features/auth/hooks/useSupabaseAuth";

const Login = () => {
  const navigate = useNavigate();
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
  
  const { user } = useAuth();

  useEffect(() => {
    if (user !== null) {
      navigate("/dashboard", { replace: true });
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