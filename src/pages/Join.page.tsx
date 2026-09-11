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
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (code) sessionStorage.setItem("pendingJoinCode", code);
      navigate("/login", { replace: true });
      return;
    }

    if (code) {
      joinMutation.mutate(code, {
        onSuccess: (res) => {
          sessionStorage.removeItem("pendingJoinCode");

          // Si es propietario o ya era miembro, mostramos mensaje antes de redirigir
          if (res.status === "is_owner" || res.status === "already_member") {
            setInfoMessage(res.message);
            setTimeout(() => {
              navigate(`/todo/${res.list_id}`, { replace: true });
            }, 1800);
          } else {
            // Si es una unión nueva, entra directo a la lista
            navigate(`/todo/${res.list_id}`, { replace: true });
          }
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
        <p className="mt-4 text-gray-400 text-sm">Verificando enlace...</p>
      </div>
    );
  }

  if (infoMessage) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-950 text-white p-4">
        <div className="bg-gray-900 border border-blue-500/50 p-6 rounded-lg text-center max-w-sm">
          <p className="text-blue-400 font-medium mb-2">{infoMessage}</p>
          <p className="text-gray-400 text-xs">Redirigiendo a la lista...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-950 text-white p-4">
        <div className="bg-gray-900 border border-red-500/50 p-6 rounded-lg text-center max-w-sm">
          <h2 className="text-xl font-bold text-red-400 mb-2">Aviso</h2>
          <p className="text-gray-300 text-sm mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard", { replace: true })}
            className="bg-[#1163c2] hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
};
