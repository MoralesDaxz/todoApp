import { useState } from "react";
import { useLists } from "../features/todos/hooks/useLists";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { FaList, FaListCheck } from "react-icons/fa6";
import { TbEdit, TbPointFilled } from "react-icons/tb";
import LogUser from "../components/UI/LogUser";

export const DashBoard = () => {
  const { lists, isLoading, createMutation } = useLists();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [newListName, setNewListName] = useState("");

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createMutation.mutate(newListName);
    setNewListName("");
  };

  if (isLoading) return <div>Cargando listas...</div>;

  return (
    <>
      <section className="w-full px-6 pt-4 flex flex-col">
        <h1 className="text-center text-4xl my-8 font-medium">Gestiones</h1>
        <LogUser />

        <div className="w-fit p-1 rounded-lg self-center flex items-center bg-gray-700">
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

        {/* {list.owner_id === user?.id ? <FaList /> : "🕶"} */}
        <ul className="w-full self-center mt-10">
          {lists.map((list) => (
            <li
              key={list.id}
              className="flex justify-between items-center mb-2.5 text-[1.2rem] bg-gray-950  p-3 rounded-sm cursor-pointer"
              onClick={() => navigate(`/todo/${list.id}`)}
            >
              {/* {list.owner_id === user?.id ? "📝" : "🕶"} */}
              <p>{list.name}</p>

              <TbEdit className="h-6 w-6"/>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
