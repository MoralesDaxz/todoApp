import { useEffect, useRef, useState } from "react";
import { useLists } from "../hooks/useLists";
import { useJoinList } from "../hooks/useJoinList";
import { ErrorMessage } from "../../../components/ui/errorMessage/ErrorMessage";
import { AnimatePresence, motion } from "framer-motion";
import { TbEdit, TbPlugConnected } from "react-icons/tb";


export const CreateOrJoinList = () => {
  const joinMutation = useJoinList();
  const { createMutation } = useLists();
  const [joinCode, setJoinCode] = useState("");
  const [actionType, setActionType] = useState<"create" | "join" | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createMutation.mutate(newListName);
    setNewListName("");
  };

  const handleJoinList = () => {
    if (!joinCode.trim()) return;
    setJoinError(null);

    joinMutation.mutate(joinCode, {
      onSuccess: () => {
        setJoinCode("");
      },
      onError: (err: Error) => {
        setJoinError(err.message || "No se pudo unirse a la lista.");
      },
    });
  };

  // Foco automático con delay para esperar el renderizado de la animación
  useEffect(() => {
    if (actionType && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [actionType]);

  const handleSelectOption = (type: "create" | "join") => {
    setJoinError(null);
    // Si hace clic en la opción activa, se oculta; de lo contrario cambia la opción
    setActionType((prev) => (prev === type ? null : type));
  };

  return (
    <div className="flex flex-col items-center mb-8 w-full">
      {/* Botones de Selección */}
      <div className="w-full flex text-[1rem] gap-2 mb-2 bg-gray-950 p-2 rounded-lg border border-gray-800 text-sm">
        <button
          onClick={() => handleSelectOption("create")}
          className={`w-full flex justify-center items-center gap-3 px-2 py-4 rounded-md transition-all duration-200 ${
            actionType === "create"
              ? "bg-[#1163c2] text-white font-medium shadow-md"
              : "bg-gray-700 text-gray-200 hover:text-white"
          }`}
        >
          <span>
            <TbEdit className="w-6 h-6 text-gray-100" />
          </span>
          <p className="text-center">Crear Lista</p>
        </button>

         <button
          onClick={() => handleSelectOption("join")}
          className={`w-full flex justify-center items-center gap-3 px-1 py-4 rounded-md transition-all duration-200 ${
            actionType === "join"
              ? "bg-[#1163c2] text-white font-medium shadow-md"
              : "bg-gray-700 text-gray-200 hover:text-white"
          }`}
        >
          <p className="text-center">Unirse a Lista</p>
          <span>
            <TbPlugConnected className="w-6 h-6 text-gray-100" />
          </span>
        </button>
      </div>

      {/* Entrada con Animación de Despliegue */}
      <AnimatePresence mode="wait">
        {actionType && (
          <motion.div
            key={actionType}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-[90%] overflow-hidden"
          >
            <div className="p-3 rounded-lg flex items-center bg-gray-900 border border-gray-500 gap-2 my-1">
              {actionType === "create" ? (
                <>
                  <input
                    ref={inputRef}
                    className="w-full outline-none text-lg px-2 bg-transparent text-white"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Lista de ..."
                    onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
                    maxLength={30}
                  />
                  <button
                    className={`bg-[#1163c2] hover:bg-blue-500 px-4 py-2 rounded-md font-medium text-sm text-white transition-colors disabled:opacity-50 shrink-0`}
                    disabled={createMutation.isPending}
                    onClick={handleCreateList}
                  >
                    {createMutation.isPending ? "Creando..." : "Crear"}
                  </button>
                </>
              ) : (
                <>
                  <input
                    ref={inputRef}
                    className="w-full outline-none text-lg px-2 bg-transparent text-white font-mono uppercase tracking-wider placeholder:normal-case placeholder:font-sans"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Introduce el código"
                    onKeyDown={(e) => e.key === "Enter" && handleJoinList()}
                  />
                  <button
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md font-medium text-sm text-white transition-colors disabled:opacity-50 shrink-0"
                    disabled={joinMutation.isPending}
                    onClick={handleJoinList}
                  >
                    {joinMutation.isPending ? "Uniéndose..." : "Unirme"}
                  </button>
                </>
              )}
            </div>
            {newListName.length >= 30 && (
              <ErrorMessage
                message={"Excedes el maximo de caracteres (30max)"}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ErrorMessage message={joinError} />
    </div>
  );
};
