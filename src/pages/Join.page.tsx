import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useJoinList } from "../features/todos/hooks/useJoinList";
import Loader from "../components/ui/loader/Loader";
import { AnimatePresence, motion } from "framer-motion";
const STEPS = ["Verificando enlace...", "Uniendote a la lista..."];
export const Join = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const joinMutation = useJoinList();
  const { user, loading } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
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

      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < STEPS.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 400);

      try {
        const res = await joinMutation.mutateAsync(code);
        sessionStorage.removeItem("pendingJoinCode");

        setTimeout(() => {
          navigate(`/todo/${res.list_id}`, { replace: true });
        }, 1600);

        if (!res?.list_id) {
          throw new Error("No se recibió el ID de la lista desde el servidor.");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // TS reconoce 'err.message' automáticamente
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
      <Loader />

      {/* Contenedor estático para evitar desplazamientos de diseño */}
      <div className="mt-6 h-8 flex items-center justify-center relative overflow-hidden w-64">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-sm font-medium text-gray-300 absolute"
          >
            {STEPS[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Indicador de progreso con puntos */}
      <div className="flex gap-2 mt-2">
        {STEPS.map((_, index) => (
          <motion.div
            key={index}
            className={`h-1.5 rounded-full ${
              index <= currentStep ? "bg-blue-500" : "bg-gray-800"
            }`}
            animate={{
              width: index === currentStep ? 20 : 6,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};
