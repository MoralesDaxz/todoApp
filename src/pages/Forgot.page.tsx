import { useState } from "react";
import { Link } from "react-router";
import { useSupabaseAuth } from "../features/auth/hooks/useSupabaseAuth";
import { ErrorMessage } from "../components/ui/errorMessage/ErrorMessage";


export const ForgotPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { handleSendPasswordReset, loading } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const res = await handleSendPasswordReset(email);
    if (!res.success && res.error) {
      setError(res.error);
    } else if (res.message) {
      setMessage(res.message);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl text-white">
        <h1 className="text-2xl font-bold text-center mb-2">Recuperar Contraseña</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Ingresa tu correo registrado para recibir un enlace de restablecimiento.
        </p>

        {message ? (
          <div className="bg-blue-950/50 border border-blue-500/50 text-blue-300 p-4 rounded-md text-sm text-center mb-4">
            <p>{message}</p>
            <Link
              to="/login"
              className="inline-block mt-4 text-[#1163c2] hover:underline text-sm font-medium"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md outline-none text-white focus:border-[#1163c2] transition-colors"
              />
            </div>

            <ErrorMessage message={error} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#1163c2] hover:bg-blue-500 font-medium text-sm rounded-md transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Enviando..." : "Enviar Enlace"}
            </button>

            <div className="text-center mt-2">
              <Link to="/login" className="text-xs text-gray-400 hover:text-white transition-colors">
                ← Volver al login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};