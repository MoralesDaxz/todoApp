import { LoginForm } from "../features/auth/LoginForm";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";

const Login = () => {
  const {
    loading,
    email,
    setEmail,
    handleLogin,
    setNickname,
    nickname,
    cooldown,
  } = useSupabaseAuth();

  return (
    <LoginForm
      nickname={nickname}
      setNickname={setNickname}
      email={email}
      setEmail={setEmail}
      loading={loading}
      cooldown={cooldown}
      handleLogin={handleLogin}
    />
  );
};

export default Login;
