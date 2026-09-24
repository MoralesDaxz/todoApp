import { Route, Routes, useNavigate } from "react-router";
import Login from "./pages/Login.page";
import Register from "./pages/Register.page";
import { ForgotPage } from "./pages/Forgot.page";
import { ResetPasswordPage } from "./pages/ResetPassword.page";
import { DashBoard } from "./pages/DashBoard.page";
import { ToDo } from "./pages/ToDo.page";
import { Join } from "./pages/Join.page";
import ProtectedRoute from "./routes/ProtectedRoute";
import { supabase } from "./config/supabase/supabaseClient";
import { useEffect } from "react";
import { DefaultRedirect } from "./routes/DefaultRedirect";
import { useAuth } from "./context/AuthContext";

export const AppRouter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, user]);
  return (
    <>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/join/:code" element={<Join />} />

        {/* Rutas Protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todo/:listId"
          element={
            <ProtectedRoute>
              <ToDo />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </>
  );
};
