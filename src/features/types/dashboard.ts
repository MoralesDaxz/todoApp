export type MemberRole = "read" | "write";

export interface ListMember {
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