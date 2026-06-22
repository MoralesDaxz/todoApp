import { useEffect, useState } from "react";
import { useLists } from "../features/todos/hooks/useLists";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { supabase } from "../config/supabase/supabaseClient";

export const DashBoard = () => {
  const { lists, fetchMyLists, joinListWithCode } = useLists();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [inviteCode, setInviteCode] = useState("");
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    fetchMyLists();
  }, [lists, fetchMyLists]);

  const handleCreateList = async () => {
    if (!newListName.trim() || !user) return;
    const { error } = await supabase
      .from("lists")
      .insert([{ name: newListName, owner_id: user.id }]);
    if (!error) {
      setNewListName("");
      fetchMyLists();
    }
  };

  return (
    <section className="py-2 flex-col">
      <article
        title={user?.email}
        className="absolute top-2 right-2 text-sm py-2 px-3 rounded-[50%] bg-[#5a1ee6] flex flex-col gap-3"
      >
        {user?.email?.substring(0, 1).toLocaleUpperCase()}
      </article>
      <h1 className="text-center">Panel de control</h1>

      <div className="flex gap-2">
        {/* Crear Lista */}
        <div className="border border-[#ccc] p-[15px] rounded-lg flex flex-col gap-3">
          <h3>Crear Nueva Lista</h3>
          <input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Nombre de la lista"
          />
          <button onClick={handleCreateList}>Crear</button>
        </div>

        {/* Unirse a Lista */}
        <div className="border border-[#ccc] p-[15px] rounded-lg flex flex-col gap-3">
          <h3>Unirse con Código</h3>
          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Pega el código UUID aquí"
          />
          <button
            onClick={() => {
              joinListWithCode(inviteCode);
              setInviteCode("");
            }}
          >
            Unirme
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 mt-6">
        <h2>Mis Listas de Tareas</h2>
        <ul >
          {lists.map((list) => (
            <li key={list.id} className="flex justify-between items-center mb-2.5">
              {list.owner_id === user?.id ? "📝" : "🕶"}
              <strong>{` ${list.name}`}</strong>
              <button
                className="ml-2.5"
                onClick={() => navigate(`/todo/${list.id}`)}
              >
                Abrir
              </button>
            </li>
          ))}
          {lists.length === 0 && <p>No tienes listas aún.</p>}
        </ul>
      </div>
    </section>
  );
};
