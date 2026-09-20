import { apiClient } from "@/lib/api-client";

/**
 * Reports API service.
 * Backend prefix: /api/v1/reports
 */

export type ReportFormat = "excel" | "pdf";
export type ReportTimeframe = "7d" | "30d" | "90d" | "365d";

export interface ExportReportParams {
  format?: ReportFormat;
  timeframe?: ReportTimeframe;
  platform?: string;
}

/**
 * GET /api/v1/reports/export
 * Downloads the report as a binary file (Blob).
 */
export async function exportReport(params: ExportReportParams = {}): Promise<Blob> {
  const { format = "excel", timeframe = "30d", platform } = params;
  const { data } = await apiClient.get("/api/v1/reports/export", {
    params: { format, timeframe, ...(platform ? { platform } : {}) },
    responseType: "blob",
  });
  return data as Blob;
}

/**
 * Convenience helper: trigger a browser file download from a Blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
