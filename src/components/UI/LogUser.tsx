import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LogUser = () => {
  const { user } = useAuth();
  const [activeMail, setActiveMail] = useState(false);
  return (
    <span className="absolute top-1 right-1 cursor-pointer hover:opacity-80" onClick={() => setActiveMail(!activeMail)}>
      {activeMail ? (
        <p className="p-1 rounded-md bg-cyan-700 text-sm text-center">
          {user?.email}
        </p>
      ) : (
        <p className="w-fit py-1 px-2 rounded-[50%] bg-cyan-700 text-sm text-center mb-1">
          {user?.email?.substring(0, 1).toUpperCase()}
        </p>
      )}
    </span>
  );
};

export default LogUser;
