// app/admin/dashboard/components/dashboard-client.tsx
"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Briefcase,
  Code,
  GraduationCap,
  Users,
  Eye,
  LineChart,
  TrendingUp,
  MessageCircle,
  LucideIcon // Penting: Impor LucideIcon jika Anda menggunakan TypeScript untuk tipe
} from "lucide-react"; // <-- Impor semua ikon di sini!
import { useAdminStore } from "@/stores/adminStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardData } from "@/types/dashboard";

interface DashboardClientProps {
  dashboardData: DashboardData;
}

// Objek pemetaan untuk mengonversi string ikon menjadi komponen ikon
const iconMap: { [key: string]: LucideIcon } = { // Gunakan LucideIcon dari lucide-react untuk tipe
  Briefcase,
  Code,
  GraduationCap,
  Users,
  Eye,
  LineChart,
  TrendingUp,
  MessageCircle,
};

export default function DashboardClient({ dashboardData }: DashboardClientProps) {
  const { setActiveSection, unreadMessages } = useAdminStore();

  const { userName, stats, recentActivities, unreadMessages: initialUnreadMessages } = dashboardData;
  const displayUnreadMessages = unreadMessages ?? initialUnreadMessages;

  useEffect(() => {
    document.title = "Admin Dashboard | Portfolio";
    setActiveSection('dashboard');
  }, [setActiveSection]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userName || 'Admin'}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your portfolio today.</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
              <Eye size={16} />
              View Portfolio
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button size="sm" className="hidden md:flex items-center gap-2">
              <TrendingUp size={16} />
              Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = iconMap[stat.icon]; // Dapatkan komponen ikon dari map
          return (
            <Card key={index} className="overflow-hidden border-l-4" style={{ borderLeftColor: stat.color.replace('bg-', 'var(--') + ')' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <p className={`text-xs mt-1.5 ${stat.change.includes('-') ? 'text-red-500' : 'text-green-500'} flex items-center`}>
                      {stat.change.includes('-') ? '↓' : '↑'} {stat.change} this month
                    </p>
                  </div>
                  <div className={`${stat.color} text-white p-3.5 rounded-full`}>
                    {IconComponent && <IconComponent size={22} />} {/* Render komponen ikon */}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-portfolio-light-blue">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/activity" className="text-xs">View all</Link>
              </Button>
            </div>
            <CardDescription>Latest updates to your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => {
                const ActivityIconComponent = iconMap[activity.icon]; // Dapatkan komponen ikon dari map
                return (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 rounded-full ${i % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center flex-shrink-0`}>
                      {ActivityIconComponent && <ActivityIconComponent size={16} />} {/* Render komponen ikon */}
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}: {activity.item}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ... (bagian Quick Links tetap sama) ... */}
        <Card className="border-t-4 border-t-portfolio-navy">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/settings" className="text-xs">Settings</Link>
                </Button>
              </div>
              <CardDescription>Manage your portfolio content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/projects" className="no-underline">
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors hover:shadow">
                    <CardContent className="flex items-center space-x-3 p-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Code size={16} />
                      </div>
                      <span className="font-medium">Add Project</span>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/admin/experience" className="no-underline">
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors hover:shadow">
                    <CardContent className="flex items-center space-x-3 p-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                        <Briefcase size={16} />
                      </div>
                      <span className="font-medium">Add Experience</span>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/admin/skills" className="no-underline">
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors hover:shadow">
                    <CardContent className="flex items-center space-x-3 p-4">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={16} />
                      </div>
                      <span className="font-medium">Add Skill</span>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/admin/analytics" className="no-underline">
                  <Card className="hover:bg-muted/50 cursor-pointer transition-colors hover:shadow">
                    <CardContent className="flex items-center space-x-3 p-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <LineChart size={16} />
                      </div>
                      <span className="font-medium">Analytics</span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              <div className="mt-4 p-4 border border-dashed rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2 flex items-center">
                  <Users size={16} className="mr-2 text-portfolio-light-blue" />
                  Recent Messages
                </h4>
                <p className="text-sm text-muted-foreground">
                  You have {displayUnreadMessages} unread messages from potential clients.
                </p>
                <Link href="/admin/messages">
                  <Button variant="link" size="sm" className="px-0 mt-1">Check messages</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
}