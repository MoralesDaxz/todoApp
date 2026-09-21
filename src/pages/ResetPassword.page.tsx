import { useState } from "react";
import { useNavigate } from "react-router";
import { useSupabaseAuth } from "../features/auth/hooks/useSupabaseAuth";
import { ErrorMessage } from "../../src/components/ui/errorMessage/ErrorMessage";

export const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { handleUpdatePassword, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await handleUpdatePassword(newPassword);
    if (res.success) {
      navigate("/dashboard", { replace: true });
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl text-white">
        <h1 className="text-2xl font-bold text-center mb-2">Nueva Contraseña</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Ingresa tu nueva clave para actualizar el acceso.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Nueva Contraseña</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-md outline-none text-white focus:border-[#1163c2] transition-colors"
            />
          </div>

          <ErrorMessage message={error} />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green-600 hover:bg-green-500 font-medium text-sm rounded-md transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Actualizando..." : "Guardar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};