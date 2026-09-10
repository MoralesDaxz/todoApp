import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import type { RegisterFormProps } from "../../types";

export const RegisterForm = ({
  email,
  setEmail,
  password,
  setPassword,
  nickname,
  setNickname,
  loading,
  handleRegister,
}: RegisterFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [typePass, setTypePass] = useState("password");
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await handleRegister(event);

    if (!result.success) {
      setErrorMessage(result.error || "Ocurrió un error al registrarse.");
    } else {
      setSuccessMessage(result.message || "¡Registro completado con éxito!");
    }
  };

  return (
    <section className="pt-20 max-w-4xl">
      <h1 className="font-bold text-4xl text-white text-center">
        Crear Cuenta
      </h1>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 max-w-sm mx-auto mt-8 w-full"
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

        <article className="border border-gray-600 bg-gray-950 w-full rounded-md p-4 flex flex-col gap-4">
          <div>
            <label className="block text-md font-medium mb-1 text-white">
              Nombre de Usuario / Apodo
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Tu apodo"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              maxLength={20}
              minLength={3}
              className="w-full p-2 border border-gray-700 rounded-md outline-gray-400 bg-transparent text-white"
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-1 text-white">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-700 rounded-md outline-gray-400 bg-transparent text-white"
            />
          </div>

          <div>
            <label className="block text-md font-medium mb-1 text-white">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={typePass}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={40}
                className="w-full p-2 border border-gray-700 rounded-md outline-gray-400 bg-transparent text-white"
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
        </article>

        <button
          type="submit"
          disabled={loading}
          className="w-fit self-center bg-blue-400 text-white p-2.5 rounded-md font-medium hover:bg-blue-500 disabled:opacity-50 shadow-2xl transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-400 text-center">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="text-blue-400 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  );
};
