export interface Message {
  id: number;
  from: string;
  email: string;
  subject: string;
  message: string;
  time: string; // Bisa diganti Date jika perlu sorting/filter real-time
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean; // Tambahkan properti ini
}