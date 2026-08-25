import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password?: string;
  setPassword?: (password: string) => void;
  loading: boolean;
  cooldown?: number;
  handleMagicLinkLogin: (
    e: React.FormEvent,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  handlePasswordLogin: (
    e: React.FormEvent,
  ) => Promise<{ success: boolean; error?: string }>;
}

export const LoginForm = ({
  email,
  setEmail,
  password = "",
  setPassword = () => {},
  loading,
  cooldown = 0,
  handleMagicLinkLogin,
  handlePasswordLogin,
}: LoginFormProps) => {
  const [loginMethod, setLoginMethod] = useState<"magic" | "password">("password");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [typePass, setTypePass] = useState("password");
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (loginMethod === "magic") {
      const result = await handleMagicLinkLogin(event);
      if (!result.success) {
        setErrorMessage(result.error || "Error al enviar el enlace.");
      } else {
        setSuccessMessage(result.message || "¡Enlace enviado con éxito!");
      }
    } else {
      const result = await handlePasswordLogin(event);
      if (!result.success) {
        setErrorMessage(result.error || "Credenciales incorrectas.");
      }
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 pt-4 flex flex-col ">
      <h1 className="font-bold text-4xl text-center">Iniciar Sesión</h1>

      {/* Selector de Método de Login */}
      <div className="flex self-center gap-3 mt-6 bg-gray-900 p-1 rounded-md border border-gray-700">
        <button
          type="button"
          onClick={() => {
            setLoginMethod("password");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 px-4 rounded text-sm font-medium transition-colors cursor-pointer ${
            loginMethod === "password"
              ? "bg-blue-400 hover:bg-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMethod("magic");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2 px-4 rounded text-sm font-medium transition-colors cursor-pointer  ${
            loginMethod === "magic"
              ? "bg-blue-400 hover:bg-blue-500 text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Enlace al correo
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 max-w-sm mx-auto mt-6 w-full"
      >
        {errorMessage && (
          <div className="bg-red-950/70 border border-red-800 text-red-300 text-sm p-3 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-950/70 border border-green-800 text-green-300 text-sm p-3 rounded-md text-center">
            {successMessage}
          </div>
        )}

        <article className="border border-gray-600 bg-gray-950 w-full rounded-md p-4">
          <div>
            <label className="block text-md font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              maxLength={70}
              placeholder="usuario@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-700 rounded-md outline-gray-400 bg-transparent text-white outline-none"
            />
          </div>

          {loginMethod === "password" && (
            <div className="mt-4">
              <label className="block text-md font-medium mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={typePass}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-700 rounded-md outline-gray-400 bg-transparent text-white outline-none"
                />
                {typePass === "password" ? (
                  <FaEye
                    onClick={() =>
                      setTypePass(typePass === "password" ? "text" : "password")
                    }
                    className="absolute top-3 right-1 cursor-pointer"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() =>
                      setTypePass(typePass === "password" ? "text" : "password")
                    }
                    className="absolute top-3 right-1 cursor-pointer"
                  />
                )}
              </div>
            </div>
          )}
        </article>

        <button
          type="submit"
          disabled={loading || (loginMethod === "magic" && cooldown > 0)}
          className="w-fit self-center bg-blue-400 text-white p-2.5 rounded-md font-medium hover:bg-blue-500 disabled:opacity-50 shadow-2xl transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading
            ? "Procesando..."
            : loginMethod === "magic" && cooldown > 0
              ? `Reintentar en ${cooldown}s`
              : loginMethod === "magic"
                ? "Enviar enlace"
                : "Iniciar sesión"}
        </button>

       
      <p className="mt-6 text-sm text-gray-400 text-center">
        No tienes una cuenta?{" "}
        <Link to="/register" className="text-blue-400 hover:underline">
          Registrate
        </Link>
        
      </p>
      </form>
    </section>
  );
};
