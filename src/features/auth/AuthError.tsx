export const AuthError = ({
  error,
  onClear,
}: {
  error: string;
  onClear: () => void;
}) => {
  return (
    <div>
      <h1>Autenticacion</h1>
      <p>✗ Autenticacion fallida.</p>
      <p>{error}</p>
      <button onClick={onClear}>Regresar a login.</button>
    </div>
  );
};
