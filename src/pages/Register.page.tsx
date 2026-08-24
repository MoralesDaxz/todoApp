import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { RegisterForm } from "../features/auth/RegisterForm";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const {
    loading,
    email,
    setEmail,
    password,
    setPassword,
    nickname,
    setNickname,
    handleRegister,
  } = useSupabaseAuth();
  
  const { user } = useAuth();

  useEffect(() => {
    if (user !== null) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <RegisterForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      nickname={nickname}
      setNickname={setNickname}
      loading={loading}
      handleRegister={handleRegister}
    />
  );
};

export default Register;