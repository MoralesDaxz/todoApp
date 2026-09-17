import { FiWifiOff } from "react-icons/fi";
import { useOnlineStatus } from "../../../features/todos/hooks/useOnlineStatus";

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="absolute top-0 left-0 bg-red-600/90 w-full text-white text-xs font-medium px-2 py-3 flex justify-center items-center gap-2 text-center rounded-md  z-50">
      <FiWifiOff className="w-5 h-5" />
      <span>Modo sin conexión — Los cambios se guardarán localmente.</span>
    </div>
  );
};
