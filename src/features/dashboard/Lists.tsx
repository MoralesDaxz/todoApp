import { motion, type Variants } from "framer-motion";
import { FaAngleRight, FaUsers } from "react-icons/fa";
import { HiTrash, HiUsers } from "react-icons/hi2";
import { formatRelativeTime } from "../../utils/date";
import { Link } from "react-router";
import { useLists } from "../todos/hooks/useLists";
import { useAuth } from "../../context/AuthContext";
import { useState, type FC } from "react";
import type { ListItem } from "../todos/api/listService";
import { ModalDeleteList } from "./ModalDeleteList";
import { MembersInList } from "./Table.MembersInList";

interface Prop {
  pickList: boolean;
}
export const Lists: FC<Prop> = ({ pickList }) => {
  const { user } = useAuth();
  const { lists, deletingListId } = useLists();

  const [listToDelete, setListToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  // Guardamos la lista completa a consultar (o null si está cerrado)
  const [selectedListForMembers, setSelectedListForMembers] =
    useState<ListItem | null>(null);
  // 1. Ordenamos las listas: la fecha más reciente (b) menos la más antigua (a)
  const sortedLists = [...lists].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const listsMap = {
    myLists: sortedLists.filter((list) => list.owner_id === user?.id),
    sharedLists: sortedLists.filter((list) => list.owner_id !== user?.id),
  };

  // 1. Variante para el grid (Padre)
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Tiempo en segundos entre cada tarjeta
      },
    },
  };

  // 2. Variante para cada tarjeta (Hijo)
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50 }, // Entra desde -50px a la izquierda
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }, // Animación fluida
    },
  };
  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={pickList ? "my-lists" : "shared-lists"} // Reinicia la animación al cambiar de vista
      >
        {listsMap[pickList ? "myLists" : "sharedLists"].map(
          (list: ListItem) => {
            const isOwner = list.owner_id === user?.id;
            const isDeleting = deletingListId === list.id;

            return (
              <div key={list.id}>
                <motion.article
                  variants={itemVariants} // Se enlaza con el stagger del padre
                  className="relative bg-gray-950 border border-gray-500 rounded-lg flex items-center justify-between shadow-md transition-colors"
                >
                  {isOwner ? (
                    <button
                      onClick={() =>
                        setListToDelete({ id: list.id, name: list.name })
                      }
                      disabled={isDeleting}
                      title="Eliminar lista"
                      className="mx-3 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-md transition-colors disabled:opacity-50 cursor-pointer "
                    >
                      <HiTrash className="text-xl" title="Eliminar" />
                    </button>
                  ) : (
                    <HiUsers className="mx-3 w-5 h-5 text-blue-300" />
                  )}
                  <div className="flex-1 p-3">
                    <h2 className="text-lg font-semibold text-white">
                      {list.name}
                    </h2>
                    <div className="text-xs text-gray-400 flex flex-col gap-1 mt-2">
                      <span className="flex flex-wrap gap-1 items-center">
                        <p>Propietario: </p>
                        <span className="w-fit bg-gray-900 border border-gray-700 px-1 py-0.5 rounded text-[10px] flex items-center gap-1 text-gray-300">
                          {list.owner_nickname}
                        </span>
                      </span>

                      {list.members.length > 0 && (
                        <div className="flex flex-wrap gap-1 items-center mt-0.5">
                          <span className="text-gray-400 text-[11px]">
                            Invitados:
                          </span>
                          {list.members.map(
                            (member, idx) =>
                              idx <= 3 && (
                                <span
                                  key={idx}
                                  className="bg-gray-900 border border-gray-700 px-1 py-0.5 rounded text-[10px] flex items-center gap-1 text-gray-300"
                                >
                                  {member.nickname}
                                </span>
                              ),
                          )}
                          <button
                            onClick={() => setSelectedListForMembers(list)}
                            className="  bg-gray-900 border border-gray-700 px-1 py-0.5 rounded text-[10px] flex items-center gap-1 text-gray-300 hover:text-white cursor-pointer"
                          >
                            <FaUsers className="w-3 h-3 text-blue-400" /> Ver
                            más...
                          </button>
                        </div>
                      )}
                      <span>Creado: {formatRelativeTime(list.created_at)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/todo/${list.id}`}
                    className="absolute bottom-[30%]  right-1 bg-gray-800 hover:bg-blue-900 p-2 rounded-[50%] transition-colors duration-300"
                  >
                    <FaAngleRight className="  w-8 h-8 text-gray-300 hover:text-white transition-colors duration-300" />
                  </Link>
                </motion.article>
              </div>
            );
          },
        )}
      </motion.div>
      {/* Modal renderizado fuera del map */}
      {selectedListForMembers && (
        <MembersInList
        listOwner={selectedListForMembers.owner_nickname}
          listName={selectedListForMembers.name}
          listId={selectedListForMembers.id}
          listMembers={selectedListForMembers.members}
          isOwner={selectedListForMembers.owner_id === user?.id}
          onClose={() => setSelectedListForMembers(null)}
        />
      )}
      <ModalDeleteList
        listToDelete={listToDelete}
        setListToDelete={setListToDelete}
      />
    </>
  );
};
