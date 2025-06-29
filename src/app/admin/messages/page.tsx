import MessageList from "@/components/admin/message/message-list";

// Import Server Actions for top-level buttons

export default async function AdminMessagesPage() {
  // Mengambil data pesan menggunakan Server Action

  return (
    <div className="space-y-6">
      <MessageList />
    </div>
  );
}