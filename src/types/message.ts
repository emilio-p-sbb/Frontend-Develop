export interface Message {
  id: number;
  from: string;
  email: string;
  subject: string;
  message: string;
  time: string; // Bisa diganti Date jika perlu sorting/filter real-time
  read: boolean;
  starred: boolean;
  archived: boolean; // Tambahkan properti ini
}