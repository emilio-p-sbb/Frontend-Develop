// app/admin/messages/actions.ts
"use server"; // HARUS DI BARIS PALING ATAS

import { Message } from '@/types/message';
import { revalidatePath } from 'next/cache';

// Mock data untuk Messages (dalam aplikasi nyata, ini akan berinteraksi dengan database)
const mockMessages: Message[] = [
  {
    id: 1,
    from: "John Doe",
    email: "john@example.com",
    subject: "Job Opportunity - Senior Full Stack Developer",
    message: "Hi, I'm interested in discussing a senior full stack developer position. Your profile on LinkedIn caught my attention, especially your experience with Java and Spring Boot. I believe your skills align perfectly with our current opening at Tech Solutions Inc. Would you be open to a brief chat next week to explore this further? Please let me know your availability. Looking forward to your response!",
    time: "2 hours ago",
    isRead: false,
    isStarred: true,
    isArchived: false,
  },
  {
    id: 2,
    from: "Sarah Wilson",
    email: "sarah@techcorp.com",
    subject: "Project Collaboration Inquiry",
    message: "We would like to collaborate on an upcoming project involving a new data analytics platform. Your expertise in PostgreSQL and Kafka could be highly beneficial. We're looking for a lead developer to help us design and implement the backend. Would you be interested in learning more about this exciting opportunity? We can schedule a call to discuss the project scope and your potential role.",
    time: "5 hours ago",
    isRead: false,
    isStarred: false,
    isArchived: false,
  },
  {
    id: 3,
    from: "Mike Johnson",
    email: "mike@startup.io",
    subject: "Freelance Web Development",
    message: "Looking for a freelancer to help with our web application, specifically with the frontend using React. We're a fast-growing startup and need someone who can quickly jump in and contribute. Our current project involves building out new user-facing features and improving existing ones. If you're available for freelance work, please share your rates and portfolio.",
    time: "1 day ago",
    isRead: false,
    isStarred: false,
    isArchived: false,
  },
  {
    id: 4,
    from: "Emma Davis",
    email: "emma@design.com",
    subject: "UI/UX Consultation",
    message: "Would you be available for a UI/UX consultation project? We're redesigning our mobile application and need an expert to guide us on best practices and user-centered design principles. Your portfolio shows a strong understanding of modern design trends. Please let us know your hourly rates and availability for a consultation session.",
    time: "2 days ago",
    isRead: true,
    isStarred: false,
    isArchived: false,
  },
  {
    id: 5,
    from: "Global Recruiters",
    email: "info@globalrecruiters.com",
    subject: "Hiring for Lead Software Engineer",
    message: "We came across your profile and are currently recruiting for a Lead Software Engineer position with extensive experience in distributed systems. Your background in Kafka and Java is a strong match. Please reach out if you are interested in hearing more about this role.",
    time: "3 days ago",
    isRead: true,
    isStarred: true,
    isArchived: false,
  },
  {
    id: 6,
    from: "Marketing Agency X",
    email: "contact@agencyx.com",
    subject: "Partnership Proposal",
    message: "Our agency is looking for a development partner for several upcoming client projects. Your portfolio demonstrates diverse skills that align with our needs. Would you be open to discussing a potential long-term partnership?",
    time: "1 week ago",
    isRead: true,
    isStarred: false,
    isArchived: true, // Archived message
  }
];

// Helper to update a message and revalidate
async function updateAndRevalidate(id: number, updates: Partial<Message>) {
  const messageIndex = mockMessages.findIndex(msg => msg.id === id);
  if (messageIndex !== -1) {
    mockMessages[messageIndex] = { ...mockMessages[messageIndex], ...updates };
  }
  revalidatePath('/admin/messages');
  return mockMessages[messageIndex];
}

// Fungsi untuk mendapatkan semua pesan
export async function getMessages(): Promise<Message[]> {
  console.log("Server Action: Getting all messages");
  return mockMessages;
}

// Fungsi untuk menandai pesan sebagai sudah dibaca
export async function markMessageAsRead(id: number) {
  console.log(`Server Action: Marking message ${id} as read`);
  await updateAndRevalidate(id, { isRead: true });
}

// Fungsi untuk menandai pesan sebagai belum dibaca
export async function markMessageAsUnread(id: number) {
  console.log(`Server Action: Marking message ${id} as unread`);
  await updateAndRevalidate(id, { isRead: false });
}

// Fungsi untuk menandai/batal menandai pesan sebagai bintang
export async function toggleMessageStarred(id: number, isStarred: boolean) {
  console.log(`Server Action: Toggling message ${id} starred status to ${isStarred}`);
  await updateAndRevalidate(id, { isStarred });
}

// Fungsi untuk mengarsipkan pesan
export async function archiveMessage(id: number) {
  console.log(`Server Action: Archiving message ${id}`);
  await updateAndRevalidate(id, { isArchived: true });
}

// Fungsi untuk mengembalikan pesan dari arsip
export async function unarchiveMessage(id: number) {
    console.log(`Server Action: Unarchiving message ${id}`);
    await updateAndRevalidate(id, { isArchived: false });
}

// Fungsi untuk menghapus pesan
export async function deleteMessage(id: number) {
  console.log(`Server Action: Deleting message ${id}`);
  const initialLength = mockMessages.length;
  const updatedMessages = mockMessages.filter(msg => msg.id !== id);
  mockMessages.splice(0, mockMessages.length, ...updatedMessages); // Replace content
  revalidatePath('/admin/messages');
  return initialLength > updatedMessages.length;
}

// Fungsi untuk mengarsipkan semua pesan yang belum dibaca
export async function archiveAllReadMessages() {
  console.log("Server Action: Archiving all read messages");
  mockMessages.forEach(msg => {
    if (msg.isRead && !msg.isArchived) {
      msg.isArchived = true;
    }
  });
  revalidatePath('/admin/messages');
}

// Fungsi untuk menandai semua pesan sebagai penting
export async function markAllImportant() {
  console.log("Server Action: Marking all messages as important");
  mockMessages.forEach(msg => {
    msg.isStarred = true;
  });
  revalidatePath('/admin/messages');
}

// Fungsi untuk mengirim pesan baru (jika ada form kontak di frontend)
export async function sendMessage(formData: { from: string; email: string; subject: string; message: string }) {
    console.log("Server Action: Receiving new message", formData);
    const newId = mockMessages.length > 0 ? Math.max(...mockMessages.map(m => m.id)) + 1 : 1;
    const newMessage: Message = {
        id: newId,
        time: "Just now", // Atau gunakan format Date real
        isRead: false,
        isStarred: false,
        isArchived: false,
        ...formData
    };
    mockMessages.unshift(newMessage); // Tambahkan ke awal
    revalidatePath('/admin/messages');
    return newMessage;
}