
import { useSupabaseAuth } from "../features/auth/hooks/useSupabaseAuth";
import { LoginForm } from "../features/auth/components/LoginForm";

const Login = () => {
/*   const navigate = useNavigate();
  const { user } = useAuth(); */
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