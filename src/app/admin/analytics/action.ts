"use server";

import { AnalyticsData } from '@/types/analytics';
import { revalidatePath } from 'next/cache';

const mockAnalyticsData: AnalyticsData = {
  keyMetrics: {
    totalViews: "12.5K",
    viewsChange: "+15%",
    uniqueVisitors: "8.2K",
    visitorsChange: "+12%",
    countries: "45",
    countriesChange: "+3 new countries",
    avgSession: "3.2m",
    avgSessionChange: "+8%",
  },
  viewsTrend: [
    { month: 'Jan', views: 1200, visitors: 800 },
    { month: 'Feb', views: 1500, visitors: 1000 },
    { month: 'Mar', views: 1800, visitors: 1200 },
    { month: 'Apr', views: 2200, visitors: 1500 },
    { month: 'May', views: 2800, visitors: 1800 },
    { month: 'Jun', views: 3200, visitors: 2100 }
  ],
  trafficSources: [
    { name: 'Direct', value: 45, color: '#3B82F6' },
    { name: 'Google', value: 30, color: '#10B981' },
    { name: 'LinkedIn', value: 15, color: '#8B5CF6' },
    { name: 'Other', value: 10, color: '#F59E0B' }
  ],
  projectViews: [
    { name: 'E-commerce Platform', views: 450 },
    { name: 'Task Management App', views: 320 },
    { name: 'Blog Platform', views: 280 },
    { name: 'Portfolio Website', views: 240 },
    { name: 'API Service', views: 180 }
  ],
};

// Ambil data
export async function getAnalyticsData(): Promise<AnalyticsData> {
  console.log("Server Action: Getting analytics data");
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAnalyticsData;
}

// Aksi ekspor
export async function exportAnalyticsReport(formData: FormData): Promise<void> {
  console.log("Server Action: Exporting analytics report");

  // Bisa ambil data dari formData jika diperlukan
  // const dateRange = formData.get("dateRange");

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Trigger revalidate halaman analytics
  revalidatePath('/admin/analytics');

  // Tidak perlu return apapun (kecuali kamu pakai redirect atau throw)
}
