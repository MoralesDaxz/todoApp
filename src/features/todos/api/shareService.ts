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
  role: "read" | "write"
): Promise<InviteCode> => {
  const code = generateRandomCode();

  const { data, error } = await supabase
    .from("list_invites")
    .insert([{ list_id: listId, code, role }])
    .select("code, role")
    .single();

  if (error) throw new Error(error.message);
  return data;
};