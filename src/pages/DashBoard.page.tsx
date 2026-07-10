import { useState } from "react";
import { useLists } from "../features/todos/hooks/useLists";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
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
      <section className="min-w-85">
        <h1 className="text-center">Lista de tareas</h1>
        <LogUser />

        <div className="flex flex-col items-center gap-2">
          <div className="border p-[15px] rounded-lg flex flex-col gap-3">
            <h3>Crear Nueva Lista</h3>
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Nombre de la lista"
            />
            <button
              disabled={createMutation.isPending}
              onClick={handleCreateList}
            >
              {createMutation.isPending ? "Creando..." : "Crear"}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 mt-6">
          <h2>Mis Listas de Tareas</h2>
          <ul>
            {lists.map((list) => (
              <li
                key={list.id}
                className="flex justify-between items-center mb-2.5"
              >
                {list.owner_id === user?.id ? "📝" : "🕶"}
                <strong>{list.name}</strong>
                <button
                  className="ml-2.5"
                  onClick={() => navigate(`/todo/${list.id}`)}
                >
                  Abrir
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};
