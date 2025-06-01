// app/admin/dashboard/actions.ts
"use server";

import { DashboardData, DashboardStat, RecentActivity } from "@/types/dashboard";

// Hapus import icons dari lucide-react di sini:
// import { Briefcase, Code, GraduationCap, Eye, MessageCircle } from "lucide-react";

// Simulasikan pengambilan data dari database atau API
export async function getDashboardData(): Promise<DashboardData> {
  console.log("Server Action: Mengambil data dashboard");

  // Simulasi penundaan jaringan
  await new Promise(resolve => setTimeout(resolve, 700));

  // Simulasi data pengguna
  const userName = "Jane Doe";

  // Simulasi data statistik
  const stats: DashboardStat[] = [
    // Lewatkan nama ikon sebagai string
    { title: "Total Projects", value: "12", icon: "Code", change: "+2", color: "bg-blue-500" },
    { title: "Work Experience", value: "2", icon: "Briefcase", change: "0", color: "bg-green-500" },
    { title: "Skills", value: "18", icon: "GraduationCap", change: "+3", color: "bg-yellow-500" },
    { title: "Portfolio Views", value: "2.4k", icon: "Eye", change: "+15%", color: "bg-purple-500" },
  ];

  // Simulasi aktivitas terbaru
  const recentActivities: RecentActivity[] = [
    // Lewatkan nama ikon sebagai string
    { action: "Updated Project", item: "E-commerce Backend", time: "2 days ago", icon: "Code" },
    { action: "Added Skill", item: "Docker", time: "3 days ago", icon: "GraduationCap" },
    { action: "New Message", item: "Job opportunity inquiry", time: "5 days ago", icon: "MessageCircle" },
    { action: "Updated Experience", item: "PT. Arthamas Solusindo", time: "1 week ago", icon: "Briefcase" }
  ];

  // Simulasi jumlah pesan belum dibaca
  const unreadMessages = 3;

  return {
    userName,
    stats,
    recentActivities,
    unreadMessages,
  };
}