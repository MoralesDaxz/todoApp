export const Welcome = ({
  email,
  handleLogout,
}: {
  email: string;
  handleLogout: () => void;
}) => {
  return (
    <div>
      <h1>Bienvenid@!</h1>
      <p>Enlace confirmado: {email}</p>
      <button onClick={handleLogout}>Cerrar sesion</button>
    </div>
  );
};
