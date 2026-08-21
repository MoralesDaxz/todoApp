import { useState } from "react";
import { FiCopy, FiCheck, FiX, FiEdit3 } from "react-icons/fi";
import { useShareList } from "../hooks/useShareList";
import { FaRegEye } from "react-icons/fa";

interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
}

export const ShareListModal = ({
  isOpen,
  onClose,
  listId,
  listName,
}: ShareListModalProps) => {
  const [role, setRole] = useState<"read" | "write">("read");
  const {
    generateCode,
    isGenerating,
    generatedCode,
    copied,
    copyToClipboard,
    resetShareState,
  } = useShareList(listId);

  if (!isOpen) return null;

  const handleClose = () => {
    resetShareState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="flex flex-col bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FiX className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-1">Compartir Lista</h2>
        <p className="text-sm text-gray-400 mb-6">{listName}</p>

        {/* Selección de Rol */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("read")}
            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium border transition-colors ${
              role === "read"
                ? "bg-[#0d488b] border-[#8dbbf0] text-white"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <p>Lectura</p>
            <FaRegEye className="w-6 h-6 text-gray-200" />
          </button>
          <button
            type="button"
            onClick={() => setRole("write")}
            className={`flex items-center gap-2 py-2 px-3 rounded-md text-sm font-medium border transition-colors ${
              role === "write"
                ? "bg-[#0d488b] border-[#8dbbf0] text-white"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <p></p>Edición
            <FiEdit3 className="w-6 h-6 text-gray-200" />
          </button>
        </div>

        {/* Generar o Mostrar Código */}
        {!generatedCode ? (
          <button
            onClick={() => generateCode(role)}
            disabled={isGenerating}
            className="w-fit self-center bg-gray-600 hover:bg-[#0d488b]  p-2.5 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isGenerating ? "Generando..." : "Generar Código de Invitación"}
          </button>
        ) : (
          <div className="flex flex-col  gap-2">
            <label className="w-fit text-xs text-gray-400">
              Código generado (Permiso:{" "}
              {role === "read" ? "Lectura" : "Edición"})
            </label>
            <div className="flex items-center gap-2 bg-gray-950 border border-gray-700 p-2 rounded-md">
              <input
                type="text"
                readOnly
                value={generatedCode}
                className="bg-transparent font-mono text-center text-lg tracking-widest text-yellow-400 flex-1 outline-none"
              />
              <button
                onClick={() => copyToClipboard(generatedCode)}
                className="bg-gray-800 hover:bg-gray-700 p-2 rounded-md text-gray-200 transition-colors flex items-center gap-1 text-sm"
              >
                {copied ? (
                  <>
                    <FiCheck className="text-green-400" /> Copiado
                  </>
                ) : (
                  <>
                    <FiCopy /> Copiar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
