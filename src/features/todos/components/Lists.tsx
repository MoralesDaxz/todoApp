import { motion } from "framer-motion";
import { useState, type FC } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useLists } from "../hooks/useLists";
import type { ListItem } from "../../types";
import { MembersInList } from "./Table.MembersInList";
import { ModalDeleteList } from "./ModalDeleteList";

import { containerVariants, itemVariants } from "../../../utils/motionVariants";
import { BsFillExclamationSquareFill } from "react-icons/bs";

import { FaUsers, FaAngleRight } from "react-icons/fa";
import { HiTrash, HiUsers } from "react-icons/hi2";
import { Link } from "react-router";
import { formatRelativeTime } from "../../../utils/date";
import { FilteredLists } from "./FilteredLists";

interface Prop {
  pickList: "myLists" | "sharedLists";
}
export const Lists: FC<Prop> = ({ pickList }) => {
  const { user } = useAuth();
  const { lists, deletingListId } = useLists();

  const [listToDelete, setListToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedListForMembers, setSelectedListForMembers] =
    useState<ListItem | null>(null);
  const sortedLists = [...lists].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const listsMap = {
    myLists: sortedLists.filter((list) => list.owner_id === user?.id),
    sharedLists: sortedLists.filter((list) => list.owner_id !== user?.id),
  };

  return (
    <>
      <div>
        <FilteredLists />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={pickList ? "myLists" : "sharedLists"}
          className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-3"
        >
          {listsMap[pickList].length > 0 ? (
            listsMap[pickList].map((list: ListItem, idx) => {
              const isOwner = list.owner_id === user?.id;
              const isDeleting = deletingListId === list.id;

              return (
                <div key={list.id}>
                  <motion.article
                    variants={itemVariants}
                    className="relative bg-gray-950 border border-gray-500 rounded-lg flex items-center shadow-md transition-colors"
                  >
                    <p className="absolute bottom-1 left-1 text-[.5rem] opacity-80">
                      {listsMap[pickList].length - idx}
                    </p>
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
                    <div className="w-full flex justify-between items-center gap-1">
                      <div className="  text-xs text-gray-400 flex flex-col gap-1 mt-2 p-3">
                        <h2 className="text-lg font-semibold text-white">
                          {list.name}
                        </h2>
                        <span className="flex flex-wrap gap-1 items-center">
                          <p>Propietario: </p>
                          <span className="w-fit bg-gray-900 border border-gray-700 px-1 py-0.5 rounded text-[10px] flex items-center gap-1 text-gray-300">
                            {list.owner_nickname}
                          </span>
                        </span>

                        {list.members.length > 0 && (
                          <div className="flex flex-wrap gap-1 items-center mt-0.5">
                            <span className="text-gray-400 text-[10px]">
                              Invitados:
                            </span>
                            {list.members.map(
                              (member, idx) =>
                                idx <= 3 && (
                                  <span
                                    key={idx}
                                    className="bg-gray-900 border border-gray-700 px-1 py-0.5 rounded text-[10px] flex items-center gap-1 text-gray-400"
                                  >
                                    {member.nickname}
                                  </span>
                                ),
                            )}

                            <button
                              onClick={() => setSelectedListForMembers(list)}
                              className="bg-gray-900 border border-gray-700 px-1 py-0.5 rounded text-[10px] flex items-center gap-1 text-gray-300 hover:text-white cursor-pointer"
                            >
                              <FaUsers className="w-3 h-3 text-blue-400" /> Ver
                              más...
                            </button>
                          </div>
                        )}
                        <span>
                          Creado: {formatRelativeTime(list.created_at)}
                        </span>
                      </div>
                      <Link
                        to={`/todo/${list.id}`}
                        className="  bg-gray-800 hover:bg-blue-900 p-2 rounded-[50%] transition-colors duration-300 mr-1"
                      >
                        <FaAngleRight className="  w-8 h-8 text-gray-300 hover:text-white transition-colors duration-300" />
                      </Link>
                    </div>
                  </motion.article>
                </div>
              );
            })
          ) : (
            <div className="col-span-2  flex gap-3 items-center justify-center p-2 bg-gray-950 rounded-md">
              <BsFillExclamationSquareFill className="text-gray-200 w-10 h-10" />
              <p className=" p-5 text-gray-500 font-medium text-md w-60 max-w-80">
                Aun no tienes nada cargado, crea una lista o unete con codigo a
                otra.
              </p>
            </div>
          )}
        </motion.div>
      </div>

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
