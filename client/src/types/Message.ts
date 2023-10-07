export interface Message {
  chat_id: number;
  receiver_id: number;
  is_current_user: boolean;
  content: string;
  created_at: string | number;
}
