"use client";

import React, { useState } from "react";
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

import { Message } from "@/types/message";
import { useUpdateByIdResource } from "@/hooks/private/use-update-resource";
import { useDeleteResource } from "@/hooks/private/use-delete-resource";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { revalidatePath } from "next/cache";

interface MessageCardProps {
  message: Message;
  onClick: (message: Message) => void;
}

export default function MessageCard({ message, onClick }: MessageCardProps) {

  const { mutate: updateMessage, isPending: isUpdating } = useUpdateByIdResource<Message>("messages");
  const deleteOne = useDeleteResource<Message>("messages");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { unreadMessages, setUnreadMessages } = useAdminStore();

  const handleStarClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      console.log('message.starred = '+message.starred)
      if(message.starred==true){
        await updateMessage({id:message.id, path:'unstarred'});
      }else{
        await updateMessage({id:message.id, path:'starred'});
      }
      // await toggleMessageStarred(message.id, !message.isStarred);
    } catch (error) {
      console.error("Failed to toggle starred status:", error);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteOne.mutateAsync(deleteId);
        if (!message.read) {
          setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
        }
        revalidatePath('/admin/messages');
      } catch (err) {
        console.error(err);
      }
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleArchiveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateMessage({id:message.id, path:'archive'})
      // await archiveMessage(message.id);
      if (!message.read) {
        setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
      }
      revalidatePath('/admin/messages');
      alert("Message archived successfully!");
    } catch (error) {
      console.error("Failed to archive message:", error);
      alert("Failed to archive message. Please try again.");
    }
  };

  const handleUnarchiveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // await unarchiveMessage(message.id);
      await updateMessage({id:message.id, path:'unarchive'})
      alert("Message unarchived successfully!");
    } catch (error) {
      console.error("Failed to unarchive message:", error);
      alert("Failed to unarchive message. Please try again.");1
    }
  };

  return (
    <>
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        !message.read && !message.archived
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
                    !message.read && !message.archived
                      ? "text-portfolio-navy"
                      : "text-gray-700"
                  }`}
                >
                  {message.from}
                </h3>
                <span className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">
                  &lt;{message.email}&gt;
                </span>
                {message.starred && (
                  <Star size={16} className="text-yellow-500 fill-current" />
                )}
                {!message.read && !message.archived && (
                  <div className="w-2 h-2 bg-portfolio-light-blue rounded-full flex-shrink-0" />
                )}
              </div>
              <p
                className={`${
                  !message.read && !message.archived
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
                    message.starred
                      ? "text-yellow-500 fill-current"
                      : "text-gray-500"
                  }
                />
              </Button>
              <Button variant="ghost" size="sm">
                <Reply size={16} />
              </Button>
              {message.archived ? (
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
              <Button variant="ghost" size="sm" onClick={() => {
                              setDeleteId(message.id);
                              setIsDeleteDialogOpen(true);
                            }}>
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Education"
        description={
          message
            ? `Delete '${message.subject}' from ${message.email}?`
            : "Are you sure?"
        }
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}
