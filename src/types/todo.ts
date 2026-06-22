export interface List {
  id: string;
  name: string;
  owner_id: string;
}

export interface ListMember {
  list_id: string;
  user_id: string;
  role: 'read' | 'write';
}

export interface Todo {
  id: string;
  list_id: string;
  title: string;
  task: string;
  status: 'pending' | 'done_by_user' | 'confirmed';
}