export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
