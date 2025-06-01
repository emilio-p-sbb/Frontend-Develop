// app/admin/messages/page.tsx
// Ini adalah Server Component secara default.


import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Archive,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { archiveAllReadMessages, getMessages, markAllImportant } from "./action";
import MessageList from "@/components/admin/message/message-list";

// Import Server Actions for top-level buttons

export default async function AdminMessagesPage() {
  // Mengambil data pesan menggunakan Server Action
  const allMessages = await getMessages();

  // Hitung pesan yang belum dibaca di sisi server
  const unreadCount = allMessages.filter(msg => !msg.isRead && !msg.isArchived).length;

  // Mendapatkan pesan yang tidak diarsipkan untuk ditampilkan secara default
  const activeMessages = allMessages.filter(msg => !msg.isArchived);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="text-portfolio-light-blue" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-gray-500 mt-1">Manage your portfolio inquiries and messages.</p>
        </div>
        <div className="flex gap-2">
          {/* Menggunakan form action untuk memanggil Server Action */}
          <form action={archiveAllReadMessages}>
            <Button variant="outline" size="sm" type="submit">
              <Archive size={16} className="mr-2" />
              Archive Read
            </Button>
          </form>
          <form action={markAllImportant}>
            <Button size="sm" type="submit">
              <Star size={16} className="mr-2" />
              Mark All Important
            </Button>
          </form>
        </div>
      </div>

      {/* Meneruskan semua pesan dan hitungan belum dibaca ke Client Component */}
      <MessageList initialMessages={activeMessages} totalUnreadCount={unreadCount} />
    </div>
  );
}