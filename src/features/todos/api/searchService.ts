// src/features/todos/api/searchService.ts
import { supabase } from "../../../config/supabase/supabaseClient";

export interface SearchResult {
  id: string;
  task: string;
  status: string;
  list_id: string;
  lists: {
    id: string;
    name: string;
  };
}

export const searchGlobalTodos = async (
  searchTerm: string
): Promise<SearchResult[]> => {
  if (!searchTerm.trim()) return [];

  const { data, error } = await supabase
    .from("todos")
    .select("id, task, status, list_id, lists!inner(id, name)")
    .ilike("task", `%${searchTerm.trim()}%`)
    .limit(15); // Límite para evitar cargas pesadas

  if (error) throw new Error(error.message);
  return (data as unknown as SearchResult[]) ?? [];
};