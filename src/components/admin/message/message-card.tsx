"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Star,
  Trash2,
  Reply,
  Clock,
  User,
  Archive,
  FolderOpen
} from "lucide-react";

import { useAdminStore } from "@/stores/adminStore";
import {
  archiveMessage,
  deleteMessage,
  toggleMessageStarred,
  unarchiveMessage,
} from "@/app/admin/messages/action";
import { Message } from "@/types/message";

interface MessageCardProps {
  message: Message;
  onClick: (message: Message) => void;
}

export default function MessageCard({ message, onClick }: MessageCardProps) {
  const { unreadMessages, setUnreadMessages } = useAdminStore();

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleMessageStarred(message.id, !message.isStarred);
    } catch (error) {
      console.error("Failed to toggle starred status:", error);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(message.id);
        if (!message.isRead && !message.isArchived) {
          setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
        }
        alert("Message deleted successfully!");
      } catch (error) {
        console.error("Failed to delete message:", error);
        alert("Failed to delete message. Please try again.");
      }
    }
  };

  const handleArchiveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await archiveMessage(message.id);
      if (!message.isRead) {
        setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
      }
      alert("Message archived successfully!");
    } catch (error) {
      console.error("Failed to archive message:", error);
      alert("Failed to archive message. Please try again.");
    }
  };

  const handleUnarchiveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await unarchiveMessage(message.id);
      alert("Message unarchived successfully!");
    } catch (error) {
      console.error("Failed to unarchive message:", error);
      alert("Failed to unarchive message. Please try again.");
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        !message.isRead && !message.isArchived
          ? "border-l-4 border-l-portfolio-light-blue bg-blue-50/50"
          : ""
      }`}
      onClick={() => onClick(message)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-full bg-portfolio-navy text-white flex items-center justify-center flex-shrink-0">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3
                  className={`font-semibold ${
                    !message.isRead && !message.isArchived
                      ? "text-portfolio-navy"
                      : "text-gray-700"
                  }`}
                >
                  {message.from}
                </h3>
                <span className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">
                  &lt;{message.email}&gt;
                </span>
                {message.isStarred && (
                  <Star size={16} className="text-yellow-500 fill-current" />
                )}
                {!message.isRead && !message.isArchived && (
                  <div className="w-2 h-2 bg-portfolio-light-blue rounded-full flex-shrink-0" />
                )}
              </div>
              <p
                className={`${
                  !message.isRead && !message.isArchived
                    ? "font-medium text-gray-900"
                    : "text-gray-700"
                } mb-2 text-base`}
              >
                {message.subject}
              </p>
              <p className="text-gray-600 text-sm line-clamp-2">
                {message.message}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              {message.time}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={handleStarClick}>
                <Star
                  size={16}
                  className={
                    message.isStarred
                      ? "text-yellow-500 fill-current"
                      : "text-gray-500"
                  }
                />
              </Button>
              <Button variant="ghost" size="sm">
                <Reply size={16} />
              </Button>
              {message.isArchived ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUnarchiveClick}
                >
                  <FolderOpen size={16} className="text-gray-500" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleArchiveClick}>
                  <Archive size={16} className="text-gray-500" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
