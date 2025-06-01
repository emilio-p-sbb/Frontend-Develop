'use client';

import { useState } from "react";
import { useSession } from 'next-auth/react';
import { Users } from "@/types/user";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";


interface AdminLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export default function AdminLayout({ children, onSearch }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar collapsed={sidebarCollapsed} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-0'}`}>
        <AdminNavbar onToggleSidebar={toggleSidebar} user={session?.user as Users} onSearch={onSearch} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
        <footer className="py-4 px-6 bg-white border-t text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Berkat Wahyu Purba - Portfolio Admin
        </footer>
      </div>
    </div>
  );
}
