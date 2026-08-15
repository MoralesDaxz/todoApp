import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "./pages/Login.page";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { ToDo } from "./pages/ToDo.page";
import { DashBoard } from "./pages/DashBoard.page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  // Show login
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
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
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
