import { TrendingUp, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import KeyMetricsDisplay from "@/components/admin/analytics/key-metrics";
import AnalyticsCharts from "@/components/admin/analytics/analytic-chart";
import { exportAnalyticsReport, getAnalyticsData } from "./action";

export default async function AdminAnalyticsPage() {
  const analyticsData = await getAnalyticsData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="text-portfolio-light-blue" />
            Analytics
          </h1>
          <p className="text-gray-500 mt-1">
            Track your portfolio performance and visitor insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar size={16} className="mr-2" />
            Last 30 days
          </Button>

          <form action={exportAnalyticsReport}>
            {/* Optional: bisa kirim data juga */}
            {/* <input type="hidden" name="dateRange" value="last30days" /> */}
            <Button size="sm" type="submit">
              <Download size={16} className="mr-2" />
              Export Report
            </Button>
          </form>
        </div>
      </div>

      <KeyMetricsDisplay metrics={analyticsData.keyMetrics} />
      <AnalyticsCharts
        viewsTrend={analyticsData.viewsTrend}
        trafficSources={analyticsData.trafficSources}
        projectViews={analyticsData.projectViews}
      />
    </div>
  );
}
