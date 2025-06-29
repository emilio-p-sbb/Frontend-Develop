'use client';

import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { Users } from "@/types/user";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { Progress } from "../ui/progress";


interface AdminLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export default function AdminLayout({ children, onSearch }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(33), 300);
    const timer2 = setTimeout(() => setProgress(66), 800);
    const timer3 = setTimeout(() => setProgress(100), 1200);
    const timer4 = setTimeout(() => setShowProgress(false), 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar collapsed={sidebarCollapsed} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-0'}`}>

        {showProgress && (
          <div className="w-full bg-slate-100 border-b">
            <Progress 
              value={progress} 
              className="h-1 w-full rounded-none [&>div]:bg-slate-700 [&>div]:transition-all [&>div]:duration-500" 
            />
          </div>
        )}
        
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
