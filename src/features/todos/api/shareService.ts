// src/features/todos/api/shareService.ts
import { supabase } from "../../../config/supabase/supabaseClient";

export interface InviteCode {
  code: string;
  role: "read" | "write";
}

// Función auxiliar para generar un código alfanumérico corto (ej. A7B92X)
export const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createInviteCode = async (
  listId: string,
  role: "read" | "write",
): Promise<InviteCode> => {
  const code = generateRandomCode();

  const { data, error } = await supabase
    .from("list_invitations")
    .insert([{ list_id: listId, code, role }])
    .select("code, role")
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const joinListByCode = async (code: string): Promise<string> => {
  const { data, error } = await supabase.rpc("join_list_by_code", {
    p_code: code.trim(),
  });

  if (error) throw new Error(error.message);
  return data as string; // Retorna el list_id de la lista unida
};

export const removeMemberFromList = async (
  listId: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("list_members")
    .delete()
    .eq("list_id", listId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
};
