import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const DefaultRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Evita parpadeos mientras se verifica el token

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
};