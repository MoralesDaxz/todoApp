import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useJoinList } from "../features/todos/hooks/useJoinList";
import { useNavigate, useParams } from "react-router";
import { StepLoader } from "../components/ui/loader/StepLoader";

const JOIN_STEPS = ["Verificando enlace...", "Uniéndote a la lista..."];

export const Join = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const joinMutation = useJoinList();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (code) sessionStorage.setItem("pendingJoinCode", code);
      navigate("/login", { replace: true });
      return;
    }

    const processJoin = async () => {
      if (!code || hasExecutedRef.current) return;
      hasExecutedRef.current = true;

      try {
        const res = await joinMutation.mutateAsync(code);
        sessionStorage.removeItem("pendingJoinCode");

        setTimeout(() => {
          navigate(`/todo/${res.list_id}`, { replace: true });
        }, 1200);

        if (!res?.list_id) {
          throw new Error("No se recibió el ID de la lista desde el servidor.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };
    processJoin();
  }, [user, loading, code, navigate, joinMutation]);

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

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-950 text-white p-4">
      <StepLoader steps={JOIN_STEPS} intervalMs={400} />
    </div>
  );
};
