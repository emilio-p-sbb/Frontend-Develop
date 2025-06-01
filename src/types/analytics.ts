// --- Tipe data baru untuk Analytics ---
export interface ViewsDataPoint {
  month: string;
  views: number;
  visitors: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface ProjectView {
  name: string;
  views: number;
}

export interface KeyMetrics {
  totalViews: string;
  viewsChange: string;
  uniqueVisitors: string;
  visitorsChange: string;
  countries: string;
  countriesChange: string;
  avgSession: string;
  avgSessionChange: string;
}

export interface AnalyticsData {
  keyMetrics: KeyMetrics;
  viewsTrend: ViewsDataPoint[];
  trafficSources: TrafficSource[];
  projectViews: ProjectView[];
}