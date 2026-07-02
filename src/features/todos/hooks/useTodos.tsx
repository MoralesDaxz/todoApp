import { useState, useCallback } from 'react';
import { supabase } from '../../../config/supabase/supabaseClient';
import type { Todo } from '../../../types/todo';



export const useTodos = (currentListId: string | null) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    if (!currentListId) return;
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('list_id', currentListId)
      .order('created_at', { ascending: false });;
      
    if (!error && data) setTodos(data);
  }, [currentListId]);

  const markAsDoneByUser = async (todoId: string) => {
    await supabase.from('todos').update({ status: 'done_by_user' }).eq('id', todoId);
    fetchTodos();
  };

  const confirmTodo = async (todoId: string) => {
    const { error } = await supabase.from('todos').update({ status: 'confirmed' }).eq('id', todoId);
    if (error) alert("No tienes permisos de escritura para confirmar esta tarea.");
    else fetchTodos();
  };

 return { todos, setTodos, fetchTodos, markAsDoneByUser, confirmTodo };
};