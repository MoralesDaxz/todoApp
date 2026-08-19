// src/pages/DashBoard.page.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLists } from "../features/todos/hooks/useLists";
import { useAuth } from "../context/AuthContext";
import { HiTrash, HiExclamationTriangle } from "react-icons/hi2";
import { Link } from "react-router";

export const DashBoard = () => {
  const { user } = useAuth();
  const { lists, isLoading, deleteList, deletingListId } = useLists();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estado para controlar la lista seleccionada a eliminar (si es null, el modal está cerrado)
  const [listToDelete, setListToDelete] = useState<{ id: string; name: string } | null>(null);

  // Confirmar eliminación desde el modal
  const confirmDelete = async () => {
    if (!listToDelete) return;

    setErrorMessage(null);
    const result = await deleteList(listToDelete.id);

    if (!result.success) {
      setErrorMessage(result.error || "No se pudo eliminar la lista.");
    }

    // Cerramos el modal tras la acción
    setListToDelete(null);
  };

  if (isLoading) {
    return <p className="text-center mt-10 text-gray-400">Cargando listas...</p>;
  }

  return (
    <section className="p-6 max-w-4xl mx-auto relative">
      <h1 className="text-3xl font-bold mb-6 text-white">Mis Listas</h1>

      {/* Banner de error si falla la eliminación */}
      {errorMessage && (
        <div className="mb-4 text-sm text-red-300 bg-red-950/70 p-3 rounded-md border border-red-800">
          {errorMessage}
        </div>
      )}

      {/* Grid de listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map((list: { id: string; name: string; owner_id: string }) => {
          const isOwner = list.owner_id === user?.id;
          const isDeleting = deletingListId === list.id;

          return (
            <article
              key={list.id}
              className="p-4 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-between shadow-md hover:border-gray-600 transition-all"
            >
              <Link to={`/todo/${list.id}`} className="flex-1">
                <h2 className="text-lg font-semibold text-white">{list.name}</h2>
                <span className="text-xs text-gray-400">
                  {isOwner ? "Propietario" : "Compartida contigo"}
                </span>
              </Link>

              {/* Botón que abre el modal de confirmación */}
              {isOwner && (
                <button
                  onClick={() => setListToDelete({ id: list.id, name: list.name })}
                  disabled={isDeleting}
                  title="Eliminar lista"
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-md transition-colors disabled:opacity-50 cursor-pointer ml-4"
                >
                  <HiTrash className="text-xl" />
                </button>
              )}
            </article>
          );
        })}
      </div>

      {/* MODAL DE CONFIRMACIÓN CON ANIMACIÓN ZOOM */}
      <AnimatePresence>
        {listToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            {/* Backdrop click para cerrar */}
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
        )}
      </AnimatePresence>
    </section>
  );
};

export default DashBoard;