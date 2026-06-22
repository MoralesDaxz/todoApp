import { useCallback, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import type { List } from "../../../types/todo";
import { supabase } from "../../../config/supabase/supabaseClient";
export const useLists = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState<List[]>([]);

const fetchMyLists = useCallback(async () => {
    if (!user) return;
    
    // 1. Consulta: Listas donde soy el Creador (Dueño)
    const ownedPromise = supabase
      .from('lists')
      .select('*')
      .eq('owner_id', user.id);

    // 2. Consulta: Listas donde soy Invitado (usando inner join)
    const memberPromise = supabase
      .from('lists')
      .select('*, list_members!inner(user_id)')
      .eq('list_members.user_id', user.id);

    // Ejecutamos ambas al mismo tiempo para no perder rendimiento
    const [ownedRes, memberRes] = await Promise.all([ownedPromise, memberPromise]);

    if (ownedRes.error) console.error("Error cargando listas propias:", ownedRes.error);
    if (memberRes.error) console.error("Error cargando listas invitadas:", memberRes.error);

    // 3. Unificamos y limpiamos los datos
    const allLists: List[] = [];
    
    // Añadimos las listas propias
    if (ownedRes.data) {
      allLists.push(...ownedRes.data.map(item => ({ 
        id: item.id, 
        name: item.name, 
        owner_id: item.owner_id 
      })));
    }
    
    // Añadimos las listas de invitado (y filtramos por si hay algún cruce raro)
    if (memberRes.data) {
      const memberLists = memberRes.data
        .filter(item => item.owner_id !== user.id) // Evita duplicados si el dueño también está en list_members
        .map(item => ({ 
          id: item.id, 
          name: item.name, 
          owner_id: item.owner_id 
        }));
      allLists.push(...memberLists);
    }

    setLists(allLists);
  }, [user]);

  // REGLA 1: El creador genera el código con el rol que él decida
  const generateInviteCode = async (listId: string, role: 'read' | 'write'): Promise<string | null> => {
    const { data, error } = await supabase
      .from('list_invitations')
      .insert([{ list_id: listId, role }])
      .select('id')
      .single();

    if (error) {
      console.error(error);
      return null;
    }
    return data.id; // Este es el código UUID que se le compartirá al invitado
  };

  // El invitado se une usando el código, el rol viene definido por el código, no por él
  const joinListWithCode = async (inviteCode: string) => {
    if (!user) return;

    // 1. Buscar la invitación para saber qué lista y qué rol tiene asignado
    const { data: invite, error: inviteError } = await supabase
      .from('list_invitations')
      .select('list_id, role')
      .eq('id', inviteCode)
      .single();

    if (inviteError || !invite) {
      alert("Código de invitación inválido o expirado.");
      return;
    }

    // 2. Insertarlo en la lista con el rol que dejó el creador
    const { error: joinError } = await supabase
      .from('list_members')
      .insert([{ list_id: invite.list_id, user_id: user.id, role: invite.role }]);

    if (joinError) {
      alert("Ya eres miembro de esta lista o hubo un error.");
    } else {
      alert("¡Te has unido exitosamente!");
      fetchMyLists();
    }
  };

  return { lists, fetchMyLists, generateInviteCode, joinListWithCode };
};