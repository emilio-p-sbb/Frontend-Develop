// app/admin/messages/components/message-list.tsx
"use client"; // Ini adalah Client Component

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader, // Ditambahkan untuk menampilkan judul dalam Card
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MessageCircle,
  Archive,
  Star, // Hapus jika sudah ada di parent
} from "lucide-react";
import { useAdminStore } from "@/stores/adminStore"; // Jika Anda masih ingin menggunakan Zustand
import { Message } from "@/types/message";
import MessageCard from "./message-card";
import MessageDetailModal from "./message-detail-modal";
import { useResources } from "@/hooks/private/use-resource";
import { Badge } from "@/components/ui/badge";
import { useUpdateAllResource } from "@/hooks/private/use-update-resource";


export default function MessageList() {

  const { data: initialMessages, isLoading: isLoadingAll, error: errorAll } = useResources<Message[]>("messages");
  const { mutate: updateMessages, isPending: isUpdating } = useUpdateAllResource("messages");

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "archived">("all");
  const [messages, setMessages] = useState<Message[]>(initialMessages?.data ?? []); // State lokal untuk pesan
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Gunakan Zustand store jika masih relevan untuk state global seperti notifikasi unread
  const { setActiveSection, setUnreadMessages } = useAdminStore();

  const totalUnreadCount = useMemo(() => {
    return initialMessages?.data?.filter(msg => !msg.read).length ?? 0;
  }, [initialMessages]);

  const activeMessages = useMemo(() => {
    return initialMessages?.data?.filter(msg => !msg.archived).length ?? 0;
  }, [initialMessages]);

  useEffect(() => {
    document.title = "Messages | Portfolio Admin";
    setActiveSection('messages');
    // Sinkronkan unread count dari server dengan Zustand store saat komponen pertama kali dimuat
    
    setUnreadMessages(totalUnreadCount);
  }, [setActiveSection, setUnreadMessages, totalUnreadCount]);

  // Perbarui state pesan lokal saat initialMessages berubah (misal setelah Server Action)
  useEffect(() => {
    setMessages(initialMessages?.data ?? []);
    setUnreadMessages(initialMessages?.data?.filter(msg => !msg.read).length ?? 0);
  }, [initialMessages, setUnreadMessages]);



  const filteredAndSearchedMessages = useMemo(() => {
    let currentMessages: Message[] = [];

    if (filter === "unread") {
      currentMessages = messages.filter(msg => !msg.read);
    } else if (filter === "starred") {
      currentMessages = messages.filter(msg => msg.starred);
    } else if (filter === "archived") {
      currentMessages = initialMessages?.data?.filter(msg => msg.archived) ?? [];
    } else { // "all"
      currentMessages = initialMessages?.data?.filter(msg => !msg.archived) ?? [];
    }

    // Filter berdasarkan pencarian
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentMessages = currentMessages.filter(msg => msg.from.toLowerCase().includes(lowerCaseQuery) || msg.subject.toLowerCase().includes(lowerCaseQuery) || msg.message.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return currentMessages;
  }, [messages, initialMessages, searchQuery, filter]);


  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    // Logika untuk menandai sebagai sudah dibaca akan ditangani di MessageDetailModal
  };

  const handleModalClose = () => {
    setSelectedMessage(null);
  };

  const archiveAllReadMessages = () => {
    console.log("Server Action: Archiving all read messages");
    updateMessages({path:'archive-all-read'})
  }

  const markAllImportant = () => {
    console.log("Server Action: Marking all messages as important");
    updateMessages({path:'mark-all-important'})
  }

  return (
    <>
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageCircle className="text-portfolio-light-blue" />
            Messages
            {totalUnreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalUnreadCount} new
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
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Unread ({messages.filter(msg => !msg.read).length})
              </Button>
              <Button
                variant={filter === "starred" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("starred")}
              >
                Starred ({messages.filter(msg => msg.starred).length})
              </Button>
              <Button
                variant={filter === "archived" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("archived")}
              >
                Archived ({initialMessages?.data.filter(msg => msg.archived).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredAndSearchedMessages.length > 0 ? (
          filteredAndSearchedMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onClick={handleMessageClick} // Meneruskan handler klik
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No messages found matching your criteria.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          open={!!selectedMessage}
          onOpenChange={(isOpen) => !isOpen && handleModalClose()}
        />
      )}
    </>
  );
}