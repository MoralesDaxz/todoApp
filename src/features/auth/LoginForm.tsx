export const LoginForm = ({
  email,
  setEmail,
  loading,
  handleLogin,
}: {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  handleLogin: (event: React.FormEvent) => void;
}) => {
  return (
    <div>
      <h1>Bienvenid@</h1>
      <p>Accedes al confirmar el mensaje en tu correo.</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading}>
          {loading ? <span>Loading</span> : <span>Send magic link</span>}
        </button>
      </form>
    </div>
  );
};
