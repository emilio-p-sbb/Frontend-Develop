// app/admin/analytics/components/analytics-charts.tsx
"use client"; // Ini adalah Client Component karena menggunakan Recharts

import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStore } from "@/stores/adminStore"; // Jika masih digunakan untuk setActiveSection
import { ProjectView, TrafficSource, ViewsDataPoint } from "@/types/analytics";

interface AnalyticsChartsProps {
  viewsTrend: ViewsDataPoint[];
  trafficSources: TrafficSource[];
  projectViews: ProjectView[];
}

export default function AnalyticsCharts({ viewsTrend, trafficSources, projectViews }: AnalyticsChartsProps) {
  const { setActiveSection } = useAdminStore();

  useEffect(() => {
    // Ini mungkin sudah diatur di page.tsx atau layout, tapi aman untuk mengulanginya jika ini komponen utama
    // yang dimuat setelah navigasi di sisi klien.
    setActiveSection('analytics');
  }, [setActiveSection]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Views Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Views & Visitors Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="views" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Views" />
              <Area type="monotone" dataKey="visitors" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Visitors" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficSources}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Views */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Most Viewed Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectViews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}