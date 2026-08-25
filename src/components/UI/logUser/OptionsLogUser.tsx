import { useState, type Dispatch, type SetStateAction } from "react";

import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useSupabaseAuth } from "../../../hooks/useSupabaseAuth";
import { FaUserCircle } from "react-icons/fa";

interface Props {
  setIsActiveModalOptions: Dispatch<SetStateAction<boolean>>;
  email?: string;
  nickname?: string;
}

export const OptionsLogUser = ({
  setIsActiveModalOptions,
  email,
  nickname,
}: Props) => {
  const navigate = useNavigate();
  const { handleLogout } = useSupabaseAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const onLogoutClick = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    setIsActiveModalOptions(false);
    handleLogout();
    navigate("/login", { replace: true }); // reemplazamos la entrada en el historial del navegador
  };

  return (
    <div className="relative w-72 h-auto border border-gray-300 rounded-sm pt-10 px-2 backdrop-blur-sm transition-all duration-300 bg-gray-800 text-white">
      <IoClose
        onClick={() => setIsActiveModalOptions(false)}
        className="absolute top-1 right-1 text-2xl text-gray-300 opacity-90 rounded-full bg-gray-900 p-1 cursor-pointer"
      />

      <div className=" text-[1rem] mt-2 flex flex-col items-end gap-2 px-1 py-5 rounded-sm">
      <FaUserCircle className="w-10 h-10 self-center text-gray-300" />
        {nickname && (
          <p
            className="py-3 px-2 w-full rounded-md bg-gray-900 text-center"
            title={nickname}
          >
            {nickname}
          </p>
        )}
        {email && (
          <p
            className="py-3 px-2 w-full rounded-md bg-gray-900 text-center"
            title={email}
          >
            {email}
          </p>
        )}

        <button
          onClick={onLogoutClick}
          disabled={isLoggingOut}
          className="py-2 px-3 w-full rounded-md bg-gray-400 hover:bg-gray-400  text-center transition-colors disabled:opacity-50  cursor-pointer "
        >
          {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </button>
        {/* Mensaje de error controlado en la UI */}
        {logoutError && (
          <p className="text-xs text-red-400 bg-red-950/60 border border-red-800 px-2 py-1 rounded w-full text-right">
            {logoutError}
          </p>
        )}
      </div>
    </div>
  );
};
