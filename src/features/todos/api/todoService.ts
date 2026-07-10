import { supabase } from "../../../config/supabase/supabaseClient";

export const fetchTodos = async (listId: string) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addTodo = async (newTodo: { list_id: string, task: string, created_by: string }) => {
  const { data, error } = await supabase.from('todos').insert([newTodo]).select().single();
  if (error) throw error;
  return data;
};