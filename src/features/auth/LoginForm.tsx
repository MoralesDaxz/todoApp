import { useState } from "react";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  loading: boolean;
  cooldown?: number;
  handleLogin: (
    event: React.FormEvent
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export const LoginForm = ({
  email,
  setEmail,
  loading,
  cooldown = 0,
  handleLogin,
  nickname,
  setNickname,
}: LoginFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await handleLogin(event);

    if (!result.success) {
      setErrorMessage(result.error || "Ocurrió un error al procesar tu solicitud.");
    } else {
      setSuccessMessage(result.message || "¡Enlace enviado con éxito!");
    }
  };

  return (
    <section className="px-6 pt-4 flex flex-col items-center">
      <h1 className="font-bold text-4xl">Regístrate</h1>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 max-w-sm mx-auto mt-10 w-full"
      >
        {/* Banner de Error */}
        {errorMessage && (
          <div className="bg-red-950/70 border border-red-800 text-red-300 text-sm p-3 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {/* Banner de Éxito */}
        {successMessage && (
          <div className="bg-green-950/70 border border-green-800 text-green-300 text-sm p-3 rounded-md text-center">
            {successMessage}
          </div>
        )}

        <article className="border-gray-600 backdrop-brightness-80 w-full rounded-md p-4">
          <div>
            <label className="block text-md font-medium mb-1">
              Nombre / Usuario / Apodo
            </label>
            <input
              type="text"
              placeholder="Usuario"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              maxLength={20}
              minLength={3}
              className="w-full p-2 border rounded-md outline-gray-400 bg-transparent"
            />
          </div>

          <div className="mt-6">
            <label className="block text-md font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             
              required
              className="w-full p-2 border rounded-md outline-gray-400 bg-transparent"
            />
          </div>
        </article>

        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className="bg-blue-500 text-white p-2 rounded-md font-medium hover:bg-blue-600 disabled:opacity-50 w-fit self-center shadow-2xl transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading
            ? "Enviando..."
            : cooldown > 0
            ? `Reintentar en ${cooldown}s`
            : "Enviar enlace mágico"}
        </button>
      </form>
      
      <p className="mt-8 text-sm text-gray-400 text-center">
        Accedes al confirmar el mensaje en tu correo.
      </p>
    </section>
  );
};