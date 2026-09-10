import { Navigate, Route, Routes } from "react-router";
import Login from "./pages/Login.page";
import Register from "./pages/Register.page";
import { DashBoard } from "./pages/DashBoard.page";
import { ToDo } from "./pages/ToDo.page";
import { Join } from "./pages/Join.page";
import ProtectedRoute from "./routes/ProtectedRoute";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/join/:code" element={<Join/>} />

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
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};