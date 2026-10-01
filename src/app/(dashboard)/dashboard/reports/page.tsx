import type { Metadata } from "next";

import { ReportsClient } from "./_components/reports-client";

export const metadata: Metadata = {
  title: "Xuất báo cáo dữ liệu | Export Reports",
  description:
    "Xuất báo cáo phân tích hiệu suất và tăng trưởng mạng xã hội định dạng Excel (.xlsx) và PDF.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReportsPage() {
  return <ReportsClient />;
}
