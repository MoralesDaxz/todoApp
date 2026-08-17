export const LoginForm = ({
  email,
  setEmail,
  loading,
  handleLogin,
  nickname,
  setNickname,
}: {
  email: string;
  setEmail: (email: string) => void;
  nickname: string;
  setNickname: (email: string) => void;
  loading: boolean;
  handleLogin: (event: React.FormEvent) => void;
}) => {
  return (
    <section className="flex flex-col items-center">
      <h1 className="font-bold text-4xl my-6">Registrate</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 max-w-sm mx-auto mt-10 w-full"
      >
        <article className="border-gray-600 backdrop-brightness-80 shadow-2xl w-full rounded-sm p-4">
          <div className="">
            <label className="block text-md font-medium mb-1">
              Nombre / Usuario / Apodo
            </label>
            <input
              type="text"
              placeholder="Usuario"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full p-2 border rounded-md outline-gray-400"
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
              className="w-full p-2 border rounded-md outline-gray-400"
            />
          </div>
        </article>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 w-fit self-center"
        >
          {loading ? "Enviando..." : "Enviar enlace mágico"}
        </button>
      </form>
      <p className="mt-10">Accedes al confirmar el mensaje en tu correo.</p>
    </section>
  );
};
