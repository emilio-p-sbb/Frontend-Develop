// app/admin/analytics/components/key-metrics.tsx
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Eye, Users, Globe, Calendar } from "lucide-react";
import { KeyMetrics } from '@/types/analytics';

interface KeyMetricsDisplayProps {
  metrics: KeyMetrics;
}

export default function KeyMetricsDisplay({ metrics }: KeyMetricsDisplayProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Views */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <h3 className="text-2xl font-bold text-portfolio-navy">{metrics.totalViews}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                {metrics.viewsChange} from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye size={24} className="text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unique Visitors */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <h3 className="text-2xl font-bold text-portfolio-navy">{metrics.uniqueVisitors}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                {metrics.visitorsChange} from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countries */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Countries</p>
              <h3 className="text-2xl font-bold text-portfolio-navy">{metrics.countries}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                {metrics.countriesChange}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe size={24} className="text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avg. Session */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session</p>
              <h3 className="text-2xl font-bold text-portfolio-navy">{metrics.avgSession}</h3>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" />
                {metrics.avgSessionChange} from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar size={24} className="text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}