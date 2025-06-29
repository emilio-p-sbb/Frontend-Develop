"use client";

import React, { useEffect, useState } from "react";
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
import { useUpdateByIdResource } from "@/hooks/private/use-update-resource";
import { useDeleteResource } from "@/hooks/private/use-delete-resource";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { revalidatePath } from "next/cache";

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

//useUpdateByIdResource
  const { mutate: updateMessage, isPending: isUpdating } = useUpdateByIdResource<Message>("messages");
  const deleteOne = useDeleteResource<Message>("messages");

  const { unreadMessages, setUnreadMessages } = useAdminStore();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (open && !message.read) {
      updateMessage({id:message.id, path:'read'})
      // markMessageAsRead(message.id);
      setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
    }
  }, [open, message, unreadMessages, setUnreadMessages]);

  const handleToggleStarred = async () => {
    try {
      // await toggleMessageStarred(message.id, !message.starred);
      console.log('message.starred = '+message.starred)
      if(message.starred==true){
        await updateMessage({id:message.id, path:'unstarred'});
      }else{
        await updateMessage({id:message.id, path:'starred'});
      }
      
    } catch (error) {
      console.error("Failed to toggle starred status:", error);
    }
  };

  const handleArchive = async () => {
    try {
      await updateMessage({id:message.id, path:'archive'})
      // await archiveMessage(message.id);
      if (!message.read) {
        setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to archive message:", error);
    }
  };

  const handleUnarchive = async () => {
    try {
      await updateMessage({id:message.id, path:'unarchive'})
      // await unarchiveMessage(message.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to unarchive message:", error);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteOne.mutateAsync(deleteId);
        if (!message.read) {
          setUnreadMessages(unreadMessages > 0 ? unreadMessages - 1 : 0);
        }
      } catch (err) {
        console.error(err);
      }
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleMarkUnread = async () => {
    try {
      await updateMessage({id:message.id, path:'unread'});
      // await markMessageAsUnread(message.id);
      setUnreadMessages(unreadMessages + 1);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to mark as unread:", error);
    }
  };

  return (
    <>
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
            disabled={!message.read}
          >
            <MailOpen size={16} className="mr-2" /> Mark as Unread
          </Button>
          <Button variant="outline" size="sm" onClick={handleToggleStarred}>
            <Star
              size={16}
              className={`mr-2 ${
                message.starred ? "text-yellow-500 fill-current" : ""
              }`}
            />
            {message.starred ? "Unstar" : "Star"}
          </Button>
          {message.archived ? (
            <Button variant="outline" size="sm" onClick={handleUnarchive}>
              <FolderOpen size={16} className="mr-2" /> Unarchive
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleArchive}>
              <Archive size={16} className="mr-2" /> Archive
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={() => {
                              setDeleteId(message.id);
                              setIsDeleteDialogOpen(true);
                            }}>
            <Trash2 size={16} className="mr-2" /> Delete
          </Button>
          <Button size="sm">
            <Reply size={16} className="mr-2" /> Reply
          </Button>
        </div>
      </DialogContent>
    </Dialog>

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
