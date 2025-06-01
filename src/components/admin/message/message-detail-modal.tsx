"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Star,
  Trash2,
  Reply,
  Clock,
  User,
  Archive,
  MailOpen,
  FolderOpen,
} from "lucide-react";

import { useAdminStore } from "@/stores/adminStore";
import { Message } from "@/types/message";
import {
  archiveMessage,
  deleteMessage,
  markMessageAsRead,
  markMessageAsUnread,
  toggleMessageStarred,
  unarchiveMessage,
} from "@/app/admin/messages/action";

interface MessageDetailModalProps {
  message: Message;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MessageDetailModal({
  message,
  open,
  onOpenChange,
}: MessageDetailModalProps) {
  const { unreadMessages, setUnreadMessages } = useAdminStore();

  useEffect(() => {
    if (open && !message.isRead) {
      markMessageAsRead(message.id);
      setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
    }
  }, [open, message, unreadMessages, setUnreadMessages]);

  const handleToggleStarred = async () => {
    try {
      await toggleMessageStarred(message.id, !message.isStarred);
    } catch (error) {
      console.error("Failed to toggle starred status:", error);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveMessage(message.id);
      if (!message.isRead) {
        setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to archive message:", error);
    }
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveMessage(message.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to unarchive message:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this message permanently?")) {
      try {
        await deleteMessage(message.id);
        if (!message.isRead) {
          setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
        }
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    }
  };

  const handleMarkUnread = async () => {
    try {
      await markMessageAsUnread(message.id);
      setUnreadMessages(unreadMessages + 1);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to mark as unread:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User size={20} className="text-gray-600" />
            {message.from}{" "}
            <span className="text-sm text-gray-500 font-normal">
              &lt;{message.email}&gt;
            </span>
          </DialogTitle>
          <DialogDescription>
            <p className="font-semibold text-lg text-gray-800 mt-2">
              {message.subject}
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock size={14} className="mr-1" /> {message.time}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 border-t border-b border-gray-200 space-y-4">
          <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkUnread}
            disabled={!message.isRead}
          >
            <MailOpen size={16} className="mr-2" /> Mark as Unread
          </Button>
          <Button variant="outline" size="sm" onClick={handleToggleStarred}>
            <Star
              size={16}
              className={`mr-2 ${
                message.isStarred ? "text-yellow-500 fill-current" : ""
              }`}
            />
            {message.isStarred ? "Unstar" : "Star"}
          </Button>
          {message.isArchived ? (
            <Button variant="outline" size="sm" onClick={handleUnarchive}>
              <FolderOpen size={16} className="mr-2" /> Unarchive
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleArchive}>
              <Archive size={16} className="mr-2" /> Archive
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
          <Button size="sm">
            <Reply size={16} className="mr-2" /> Reply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
