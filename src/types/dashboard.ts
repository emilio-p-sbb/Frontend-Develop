// lib/types.ts

// ... (existing types)

export interface DashboardStat {
  title: string;
  value: string;
  // icon: React.ElementType; // Ganti ini
  icon: string; // Menjadi string
  change: string;
  color: string;
}

export interface RecentActivity {
  action: string;
  item: string;
  time: string;
  // icon: React.ElementType; // Ganti ini
  icon: string; // Menjadi string
}

export interface DashboardData {
  stats: DashboardStat[];
  recentActivities: RecentActivity[];
  // unreadMessages: number;
}