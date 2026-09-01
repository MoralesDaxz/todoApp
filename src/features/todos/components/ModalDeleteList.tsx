import { AnimatePresence, motion } from "framer-motion";
import { useState, type Dispatch, type FC, type SetStateAction } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { useLists } from "../hooks/useLists";
import { ErrorMessage } from "../../../components/ui/errorMessage/ErrorMessage";


interface list {
  id: string;
  name: string;
}
interface Props {
  listToDelete: { id: string; name: string } | null;
  setListToDelete: Dispatch<SetStateAction<list | null>>;
}
export const ModalDeleteList: FC<Props> = ({
  listToDelete,
  setListToDelete,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { deleteList, deletingListId } = useLists();

  const confirmDelete = async () => {
    if (!listToDelete) return;

    setErrorMessage(null);
    const result = await deleteList(listToDelete.id);

    if (!result.success) {
      setErrorMessage(result.error || "No se pudo eliminar la lista.");
    }

    setListToDelete(null);
  };
  return (
    <>
      <ErrorMessage message={errorMessage} />

      {listToDelete && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
              className="absolute inset-0"
              onClick={() => setListToDelete(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10 bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-sm w-full shadow-2xl text-white flex flex-col items-center text-center"
            >
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-full text-red-400 mb-4">
                <HiExclamationTriangle className="text-3xl" />
              </div>

              <h3 className="text-xl font-bold mb-2">¿Eliminar lista?</h3>
              <p className="text-sm text-gray-300 mb-6">
                Esta acción eliminará permanentemente la lista{" "}
                <span className="font-semibold text-white">
                  "{listToDelete.name}"
                </span>{" "}
                y todas sus tareas asociadas.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setListToDelete(null)}
                  className="flex-1 py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingListId === listToDelete.id}
                  className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {deletingListId === listToDelete.id
                    ? "Eliminando..."
                    : "Eliminar"}
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
};
