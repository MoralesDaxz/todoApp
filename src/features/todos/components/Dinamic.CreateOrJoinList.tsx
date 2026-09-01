import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useLists } from "../hooks/useLists";
import { useJoinList } from "../hooks/useJoinList";
import { ErrorMessage } from "../../../components/ui/errorMessage/ErrorMessage";

interface Props {
  setPickList: Dispatch<SetStateAction<boolean>>;
}
export const CreateOrJoinList = ({ setPickList }: Props) => {
  const [joinCode, setJoinCode] = useState("");
  const [actionType, setActionType] = useState<"create" | "join">("create");
  const [joinError, setJoinError] = useState<string | null>(null);
  const { createMutation } = useLists();
  const [newListName, setNewListName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createMutation.mutate(newListName);
    setNewListName("");
  };

  const joinMutation = useJoinList();

  const handleJoinList = () => {
    if (!joinCode.trim()) return;
    setJoinError(null);

    joinMutation.mutate(joinCode, {
      onSuccess: () => {
        setJoinCode("");
        setPickList(false); 
      },
      onError: (err: Error) => {
        setJoinError(err.message || "No se pudo unirse a la lista.");
      },
    });
  };
  useEffect(() => {
    if (actionType === actionType && inputRef.current) {
      inputRef.current.focus();
    }
  }, [actionType]);

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-[90%] flex  text-[0.9rem] gap-2 mb-2 bg-gray-950 p-1 rounded-lg border border-gray-800 text-sm">
        <button
          onClick={() => {
            setActionType("create");
            setJoinError(null);
          }}
          className={`w-full px-4 py-3 rounded-md transition-colors ${
            actionType === "create"
              ? "bg-[#1163c2] text-white font-medium"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Crear Lista
        </button>
        <button
          onClick={() => {
            setActionType("join");
            setJoinError(null);
          }}
          className={`w-full px-4 py-3 rounded-md transition-colors ${
            actionType === "join"
              ? "bg-[#1163c2] text-white font-medium"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Unirse con Código
        </button>
      </div>
  
      <div className="w-[90%] p-3 rounded-lg flex items-center bg-gray-900 border border-gray-500 gap-2">
        {actionType === "create" ? (
          <>
            <input
              ref={inputRef}
              className="w-full outline-none text-lg px-2 bg-transparent text-white"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Lista de ..."
            />
            <button
              className="bg-[#1163c2] hover:bg-blue-500 px-4 py-2 rounded-md font-medium text-sm text-white transition-colors disabled:opacity-50"
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
            />
            <button
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md font-medium text-sm text-white transition-colors disabled:opacity-50"
              disabled={joinMutation.isPending}
              onClick={handleJoinList}
            >
              {joinMutation.isPending ? "Uniéndose..." : "Unirme"}
            </button>
          </>
        )}
      </div>
      <ErrorMessage message={joinError} />
    </div>
  );
};
