import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useJoinList } from "../features/todos/hooks/useJoinList";
import Loader from "../components/ui/loader/Loader";


export const Join = () => {
  const { code } = useParams<{ code: string }>();
  const { user, loading } = useAuth();
  const joinMutation = useJoinList();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    // Si no hay usuario autenticado, guardamos el código y redirigimos al login
    if (!user) {
      if (code) {
        sessionStorage.setItem("pendingJoinCode", code);
      }
      navigate("/login", { replace: true });
      return;
    }

    // Si el usuario está autenticado, intentamos procesar la unión
    if (code) {
      joinMutation.mutate(code, {
        onSuccess: () => {
          sessionStorage.removeItem("pendingJoinCode");
          navigate("/dashboard", { replace: true });
        },
        onError: (err: Error) => {
          setError(err.message || "No se pudo unirse a la lista.");
        },
      });
    }
  }, [user, loading, code, joinMutation, navigate]);

  if (loading || joinMutation.isPending) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-950 text-white">
        <Loader />
        <p className="mt-4 text-gray-400 text-sm">Uniéndose a la lista...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-950 text-white p-4">
        <div className="bg-gray-900 border border-red-500/50 p-6 rounded-lg text-center max-w-sm">
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Error al unirse
          </h2>
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard", { replace: true })}
            className="bg-[#1163c2] hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-colors text-white"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
};
