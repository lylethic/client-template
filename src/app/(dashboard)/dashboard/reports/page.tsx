"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadBlob, exportReport } from "@/modules/reports/reports.service";
import type { ReportFormat, ReportTimeframe } from "@/modules/reports/reports.service";

const TIMEFRAME_OPTIONS: { value: ReportTimeframe; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "365d", label: "Last 365 days" },
];

const PLATFORM_OPTIONS = [
  { value: "all", label: "All Platforms" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "threads", label: "Threads" },
];

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState<ReportTimeframe>("30d");
  const [platform, setPlatform] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<ReportFormat | null>(null);

  const handleExport = async (format: ReportFormat) => {
    setLoading(format);
    try {
      const blob = await exportReport({ format, timeframe, platform });
      const filename = `social_insight_report_${timeframe}.${format === "excel" ? "xlsx" : "pdf"}`;
      downloadBlob(blob, filename);
      toast.success(`${format === "excel" ? "Excel" : "PDF"} report downloaded!`);
    } catch {
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm">
          Export comprehensive analytics reports in Excel or PDF format
        </p>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Report</CardTitle>
          <CardDescription>
            Choose your filters and download a detailed analytics report.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 sm:flex sm:grid-cols-2 sm:flex-wrap">
            <div className="min-w-[140px] flex-1 space-y-1.5">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={(v) => setTimeframe(v as ReportTimeframe)}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAME_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[140px] flex-1 space-y-1.5">
              <label className="text-sm font-medium">Platform</label>
              <Select
                value={platform ?? "all"}
                onValueChange={(v) => setPlatform(!v || v === "all" ? undefined : v)}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              onClick={() => handleExport("excel")}
              disabled={loading !== null}
              className="w-full cursor-pointer justify-center gap-2 sm:w-auto"
            >
              {loading === "excel" ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <FileSpreadsheet className="size-5" aria-hidden />
              )}
              {loading === "excel" ? "Generating…" : "Download Excel (.xlsx)"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleExport("pdf")}
              disabled={loading !== null}
              className="w-full cursor-pointer justify-center gap-2 sm:w-auto"
            >
              {loading === "pdf" ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <FileText className="size-5" aria-hidden />
              )}
              {loading === "pdf" ? "Generating…" : "Download PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* What's included */}
      <Card>
        <CardHeader>
          <CardTitle>Report Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Channel Overview", desc: "Followers, views, and engagement per channel" },
              {
                label: "Growth Analysis",
                desc: "Week-over-week and month-over-month growth rates",
              },
              { label: "Top Performing Posts", desc: "Best content ranked by engagement rate" },
              {
                label: "Daily Time Series",
                desc: "Day-by-day metric breakdown for trend analysis",
              },
              { label: "Platform Comparison", desc: "Side-by-side comparison across platforms" },
              { label: "Post Metrics Detail", desc: "Likes, comments, shares per post" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 shrink-0 text-xs">
                  ✓
                </Badge>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
