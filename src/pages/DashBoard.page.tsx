// src/pages/DashBoard.page.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLists } from "../features/todos/hooks/useLists";
import { useAuth } from "../context/AuthContext";
import { HiTrash, HiExclamationTriangle } from "react-icons/hi2";
import { Link } from "react-router";
import LogUser from "../components/UI/logUser/LogUser";
import { formatRelativeTime } from "../utils/date";

export const DashBoard = () => {
  const { user } = useAuth();
  const { lists, isLoading, createMutation, deleteList, deletingListId } =
    useLists();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  // 1. Ordenamos las listas: la fecha más reciente (b) menos la más antigua (a)
  const sortedLists = [...lists].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createMutation.mutate(newListName);
    setNewListName("");
  };
  // Estado para controlar la lista seleccionada a eliminar (si es null, el modal está cerrado)
  const [listToDelete, setListToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
    return (
      <p className="text-center mt-10 text-gray-400">Cargando listas...</p>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 pt-4 flex flex-col">
      <h1 className="text-center text-4xl my-8 font-medium">Gestiones</h1>
      <LogUser />
      <div className="w-fit mb-10 p-3 rounded-lg self-center flex items-center bg-gray-900 border border-gray-500 ">
        <input
          className="outline-none text-xl"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Dame un título."
        />

        <button
          className="bg-blue-400 p-3 rounded-sm text-[1rem] font-medium"
          disabled={createMutation.isPending}
          onClick={handleCreateList}
        >
          {createMutation.isPending ? "Creando..." : "Crear"}
        </button>
      </div>

      {/* Banner de error si falla la eliminación */}
      {errorMessage && (
        <div className="mb-4 text-sm text-red-300 bg-red-950/70 p-3 rounded-md border border-red-800">
          {errorMessage}
        </div>
      )}

      {/* Grid de listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sortedLists.map(
          (list: {
            id: string;
            name: string;
            owner_id: string;
            created_at: string;
          }) => {
            const isOwner = list.owner_id === user?.id;
            const isDeleting = deletingListId === list.id;

            return (
              <article
                key={list.id}
                className="p-4 bg-gray-950 border border-gray-500 rounded-lg flex items-center justify-between shadow-md  transition-all"
              >
                <Link to={`/todo/${list.id}`} className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    {list.name}
                  </h2>
                  <div className="text-xs text-gray-400 flex gap-2">
                    <span>{formatRelativeTime(list.created_at)}</span>
                    <span>
                      {isOwner ? "Propietario" : "Compartida contigo"}
                    </span>
                  </div>
                </Link>

                {/* Botón que abre el modal de confirmación */}
                {isOwner && (
                  <button
                    onClick={() =>
                      setListToDelete({ id: list.id, name: list.name })
                    }
                    disabled={isDeleting}
                    title="Eliminar lista"
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-md transition-colors disabled:opacity-50 cursor-pointer ml-4"
                  >
                    <HiTrash className="text-xl" />
                  </button>
                )}
              </article>
            );
          },
        )}
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
