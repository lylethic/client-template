"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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

export function ReportsClient() {
  const t = useTranslations("reports");
  const tCommon = useTranslations("common");

  const [timeframe, setTimeframe] = useState<ReportTimeframe>("30d");
  const [platform, setPlatform] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<ReportFormat | null>(null);

  const timeframeOptions: { value: ReportTimeframe; label: string }[] = [
    { value: "7d", label: tCommon("time7d") },
    { value: "30d", label: tCommon("time30d") },
    { value: "90d", label: tCommon("time90d") },
    { value: "365d", label: t("time365d") },
  ];

  const platformOptions = [
    { value: "all", label: tCommon("allPlatforms") },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "threads", label: "Threads" },
  ];

  const handleExport = async (format: ReportFormat) => {
    setLoading(format);
    try {
      const blob = await exportReport({ format, timeframe, platform });
      const filename = `social_insight_report_${timeframe}.${format === "excel" ? "xlsx" : "pdf"}`;
      downloadBlob(blob, filename);
      toast.success(t("success"));
    } catch {
      toast.error(t("failed"));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>{t("exportConfig")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 sm:flex sm:grid-cols-2 sm:flex-wrap">
            <div className="min-w-[140px] flex-1 space-y-1.5">
              <label className="text-sm font-medium">{t("timeframe")}</label>
              <Select value={timeframe} onValueChange={(v) => setTimeframe(v as ReportTimeframe)}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[140px] flex-1 space-y-1.5">
              <label className="text-sm font-medium">{t("platform")}</label>
              <Select
                value={platform ?? "all"}
                onValueChange={(v) => setPlatform(!v || v === "all" ? undefined : v)}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((o) => (
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
              {loading === "excel" ? tCommon("exporting") : t("downloadExcel")}
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
              {loading === "pdf" ? tCommon("exporting") : t("downloadPdf")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* What's included */}
      <Card>
        <CardHeader>
          <CardTitle>{t("excelReportTitle")}</CardTitle>
          <CardDescription>{t("excelReportDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: t("pdfReportTitle"),
                desc: t("pdfReportDesc"),
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5 shrink-0 text-xs">
                  ✓
                </Badge>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
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
