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
  MessageCircle, // Hapus jika sudah ada di parent
} from "lucide-react";
import { useAdminStore } from "@/stores/adminStore"; // Jika Anda masih ingin menggunakan Zustand
import { Message } from "@/types/message";
import MessageCard from "./message-card";
import MessageDetailModal from "./message-detail-modal";

interface MessageListProps {
  initialMessages: Message[]; // Pesan awal dari Server Component (tidak diarsipkan)
  totalUnreadCount: number; // Jumlah total pesan belum dibaca
}

export default function MessageList({ initialMessages, totalUnreadCount }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "archived">("all");
  const [messages, setMessages] = useState<Message[]>(initialMessages); // State lokal untuk pesan
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Gunakan Zustand store jika masih relevan untuk state global seperti notifikasi unread
  const { setActiveSection, setUnreadMessages } = useAdminStore();

  useEffect(() => {
    document.title = "Messages | Portfolio Admin";
    setActiveSection('messages');
    // Sinkronkan unread count dari server dengan Zustand store saat komponen pertama kali dimuat
    setUnreadMessages(totalUnreadCount);
  }, [setActiveSection, setUnreadMessages, totalUnreadCount]);

  // Perbarui state pesan lokal saat initialMessages berubah (misal setelah Server Action)
  useEffect(() => {
    setMessages(initialMessages);
    // Hitung ulang unread count lokal jika filter "all" aktif
    setUnreadMessages(initialMessages.filter(msg => !msg.isRead).length);
  }, [initialMessages, setUnreadMessages]);


  const filteredAndSearchedMessages = useMemo(() => {
    let currentMessages = messages;

    // Filter berdasarkan kategori
    if (filter === "unread") {
      currentMessages = currentMessages.filter(msg => !msg.isRead);
    } else if (filter === "starred") {
      currentMessages = currentMessages.filter(msg => msg.isStarred);
    } else if (filter === "archived") {
      // Untuk filter archived, kita butuh semua pesan dari server,
      // tapi di sini initialMessages sudah filter yang tidak diarsipkan.
      // Untuk demo, kita bisa asumsikan `messages` sudah berisi semua pesan yang mungkin.
      // Dalam aplikasi nyata, Anda mungkin perlu Server Action `getArchivedMessages` terpisah.
      currentMessages = initialMessages.filter(msg => msg.isArchived); // Filter dari data awal jika perlu
    } else { // "all" atau default
        currentMessages = initialMessages.filter(msg => !msg.isArchived); // Pastikan "all" hanya menampilkan yang tidak diarsipkan
    }


    // Filter berdasarkan pencarian
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentMessages = currentMessages.filter(msg =>
        msg.from.toLowerCase().includes(lowerCaseQuery) ||
        msg.subject.toLowerCase().includes(lowerCaseQuery) ||
        msg.message.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return currentMessages;
  }, [messages, initialMessages, searchQuery, filter]); // Tambahkan initialMessages ke dependency array

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    // Logika untuk menandai sebagai sudah dibaca akan ditangani di MessageDetailModal
  };

  const handleModalClose = () => {
    setSelectedMessage(null);
  };

  return (
    <>
      {/* Search and Filters */}
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
                Unread ({messages.filter(msg => !msg.isRead).length})
              </Button>
              <Button
                variant={filter === "starred" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("starred")}
              >
                Starred ({messages.filter(msg => msg.isStarred).length})
              </Button>
              <Button
                variant={filter === "archived" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("archived")}
              >
                Archived ({initialMessages.filter(msg => msg.isArchived).length})
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