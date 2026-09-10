// src/features/todos/api/listService.ts
import { supabase } from "../../../config/supabase/supabaseClient";
import type { ListItem } from "../../types";

export const getLists = async (): Promise<ListItem[]> => {
  const { data, error } = await supabase.from("v_user_lists").select("*");

  if (error) throw new Error(error.message);
  return data || [];
};

export const createList = async (name: string, owner_id: string) => {
  const { data, error } = await supabase
    .from("lists")
    .insert([{ name, owner_id }])
    .order("created_at", { ascending: false })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteListService = async (listId: string): Promise<void> => {
  const { error } = await supabase.from("lists").delete().eq("id", listId);

  if (error) {
    throw new Error(error.message);
  }
};
