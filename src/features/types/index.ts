import type { Dispatch, SetStateAction } from "react";

export type MemberRole = "read" | "write";

export interface ListMember {
  user_id: string; // <-- Añadir este campo
  nickname: string;
  role: MemberRole;
}

export interface ListItem {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  owner_nickname: string;
  members: ListMember[];
}

export interface Todo {
  id: string;
  list_id: string;
  task: string;
  status: "pending" | "done_by_user" | "confirmed";
  created_by: string;
  created_at?: string; 
}

export interface TableMember {
  user_id: string;
  nickname: string;
  role: "read" | "write";
}

export interface TableProps {
  listOwner: string;
  listName: string;
  listId: string;
  listMembers: TableMember[] | [];
  isOwner?: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export interface ShareListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  listName: string;
}

export interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password?: string;
  setPassword?: (password: string) => void;
  loading: boolean;
  cooldown?: number;
  handleMagicLinkLogin: (
    e: React.FormEvent,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  handlePasswordLogin: (
    e: React.FormEvent,
  ) => Promise<{ success: boolean; error?: string }>;
}

export interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  loading: boolean;
  handleRegister: (
    event: React.FormEvent,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
}