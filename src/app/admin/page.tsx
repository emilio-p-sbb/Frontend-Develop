// app/admin/dashboard/page.tsx
// Ini adalah Server Component secara default.

import AdminLayout from "@/components/admin/AdminLayout";
import DashboardClient from "@/components/admin/dashboard/dashboard-client";
import { getDashboardData } from "./dashboard/action";

export default async function AdminDashboardPage() {
  // Ambil data dashboard di sisi server
  const dashboardData = await getDashboardData();

  return (
      <div className="space-y-6">
        {/* Meneruskan semua data yang diambil ke Client Component */}
        <DashboardClient dashboardData={dashboardData} />
      </div>
  );
}