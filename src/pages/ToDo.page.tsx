import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useRef, useState } from "react";
import { useTodos } from "../features/todos/hooks/useTodos";
import { useLists } from "../features/todos/hooks/useLists";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { ShareListModal } from "../features/todos/components/ShareListModal";

import { ModalMembersInList } from "../features/todos/components/ModalMembersInList";

import { FilteredTodos } from "../features/todos/components/FilteredTodos";
import { ErrorMessage } from "../components/ui/errorMessage/ErrorMessage";
import LogUser from "../components/layout/userMenu/LogUser";

type FilterStatus = "all" | "pending" | "confirmed" | "mine";

export const ToDo = () => {
  
  const { listId } = useParams<{ listId: string }>();
  const { user } = useAuth();
  const { lists } = useLists();
  const { todos, addMutation, memberRole } = useTodos(listId || null);
  const taskRef = useRef<HTMLInputElement | null>(null);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const currentList = lists.find((item) => item.id === listId);
  const listName = currentList?.name?.toUpperCase() || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const isOwner = currentList?.owner_id === user?.id;
  const isEditor = isOwner || memberRole === "write";

  const statusOrder: Record<string, number> = {
    pending: 1,
    done_by_user: 2,
    confirmed: 3,
  };

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textValue = taskRef.current?.value.trim() || "";
    if (!textValue || textValue.length > 29 || !listId || !user) {
      return;
    }

    addMutation.mutate({
      list_id: listId,
      task: newTaskText,
      created_by: user.id,
    });

    setNewTaskText("");
  };

  return (
    <>
      <section className="pt-6 flex flex-col px-4 mx-auto w-full max-w-2xl ">
        <Link
          className="text-xs text-gray-300 font-medium absolute top-1 left-2 flex items-center bg-gray-900 p-2 rounded-md hover:opacity-80"
          to={"/dashboard"}
        >
          <MdKeyboardArrowLeft className="w-4 h-4 text-gray-300" />
          <span>Volver</span>
        </Link>
        <LogUser />

        <div className="absolute top-1 right-12 bg-gray-900 rounded-full cursor-pointer p-2 hover:bg-gray-800 transition-colors">
          <FaUsers
            className="h-5 w-5 text-gray-300 hover:text-white"
            onClick={() => setIsMembersModalOpen(true)}
            title="Ver miembros"
          />
        </div>

        {isOwner && (
          <div className="absolute top-1 right-22 bg-gray-900 rounded-full cursor-pointer p-2 hover:bg-gray-800 transition-colors">
            <FiShare2
              className="h-5 w-5 text-gray-300 hover:text-white"
              onClick={() => setIsShareModalOpen(true)}
              title="Compartir lista"
            />
          </div>
        )}

        <h1 className="text-center text-4xl my-8 font-medium">{listName}</h1>

        <div className="w-full relative">
          <input
            className="w-full bg-gray-900 border placeholder:text-gray-400  border-gray-700 focus:border-blue-500 transition-colors rounded-md py-4 px-2"
            autoFocus
            ref={taskRef}
            value={newTaskText}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask(e)}
            onChange={() => setNewTaskText(taskRef.current!.value)}
            maxLength={30}
            placeholder="Añadir o Crear..."
          />
          {newTaskText.length > 3 && (
            <button
              onClick={(e) => handleAddTask(e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white text-xs font-medium "
            >
              Crear
            </button>
          )}
        </div>

        {newTaskText.length >= 30 && (
          <ErrorMessage message={"Excedes el maximo de caracteres (30max)"} />
        )}
        <FilteredTodos
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOrder={statusOrder}
          todos={todos}
          user={user}
          isEditor={isEditor}
        />

        <div>
          {listId && (
            <ShareListModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              listId={listId}
              listName={listName}
            />
          )}

          {isMembersModalOpen && currentList && (
            <ModalMembersInList
              listOwner={currentList.owner_nickname}
              listName={currentList.name}
              listId={currentList.id}
              listMembers={currentList.members}
              isOwner={isOwner}
              onClose={setIsMembersModalOpen}
            />
          )}
        </div>
      </section>
    </>
  );
};
