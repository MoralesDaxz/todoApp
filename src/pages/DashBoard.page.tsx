import { useState } from "react";
import { useLists } from "../features/todos/hooks/useLists";
import { useNavigate } from "react-router";
import { TbEdit } from "react-icons/tb";
import LogUser from "../components/UI/LogUser";
import { formatRelativeTime } from "../utils/date";

export const DashBoard = () => {
  const { lists, isLoading, createMutation } = useLists();
  console.log(lists);
  
  const navigate = useNavigate();

  const [newListName, setNewListName] = useState("");

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createMutation.mutate(newListName);
    setNewListName("");
  };

  if (isLoading) return <div>Cargando listas...</div>;
// 1. Ordenamos las listas: la fecha más reciente (b) menos la más antigua (a)
  const sortedLists = [...lists].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return (
    <>
      <section className="w-full px-6 pt-4 flex flex-col">
        <h1 className="text-center text-4xl my-8 font-medium">Gestiones</h1>
        <LogUser />

        <div className="border-2 border-gray-400 w-fit p-1 rounded-md self-center flex items-center bg-gray-700">
          <input
            className="outline-none text-xl"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Dame un título."
          />

          <button
            className="bg-blue-400 p-3 rounded-md text-[1rem] font-medium"
            disabled={createMutation.isPending}
            onClick={handleCreateList}
          >
            {createMutation.isPending ? "Creando..." : "Crear"}
          </button>
        </div>

        {/* {list.owner_id === user?.id ? <FaList /> : "🕶"} */}
       <ul className="w-full self-center mt-10">
         {sortedLists.map((list) => (
            <li
              key={list.id}
              className="flex justify-between items-center mb-2.5 text-[1.2rem] border-2 border-gray-600 p-3 rounded-md cursor-pointer backdrop-brightness-80 shadow-2xl hover:bg-gray-800 transition-colors"
              onClick={() => navigate(`/todo/${list.id}`)}
            >
              <div className="flex flex-col">
                <p className="font-medium">{list.name}</p>
                <span className="text-[0.8rem] text-gray-400">
                  {formatRelativeTime(list.created_at)}
                </span>
              </div>

              <TbEdit className="h-6 w-6 text-gray-300" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
