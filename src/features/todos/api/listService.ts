// features/todos/api/listService.ts
import { supabase } from "../../../config/supabase/supabaseClient";

export const getMyLists = async (userId: string) => {
  const [ownedRes, memberRes] = await Promise.all([
    supabase.from("lists").select("*").eq("owner_id", userId),
    supabase
      .from("lists")
      .select("*, list_members!inner(user_id)")
      .eq("list_members.user_id", userId)
      .order('created_at', { ascending: false }),
  ]);

  if (ownedRes.error) throw ownedRes.error;
  if (memberRes.error) throw memberRes.error;

  return [...(ownedRes.data || []), ...(memberRes.data || [])];
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
/* import { supabase } from "../../../config/supabase/supabaseClient";

export const getMyLists = async () => {
  const { data, error } = await supabase.from('lists').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createList = async (listData: { name: string; owner_id: string }) => {
  const { data, error } = await supabase
    .from('lists')
    .insert([listData])
    .select()
    .single();

  if (error) throw error;
  return data;
}; */
